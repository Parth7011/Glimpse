import io
import logging
import uuid
import time
from typing import Any
from PIL import Image

from mlpipeline.config import settings
from mlpipeline.storage.factory import get_storage_provider
from mlpipeline.storage.base import BaseStorageProvider
from mlpipeline.face_engine.detector import FaceEngine
from mlpipeline.db.repository import PhotoRepository, FaceRepository, EventRepository

logger = logging.getLogger(__name__)

class PhotographerPipeline:
    """
    Photographer-Side ML Pipeline:
    1. Retrieve event photos from Object Storage (Supabase Storage / Local).
    2. Detect faces & generate 512-dim ArcFace embeddings using InsightFace.
    3. Persist face embeddings with pgvector and associate them with photo & event IDs.
    4. Update photo & event status and statistics.
    """

    def __init__(
        self,
        storage_provider: BaseStorageProvider | None = None,
        face_engine: FaceEngine | None = None
    ):
        self.storage = storage_provider or get_storage_provider()
        self.face_engine = face_engine or FaceEngine.get_instance()

    def process_single_photo(
        self,
        event_id: str,
        storage_path: str,
        photo_id: str | None = None,
        filename: str | None = None,
        generate_thumbnail: bool = False
    ) -> dict[str, Any]:
        """
        Executes the photographer pipeline on a single photo:
        - Downloads image from storage
        - Detects faces and computes 512-dim embeddings via InsightFace
        - Stores the photo record and face embeddings in PostgreSQL (pgvector)
        - Returns full mapped result with photo_id and face embedding IDs
        """
        start_time = time.perf_counter()
        photo_id = photo_id or str(uuid.uuid4())
        filename = filename or storage_path.split("/")[-1]

        logger.info(f"==> Processing photo: photo_id={photo_id}, event_id={event_id}, path={storage_path}")

        # Step 1: Get image from object storage
        try:
            image_bytes = self.storage.download_image(storage_path)
            size_bytes = len(image_bytes)
        except Exception as e:
            logger.error(f"Failed to fetch image from storage ({storage_path}): {e}")
            PhotoRepository.create_or_update_photo(
                photo_id=photo_id,
                event_id=event_id,
                storage_path=storage_path,
                filename=filename,
                status="failed",
                size_bytes=0
            )
            return {
                "photo_id": photo_id,
                "event_id": event_id,
                "status": "failed",
                "error": str(e),
                "faces_detected": 0,
                "faces": []
            }

        # Determine image dimensions via PIL
        width, height = None, None
        try:
            with Image.open(io.BytesIO(image_bytes)) as pil_img:
                width, height = pil_img.size
        except Exception as e:
            logger.warning(f"Could not parse image dimensions: {e}")

        # Register photo in database with status='processing'
        PhotoRepository.create_or_update_photo(
            photo_id=photo_id,
            event_id=event_id,
            storage_path=storage_path,
            filename=filename,
            status="processing",
            width=width,
            height=height,
            size_bytes=size_bytes
        )

        # Step 2: Extract faces and generate 512-dim embeddings using InsightFace
        try:
            detected_faces = self.face_engine.extract_faces_from_bytes(image_bytes)
        except Exception as e:
            logger.error(f"Face extraction failed for photo_id={photo_id}: {e}")
            PhotoRepository.update_photo_status(photo_id, status="failed", face_count=0)
            return {
                "photo_id": photo_id,
                "event_id": event_id,
                "status": "failed",
                "error": f"Face extraction error: {str(e)}",
                "faces_detected": 0,
                "faces": []
            }

        # Step 3: Store face embeddings and bounding boxes in pgvector
        saved_faces = []
        if detected_faces:
            saved_faces = FaceRepository.save_face_embeddings(
                event_id=event_id,
                photo_id=photo_id,
                faces_data=detected_faces
            )

        # Step 4: Update photo status to 'ready'
        face_count = len(saved_faces)
        PhotoRepository.update_photo_status(photo_id, status="ready", face_count=face_count)

        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.info(
            f"Successfully processed photo_id={photo_id} | "
            f"Faces detected: {face_count} | Time: {elapsed_ms}ms"
        )

        return {
            "photo_id": photo_id,
            "event_id": event_id,
            "filename": filename,
            "storage_path": storage_path,
            "status": "ready",
            "faces_detected": face_count,
            "processing_time_ms": elapsed_ms,
            "faces": saved_faces
        }

    def process_event_batch(
        self,
        event_id: str,
        photos: list[dict[str, Any]]
    ) -> dict[str, Any]:
        """
        Processes a batch of photos for a given event:
        
        photos: list of dicts with:
        [
            {"storage_path": "/events/evt-1/photo1.jpg", "photo_id": "optional-id", "filename": "photo1.jpg"},
            ...
        ]
        """
        start_batch_time = time.perf_counter()
        logger.info(f"Starting batch processing of {len(photos)} photos for event_id={event_id}")

        results = []
        total_faces = 0
        successful = 0
        failed = 0

        for item in photos:
            storage_path = item.get("storage_path") or item.get("path")
            photo_id = item.get("photo_id") or item.get("id")
            filename = item.get("filename")

            if not storage_path:
                logger.warning(f"Skipping item without storage_path: {item}")
                continue

            res = self.process_single_photo(
                event_id=event_id,
                storage_path=storage_path,
                photo_id=photo_id,
                filename=filename
            )

            results.append(res)
            if res["status"] == "ready":
                successful += 1
                total_faces += res["faces_detected"]
            else:
                failed += 1

        # Update event level aggregates
        try:
            EventRepository.update_event_counts(event_id)
        except Exception as e:
            logger.warning(f"Could not update event aggregate counts: {e}")

        total_time = round((time.perf_counter() - start_batch_time) * 1000, 2)
        logger.info(
            f"Batch completed for event_id={event_id} | "
            f"Total: {len(photos)}, Success: {successful}, Failed: {failed}, "
            f"Total Faces Indexed: {total_faces} | Time: {total_time}ms"
        )

        return {
            "event_id": event_id,
            "total_photos_processed": len(photos),
            "successful_photos": successful,
            "failed_photos": failed,
            "total_faces_indexed": total_faces,
            "total_time_ms": total_time,
            "photo_results": results
        }

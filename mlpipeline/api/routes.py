"""
Photographer ML Pipeline API Routes.

These endpoints are INTERNAL — called only by the Express.js backend,
never directly by the browser/frontend.

Endpoints:
  POST /process-photo        → Process a single photo (detect faces, store embeddings)
  POST /process-batch        → Process multiple photos for an event
  GET  /event/{id}/status    → Get processing progress for an event
  GET  /event/{id}/faces     → Get all indexed faces for an event
  GET  /photo/{id}/status    → Get processing status for a single photo
  GET  /photo/{id}/faces     → Get all faces detected in a photo
  GET  /health               → Health check / warm-up endpoint for Render
"""

import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks

from mlpipeline.pipeline.photographer_pipeline import PhotographerPipeline
from mlpipeline.face_engine.detector import FaceEngine
from mlpipeline.db.repository import (
    EventRepository,
    PhotoRepository,
    FaceRepository,
    get_supabase_client,
)
from mlpipeline.config import settings
from .schemas import (
    ProcessPhotoRequest,
    ProcessBatchRequest,
    ProcessPhotoResponse,
    ProcessBatchResponse,
    EventStatusResponse,
    PhotoStatusResponse,
    HealthResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# ─── Lazy-initialized singleton pipeline ────────────────────────────
_pipeline: PhotographerPipeline | None = None


def _get_pipeline() -> PhotographerPipeline:
    """Returns (and lazily creates) the singleton PhotographerPipeline."""
    global _pipeline
    if _pipeline is None:
        _pipeline = PhotographerPipeline()
    return _pipeline


# ─── POST /process-photo ───────────────────────────────────────────

@router.post(
    "/process-photo",
    response_model=ProcessPhotoResponse,
    summary="Process a single photographer photo",
    description=(
        "Downloads the photo from Supabase Storage, runs InsightFace face detection, "
        "extracts 512-dim ArcFace embeddings, and stores them in PostgreSQL pgvector. "
        "Called by the Express.js backend after a photographer uploads a photo."
    ),
)
async def process_photo(request: ProcessPhotoRequest):
    pipeline = _get_pipeline()

    try:
        result = pipeline.process_single_photo(
            event_id=request.event_id,
            storage_path=request.storage_path,
            photo_id=request.photo_id,
            filename=request.filename,
        )
    except Exception as e:
        logger.exception(f"Unhandled error processing photo: {e}")
        raise HTTPException(status_code=500, detail=f"ML pipeline error: {str(e)}")

    return ProcessPhotoResponse(**result)


# ─── POST /process-batch ──────────────────────────────────────────

@router.post(
    "/process-batch",
    response_model=ProcessBatchResponse,
    summary="Batch-process multiple photos for an event",
    description=(
        "Processes a list of photos for a given event. Each photo goes through "
        "face detection → embedding extraction → pgvector storage. "
        "The event record is created/updated automatically."
    ),
)
async def process_batch(request: ProcessBatchRequest):
    pipeline = _get_pipeline()

    # Ensure the event record exists
    event_name = request.event_name or request.event_id
    event_slug = request.event_slug or request.event_id
    try:
        EventRepository.ensure_event_exists(
            event_id=request.event_id,
            name=event_name,
            slug=event_slug,
        )
    except Exception as e:
        logger.warning(f"Could not ensure event exists: {e}")

    # Convert Pydantic PhotoItem list → list of dicts for the pipeline
    photos_dicts = [item.model_dump() for item in request.photos]

    try:
        result = pipeline.process_event_batch(
            event_id=request.event_id,
            photos=photos_dicts,
        )
    except Exception as e:
        logger.exception(f"Unhandled error in batch processing: {e}")
        raise HTTPException(status_code=500, detail=f"Batch pipeline error: {str(e)}")

    return ProcessBatchResponse(**result)


# ─── POST /process-batch-async ─────────────────────────────────────

@router.post(
    "/process-batch-async",
    summary="Start batch processing in the background (fire-and-forget)",
    description=(
        "Same as /process-batch but returns immediately with a 202 Accepted. "
        "The Express backend can poll GET /event/{id}/status for progress."
    ),
    status_code=202,
)
async def process_batch_async(
    request: ProcessBatchRequest,
    background_tasks: BackgroundTasks,
):
    pipeline = _get_pipeline()

    # Ensure event exists
    event_name = request.event_name or request.event_id
    event_slug = request.event_slug or request.event_id
    try:
        EventRepository.ensure_event_exists(
            event_id=request.event_id,
            name=event_name,
            slug=event_slug,
        )
    except Exception as e:
        logger.warning(f"Could not ensure event exists: {e}")

    photos_dicts = [item.model_dump() for item in request.photos]

    def _run_batch():
        try:
            pipeline.process_event_batch(
                event_id=request.event_id,
                photos=photos_dicts,
            )
        except Exception as e:
            logger.exception(f"Background batch processing failed: {e}")

    background_tasks.add_task(_run_batch)

    return {
        "message": "Batch processing started",
        "event_id": request.event_id,
        "total_photos": len(request.photos),
    }


# ─── GET /event/{event_id}/status ──────────────────────────────────

@router.get(
    "/event/{event_id}/status",
    response_model=EventStatusResponse,
    summary="Get event processing status",
    description=(
        "Returns the current processing progress for an event — "
        "how many photos are ready, processing, or failed, and total faces indexed. "
        "Used by Express backend to poll progress after batch upload."
    ),
)
async def get_event_status(event_id: str):
    supabase = get_supabase_client()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")

    try:
        # Count photos by status
        photos_res = supabase.table("photos").select("id, status", count="exact").eq("event_id", event_id).execute()
        photos = photos_res.data or []

        total_photos = len(photos)
        ready = sum(1 for p in photos if p.get("status") == "ready")
        processing = sum(1 for p in photos if p.get("status") == "processing")
        failed = sum(1 for p in photos if p.get("status") == "failed")

        # Count faces
        faces_res = supabase.table("faces").select("id", count="exact").eq("event_id", event_id).execute()
        total_faces = faces_res.count or 0

        return EventStatusResponse(
            event_id=event_id,
            total_photos=total_photos,
            photos_ready=ready,
            photos_processing=processing,
            photos_failed=failed,
            total_faces_indexed=total_faces,
            is_complete=(processing == 0 and total_photos > 0),
        )
    except Exception as e:
        logger.exception(f"Error fetching event status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── GET /event/{event_id}/faces ───────────────────────────────────

@router.get(
    "/event/{event_id}/faces",
    summary="Get all indexed faces for an event",
    description="Returns all face records (without embedding vectors) for a given event.",
)
async def get_event_faces(event_id: str):
    try:
        faces = FaceRepository.get_faces_by_event(event_id)
        # Strip raw embedding vectors from the response to keep payload small
        cleaned = []
        for f in faces:
            face_copy = dict(f)
            face_copy.pop("embedding", None)
            cleaned.append(face_copy)

        return {
            "event_id": event_id,
            "total_faces": len(cleaned),
            "faces": cleaned,
        }
    except Exception as e:
        logger.exception(f"Error fetching event faces: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── GET /photo/{photo_id}/status ─────────────────────────────────

@router.get(
    "/photo/{photo_id}/status",
    response_model=PhotoStatusResponse,
    summary="Get processing status for a single photo",
)
async def get_photo_status(photo_id: str):
    photo = PhotoRepository.get_photo(photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail=f"Photo {photo_id} not found")

    return PhotoStatusResponse(
        photo_id=photo["id"],
        event_id=photo.get("event_id", ""),
        status=photo.get("status", "unknown"),
        face_count=photo.get("face_count", 0),
        filename=photo.get("filename"),
        storage_path=photo.get("storage_path"),
    )


# ─── GET /photo/{photo_id}/faces ──────────────────────────────────

@router.get(
    "/photo/{photo_id}/faces",
    summary="Get all faces detected in a specific photo",
)
async def get_photo_faces(photo_id: str):
    try:
        faces = FaceRepository.get_faces_by_photo(photo_id)
        cleaned = []
        for f in faces:
            face_copy = dict(f)
            face_copy.pop("embedding", None)
            cleaned.append(face_copy)

        return {
            "photo_id": photo_id,
            "total_faces": len(cleaned),
            "faces": cleaned,
        }
    except Exception as e:
        logger.exception(f"Error fetching photo faces: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── GET /health ───────────────────────────────────────────────────

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="ML service health check",
    description=(
        "Returns service health and model status. "
        "Used by Render for warm-up and by Express backend for readiness checks."
    ),
)
async def health_check():
    model_loaded = False
    model_name = settings.INSIGHTFACE_MODEL

    try:
        engine = FaceEngine.get_instance()
        model_loaded = engine.app is not None
    except Exception:
        pass

    return HealthResponse(
        status="ok",
        service="glimpse-ml-pipeline",
        version="1.0.0",
        model_loaded=model_loaded,
        model_name=model_name,
        embedding_dim=settings.EMBEDDING_DIMENSION,
    )

import json
import logging
import uuid
from typing import Any
import numpy as np
from supabase import create_client, Client
from mlpipeline.config import settings
from .connection import get_db_connection

logger = logging.getLogger(__name__)

# Supabase Client Singleton
_supabase_client: Client | None = None

def get_supabase_client() -> Client | None:
    global _supabase_client
    if _supabase_client is None:
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
            try:
                _supabase_client = create_client(
                    settings.SUPABASE_URL, 
                    settings.SUPABASE_SERVICE_ROLE_KEY
                )
            except Exception as e:
                logger.warning(f"Could not create Supabase client: {e}")
    return _supabase_client

# In-memory store fallback for offline testing when no live DB/Supabase is connected
_IN_MEMORY_EVENTS: dict[str, dict] = {}
_IN_MEMORY_PHOTOS: dict[str, dict] = {}
_IN_MEMORY_FACES: dict[str, list[dict]] = {}


class EventRepository:
    @staticmethod
    def ensure_event_exists(event_id: str, name: str, slug: str, photographer_id: str = "photographer-default") -> dict[str, Any]:
        """Ensures the event record exists in Supabase or PostgreSQL."""
        supabase = get_supabase_client()
        if supabase:
            try:
                # Ensure dummy photographer exists
                try:
                    supabase.table("photographers").upsert({
                        "id": photographer_id,
                        "email": f"{photographer_id}@glimpse.com",
                        "name": "Arjun Kapoor"
                    }).execute()
                except Exception:
                    pass

                payload = {
                    "id": event_id,
                    "photographer_id": photographer_id,
                    "name": name,
                    "slug": slug,
                    "status": "uploading"
                }
                res = supabase.table("events").upsert(payload).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                logger.warning(f"Supabase upsert event failed: {e}")

        # Fallback to direct Postgres if configured
        if settings.DATABASE_URL:
            try:
                query = """
                INSERT INTO events (id, photographer_id, name, slug, status, photo_count, face_count)
                VALUES (%s, %s, %s, %s, 'uploading', 0, 0)
                ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug
                RETURNING *;
                """
                with get_db_connection() as conn:
                    with conn.cursor() as cur:
                        cur.execute(query, (event_id, photographer_id, name, slug))
                        return cur.fetchone()
            except Exception as e:
                logger.debug(f"Direct postgres unavailable: {e}")

        # In-memory fallback
        event = {
            "id": event_id,
            "photographer_id": photographer_id,
            "name": name,
            "slug": slug,
            "status": "uploading",
            "photo_count": 0,
            "face_count": 0
        }
        _IN_MEMORY_EVENTS[event_id] = event
        return event

    @staticmethod
    def update_event_counts(event_id: str) -> dict[str, Any] | None:
        """Recalculates and updates total photos and faces for an event."""
        supabase = get_supabase_client()
        if supabase:
            try:
                photos_res = supabase.table("photos").select("id", count="exact").eq("event_id", event_id).execute()
                faces_res = supabase.table("faces").select("id", count="exact").eq("event_id", event_id).execute()
                photo_count = photos_res.count or 0
                face_count = faces_res.count or 0

                res = supabase.table("events").update({
                    "photo_count": photo_count,
                    "face_count": face_count,
                    "status": "ready"
                }).eq("id", event_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                logger.warning(f"Supabase update event counts failed: {e}")

        # In-memory fallback
        if event_id in _IN_MEMORY_EVENTS:
            photos_count = sum(1 for p in _IN_MEMORY_PHOTOS.values() if p.get("event_id") == event_id)
            faces_count = sum(len(f_list) for p_id, f_list in _IN_MEMORY_FACES.items() if _IN_MEMORY_PHOTOS.get(p_id, {}).get("event_id") == event_id)
            _IN_MEMORY_EVENTS[event_id]["photo_count"] = photos_count
            _IN_MEMORY_EVENTS[event_id]["face_count"] = faces_count
            _IN_MEMORY_EVENTS[event_id]["status"] = "ready"
            return _IN_MEMORY_EVENTS[event_id]
        return None


class PhotoRepository:
    @staticmethod
    def create_or_update_photo(
        photo_id: str,
        event_id: str,
        storage_path: str,
        filename: str,
        status: str = "processing",
        width: int | None = None,
        height: int | None = None,
        size_bytes: int | None = None,
        thumbnail_path: str | None = None,
        preview_path: str | None = None
    ) -> dict[str, Any]:
        """Creates or updates a photo record in Supabase or PostgreSQL."""
        supabase = get_supabase_client()
        if supabase:
            try:
                payload = {
                    "id": photo_id,
                    "event_id": event_id,
                    "storage_path": storage_path,
                    "thumbnail_path": thumbnail_path,
                    "preview_path": preview_path,
                    "filename": filename,
                    "status": status,
                    "width": width,
                    "height": height,
                    "size_bytes": size_bytes
                }
                res = supabase.table("photos").upsert(payload).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                logger.warning(f"Supabase upsert photo failed: {e}")

        record = {
            "id": photo_id,
            "event_id": event_id,
            "storage_path": storage_path,
            "thumbnail_path": thumbnail_path,
            "preview_path": preview_path,
            "filename": filename,
            "status": status,
            "width": width,
            "height": height,
            "size_bytes": size_bytes,
            "face_count": 0
        }
        _IN_MEMORY_PHOTOS[photo_id] = record
        return record

    @staticmethod
    def update_photo_status(photo_id: str, status: str, face_count: int) -> dict[str, Any]:
        """Updates photo processing status and detected face count."""
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("photos").update({
                    "status": status,
                    "face_count": face_count
                }).eq("id", photo_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                logger.warning(f"Supabase update photo status failed: {e}")

        if photo_id in _IN_MEMORY_PHOTOS:
            _IN_MEMORY_PHOTOS[photo_id]["status"] = status
            _IN_MEMORY_PHOTOS[photo_id]["face_count"] = face_count
            return _IN_MEMORY_PHOTOS[photo_id]
        return {"id": photo_id, "status": status, "face_count": face_count}

    @staticmethod
    def get_photo(photo_id: str) -> dict[str, Any] | None:
        """Retrieves a single photo by ID."""
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("photos").select("*").eq("id", photo_id).single().execute()
                return res.data
            except Exception:
                pass
        return _IN_MEMORY_PHOTOS.get(photo_id)


class FaceRepository:
    @staticmethod
    def save_face_embeddings(
        event_id: str,
        photo_id: str,
        faces_data: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:
        """
        Stores extracted face embeddings and bounding boxes in Supabase with pgvector.
        """
        if not faces_data:
            return []

        supabase = get_supabase_client()
        if supabase:
            try:
                # Remove prior face records for this photo to avoid duplicates
                try:
                    supabase.table("faces").delete().eq("photo_id", photo_id).execute()
                except Exception:
                    pass

                rows = []
                for face in faces_data:
                    face_id = str(uuid.uuid4())
                    embedding = face["embedding"]
                    embedding_vec = embedding.tolist() if isinstance(embedding, np.ndarray) else list(embedding)

                    bbox_dict = {
                        "x1": float(face["bbox"][0]),
                        "y1": float(face["bbox"][1]),
                        "x2": float(face["bbox"][2]),
                        "y2": float(face["bbox"][3])
                    }

                    rows.append({
                        "id": face_id,
                        "photo_id": photo_id,
                        "event_id": event_id,
                        "embedding": embedding_vec,
                        "bounding_box": bbox_dict,
                        "det_score": float(face.get("det_score", 1.0)),
                        "gender": face.get("gender"),
                        "age": face.get("age")
                    })

                res = supabase.table("faces").insert(rows).execute()
                logger.info(f"Stored {len(rows)} face embedding(s) in Supabase pgvector for photo_id={photo_id}")
                return res.data or rows

            except Exception as e:
                logger.error(f"Failed to insert face embeddings to Supabase: {e}")

        # In-memory fallback
        in_memory_records = []
        for face in faces_data:
            face_id = str(uuid.uuid4())
            embedding = face["embedding"]
            embedding_vec = embedding.tolist() if isinstance(embedding, np.ndarray) else list(embedding)

            record = {
                "id": face_id,
                "photo_id": photo_id,
                "event_id": event_id,
                "embedding": embedding_vec,
                "bounding_box": {
                    "x1": float(face["bbox"][0]),
                    "y1": float(face["bbox"][1]),
                    "x2": float(face["bbox"][2]),
                    "y2": float(face["bbox"][3])
                },
                "det_score": float(face.get("det_score", 1.0)),
                "gender": face.get("gender"),
                "age": face.get("age")
            }
            in_memory_records.append(record)

        _IN_MEMORY_FACES[photo_id] = in_memory_records
        logger.info(f"Stored {len(in_memory_records)} face embedding(s) in in-memory repository for photo_id={photo_id}")
        return in_memory_records

    @staticmethod
    def get_faces_by_photo(photo_id: str) -> list[dict[str, Any]]:
        """Gets all face records associated with a photo."""
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("faces").select("*").eq("photo_id", photo_id).execute()
                return res.data or []
            except Exception as e:
                logger.warning(f"Failed to query faces by photo: {e}")

        return _IN_MEMORY_FACES.get(photo_id, [])

    @staticmethod
    def get_faces_by_event(event_id: str) -> list[dict[str, Any]]:
        """Gets all face records belonging to an event."""
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("faces").select("*").eq("event_id", event_id).execute()
                return res.data or []
            except Exception as e:
                logger.warning(f"Failed to query faces by event: {e}")

        all_faces = []
        for face_list in _IN_MEMORY_FACES.values():
            for f in face_list:
                if f.get("event_id") == event_id:
                    all_faces.append(f)
        return all_faces

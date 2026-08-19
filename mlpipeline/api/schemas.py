"""
Pydantic request/response schemas for the Photographer ML Pipeline API.
These define the contracts that the Express.js backend will use to call this service.
"""

from pydantic import BaseModel, Field
from typing import Optional


# ─── Request Schemas ───────────────────────────────────────────────

class ProcessPhotoRequest(BaseModel):
    """Request body for POST /process-photo (single photo processing)."""
    event_id: str = Field(..., description="Event ID the photo belongs to")
    storage_path: str = Field(..., description="Path in Supabase Storage (e.g., events/evt-1/photo.jpg)")
    photo_id: Optional[str] = Field(None, description="Optional explicit photo ID, auto-generated if omitted")
    filename: Optional[str] = Field(None, description="Original filename, derived from storage_path if omitted")

    model_config = {"json_schema_extra": {
        "examples": [{
            "event_id": "evt-wedding-001",
            "storage_path": "events/evt-wedding-001/IMG_1234.jpg",
            "photo_id": "photo-abc-123",
            "filename": "IMG_1234.jpg"
        }]
    }}


class PhotoItem(BaseModel):
    """A single photo item within a batch request."""
    storage_path: str = Field(..., description="Path in Supabase Storage")
    photo_id: Optional[str] = Field(None, description="Optional explicit photo ID")
    filename: Optional[str] = Field(None, description="Original filename")


class ProcessBatchRequest(BaseModel):
    """Request body for POST /process-batch (batch photo processing)."""
    event_id: str = Field(..., description="Event ID to process photos for")
    event_name: Optional[str] = Field(None, description="Event display name (used to create event record)")
    event_slug: Optional[str] = Field(None, description="Event URL slug (used to create event record)")
    photos: list[PhotoItem] = Field(..., description="List of photos to process")

    model_config = {"json_schema_extra": {
        "examples": [{
            "event_id": "evt-wedding-001",
            "event_name": "Sharma Wedding",
            "event_slug": "sharma-wedding",
            "photos": [
                {"storage_path": "events/evt-wedding-001/IMG_1234.jpg", "filename": "IMG_1234.jpg"},
                {"storage_path": "events/evt-wedding-001/IMG_1235.jpg", "filename": "IMG_1235.jpg"}
            ]
        }]
    }}


# ─── Response Schemas ──────────────────────────────────────────────

class BoundingBox(BaseModel):
    """Face bounding box coordinates."""
    x1: float
    y1: float
    x2: float
    y2: float


class FaceResult(BaseModel):
    """A single detected face result."""
    id: str = Field(..., description="Face record UUID")
    photo_id: str
    event_id: str
    bounding_box: BoundingBox
    det_score: float = Field(..., description="Detection confidence 0.0-1.0")
    gender: Optional[int] = Field(None, description="0=Female, 1=Male")
    age: Optional[int] = Field(None, description="Estimated age")


class ProcessPhotoResponse(BaseModel):
    """Response for POST /process-photo."""
    photo_id: str
    event_id: str
    filename: Optional[str] = None
    storage_path: str
    status: str = Field(..., description="'ready' or 'failed'")
    faces_detected: int
    processing_time_ms: float
    faces: list[dict] = Field(default_factory=list, description="List of saved face records")
    error: Optional[str] = None


class ProcessBatchResponse(BaseModel):
    """Response for POST /process-batch."""
    event_id: str
    total_photos_processed: int
    successful_photos: int
    failed_photos: int
    total_faces_indexed: int
    total_time_ms: float
    photo_results: list[ProcessPhotoResponse]


class EventStatusResponse(BaseModel):
    """Response for GET /event/{event_id}/status."""
    event_id: str
    total_photos: int
    photos_ready: int
    photos_processing: int
    photos_failed: int
    total_faces_indexed: int
    is_complete: bool = Field(..., description="True if all photos have been processed")


class PhotoStatusResponse(BaseModel):
    """Response for GET /photo/{photo_id}/status."""
    photo_id: str
    event_id: str
    status: str
    face_count: int
    filename: Optional[str] = None
    storage_path: Optional[str] = None


class HealthResponse(BaseModel):
    """Response for GET /health."""
    status: str = "ok"
    service: str = "glimpse-ml-pipeline"
    version: str = "1.0.0"
    model_loaded: bool
    model_name: str
    embedding_dim: int

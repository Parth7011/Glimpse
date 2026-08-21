# Glimpse ML Pipeline — Complete Technical Documentation

> **Version**: 1.0.0  
> **Last Updated**: August 2026  
> **Service**: Internal FastAPI ML Microservice  
> **Hosting**: Render Free Web Service (Python)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Photographer Pipeline — Step-by-Step](#3-photographer-pipeline--step-by-step)
4. [Guest Pipeline — Step-by-Step](#4-guest-pipeline--step-by-step)
5. [Directory Structure](#5-directory-structure)
6. [API Reference](#6-api-reference)
7. [Database Schema (pgvector)](#7-database-schema-pgvector)
8. [Face Engine (InsightFace)](#8-face-engine-insightface)
9. [Storage Layer](#9-storage-layer)
10. [Configuration](#10-configuration)
11. [How Express.js Backend Calls the ML Service](#11-how-expressjs-backend-calls-the-ml-service)
12. [Running the Service](#12-running-the-service)
13. [Testing](#13-testing)
14. [Deployment on Render](#14-deployment-on-render)

---

## 1. Overview

The **Glimpse ML Pipeline** is the brain of the Glimpse event photo delivery platform. It powers two core workflows:

| Pipeline | Trigger | What It Does |
|---|---|---|
| **Photographer Pipeline** | Photographer uploads event photos | Detect faces → Extract 512-dim ArcFace embeddings → Store in pgvector |
| **Guest Pipeline** | Guest uploads a selfie | Detect face → Extract embedding → Search pgvector for matching photos |

The ML service is a **FastAPI** application that runs as an **internal microservice** — it is **never** called directly by the browser. The Express.js public API acts as the orchestrator and reverse proxy.

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│   Browser   │────▶│  Express.js API   │────▶│  FastAPI ML Service  │
│  (React)    │     │  (Public, Render) │     │  (Internal, Render)  │
└─────────────┘     └──────────────────┘     └──────────────────────┘
                            │                          │
                            ▼                          ▼
                    ┌──────────────┐          ┌────────────────┐
                    │   Supabase   │          │   Supabase     │
                    │   Auth       │          │   PostgreSQL   │
                    └──────────────┘          │   + pgvector   │
                                              │   + Storage    │
                                              └────────────────┘
```

---

## 2. Architecture

### System Flow Diagram

```
                          PHOTOGRAPHER FLOW
    ┌──────────────────────────────────────────────────────────────┐
    │                                                              │
    │  Photographer                                                │
    │      │                                                       │
    │      ▼                                                       │
    │  [React Frontend]                                            │
    │      │  POST /api/events/:id/photos (multipart upload)       │
    │      ▼                                                       │
    │  [Express.js API]                                            │
    │      │  1. Upload raw image to Supabase Storage              │
    │      │  2. Insert photo record (status: "processing")        │
    │      │  3. Call ML Service: POST /process-photo              │
    │      ▼                                                       │
    │  [FastAPI ML Service]                                        │
    │      │  1. Download image from Supabase Storage              │
    │      │  2. Run InsightFace face detection (det_10g.onnx)     │
    │      │  3. Extract 512-dim ArcFace embeddings (w600k_r50)    │
    │      │  4. L2-normalize embedding vectors                    │
    │      │  5. Store face records + vector(512) in pgvector      │
    │      │  6. Update photo status → "ready"                     │
    │      ▼                                                       │
    │  [Supabase PostgreSQL + pgvector]                            │
    │      faces table: id, photo_id, event_id, embedding,         │
    │                   bounding_box, det_score, gender, age       │
    │                                                              │
    └──────────────────────────────────────────────────────────────┘

                            GUEST FLOW
    ┌──────────────────────────────────────────────────────────────┐
    │                                                              │
    │  Guest (scans QR code)                                       │
    │      │                                                       │
    │      ▼                                                       │
    │  [React Frontend — Event Page]                               │
    │      │  1. Accept consent checkbox                           │
    │      │  2. Capture/upload selfie via getUserMedia()          │
    │      │  3. Compress with browser-image-compression           │
    │      │  4. POST /api/events/:id/search-face                  │
    │      ▼                                                       │
    │  [Express.js API]                                            │
    │      │  Forward selfie bytes to ML Service                   │
    │      │  POST /search-face                                    │
    │      ▼                                                       │
    │  [FastAPI ML Service]                                        │
    │      │  1. Detect face in selfie                             │
    │      │  2. Extract 512-dim ArcFace embedding                 │
    │      │  3. Query pgvector: cosine similarity search          │
    │      │     filtered by event_id                              │
    │      │  4. Return matched photo_ids + similarity scores      │
    │      ▼                                                       │
    │  [Express.js API]                                            │
    │      │  Fetch matched photo URLs from Supabase Storage       │
    │      │  Return photo gallery to frontend                     │
    │      ▼                                                       │
    │  [React Frontend — Gallery]                                  │
    │      Display matched photos in grid                          │
    │      Download individual or ZIP archive                      │
    │                                                              │
    └──────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Face detection model | InsightFace `buffalo_l` | Best accuracy, 512-dim ArcFace, free, runs on CPU |
| Vector database | Supabase PostgreSQL + pgvector | Free tier, HNSW index, event-scoped search |
| Distance metric | Cosine similarity (`vector_cosine_ops`) | InsightFace outputs L2-normalized vectors |
| ML framework | FastAPI (Python) | Async, auto-docs, Pydantic validation |
| Object storage | Supabase Storage | Free tier, S3-compatible, public URLs |
| Async pattern | Fire-and-forget + polling | No Redis/Celery needed (hackathon constraint) |

---

## 3. Photographer Pipeline — Step-by-Step

The photographer pipeline is the **indexing phase** — it pre-processes all event photos so guest face searches are instant.

### Step 1: Image Retrieval from Object Storage

```python
# Downloads raw image bytes from Supabase Storage bucket
image_bytes = storage.download_image("events/evt-wedding-001/IMG_1234.jpg")
```

- **Source**: Supabase Storage bucket `event-photos`
- **Path format**: `events/{event_id}/{filename}`
- **Fallback**: `LocalStorageProvider` reads from `./storage_data/` for offline dev

### Step 2: Face Detection

```python
# InsightFace det_10g.onnx model detects face bounding boxes
detected_faces = face_engine.extract_faces_from_bytes(image_bytes)
```

- **Model**: `det_10g.onnx` (RetinaFace-based detector)
- **Input resolution**: 640×640 (configurable)
- **Confidence threshold**: 0.5 (configurable via `INSIGHTFACE_DET_THRESH`)
- **Output per face**: Bounding box `[x1, y1, x2, y2]`, confidence score, 5-point facial landmarks

### Step 3: Face Embedding Extraction

```python
# w600k_r50.onnx ArcFace model generates 512-dimensional feature vector
embedding = normalize_embedding(face.embedding)  # L2 normalized
```

- **Model**: `w600k_r50.onnx` (ArcFace ResNet-50, trained on 600K identities)
- **Output**: 512-dimensional `float32` vector, L2-normalized to unit length
- **Normalization**: Ensures cosine similarity = dot product for fast search
- **Additional attributes**: Gender (0/1), estimated age (integer)

### Step 4: Embedding Storage in pgvector

```python
# Insert into Supabase PostgreSQL faces table with vector(512) column
FaceRepository.save_face_embeddings(
    event_id="evt-wedding-001",
    photo_id="photo-abc-123",
    faces_data=detected_faces
)
```

- **Table**: `faces` with `embedding vector(512)` column
- **Index**: HNSW index with `vector_cosine_ops` (m=16, ef_construction=64)
- **Metadata stored alongside**: `photo_id`, `event_id`, `bounding_box` (JSONB), `det_score`, `gender`, `age`
- **Deduplication**: Existing faces for a photo are deleted before re-insert

### Step 5: Status Update

```python
# Photo status transitions: uploaded → processing → ready/failed
PhotoRepository.update_photo_status("photo-abc-123", status="ready", face_count=3)
EventRepository.update_event_counts("evt-wedding-001")
```

### Pipeline Output

```json
{
    "photo_id": "photo-abc-123",
    "event_id": "evt-wedding-001",
    "filename": "IMG_1234.jpg",
    "storage_path": "events/evt-wedding-001/IMG_1234.jpg",
    "status": "ready",
    "faces_detected": 3,
    "processing_time_ms": 2890.54,
    "faces": [
        {
            "id": "face-uuid-1",
            "photo_id": "photo-abc-123",
            "event_id": "evt-wedding-001",
            "bounding_box": {"x1": 120.5, "y1": 80.3, "x2": 280.1, "y2": 350.7},
            "det_score": 0.94,
            "gender": 1,
            "age": 28
        }
    ]
}
```

---

## 4. Guest Pipeline — Step-by-Step

> **Note**: The guest pipeline will be implemented next. This section documents the planned design.

### Step 1: Selfie Capture & Upload
- Guest captures selfie via browser `getUserMedia()` API
- Image compressed client-side with `browser-image-compression`
- Selfie bytes sent to Express.js → forwarded to ML service

### Step 2: Face Detection & Embedding
- Same InsightFace `buffalo_l` model extracts a single 512-dim vector from the selfie
- Only the first/largest face is used for matching

### Step 3: pgvector Similarity Search
```sql
-- Event-scoped cosine similarity search using HNSW index
SELECT f.id, f.photo_id, f.bounding_box, f.det_score,
       1 - (f.embedding <=> $1::vector) AS similarity
FROM faces f
WHERE f.event_id = $2
ORDER BY f.embedding <=> $1::vector
LIMIT 50;
```

### Step 4: Return Matched Photos
- Face matches above threshold (e.g., similarity > 0.5) are returned
- Express.js fetches corresponding photo URLs from Supabase Storage
- Frontend displays matched photos in a gallery grid

---

## 5. Directory Structure

```
mlpipeline/
│
├── api/                                  # FastAPI REST API Layer
│   ├── __init__.py                       # Exports: app
│   ├── app.py                            # FastAPI app, CORS, lifespan
│   ├── routes.py                         # All API endpoint handlers
│   └── schemas.py                        # Pydantic request/response models
│
├── db/                                   # Database & pgvector Layer
│   ├── __init__.py                       # Exports: connection, repositories
│   ├── connection.py                     # PostgreSQL connection manager
│   ├── repository.py                     # EventRepo, PhotoRepo, FaceRepo
│   └── schema.sql                        # Full SQL schema (pgvector + tables)
│
├── face_engine/                          # Computer Vision Engine
│   ├── __init__.py                       # Exports: FaceEngine
│   ├── detector.py                       # InsightFace singleton wrapper
│   └── utils.py                          # Image decode, L2 normalize, cosine sim
│
├── pipeline/                             # Pipeline Orchestrators
│   ├── __init__.py                       # Exports: PhotographerPipeline
│   └── photographer_pipeline.py          # Single + batch photo processing
│
├── storage/                              # Object Storage Abstraction
│   ├── __init__.py                       # Exports: providers, factory
│   ├── base.py                           # BaseStorageProvider (abstract)
│   ├── factory.py                        # Auto-selects Supabase or Local
│   ├── supabase_storage.py               # Supabase Storage SDK wrapper
│   └── local_storage.py                  # Local filesystem (offline dev)
│
├── config.py                             # Settings from .env
├── requirements.txt                      # Python dependencies
├── test_photographer_pipeline.py         # Integration test suite
├── .env.example                          # Environment variable template
└── README.md                             # Quick-start guide
```

---

## 6. API Reference (Hugging Face ZeroGPU)

The ML pipeline is deployed on Hugging Face Spaces using the Gradio SDK to utilize free ZeroGPU acceleration. 
There are no traditional REST endpoints (like `/process-photo`). Instead, you communicate with the Space using the `@gradio/client` library via WebSockets/HTTP.

### Space URL
- **Production (Hugging Face)**: `https://huggingface.co/spaces/Ritish15/glimpse`
- **Gradio API Endpoint**: `Ritish15/glimpse` (used in the client SDK)

---

### `predict("/process_photo_gpu")`

Process a single photographer photo — detect faces and store embeddings in Supabase.

**Client Request (Node.js):**
```javascript
import { Client } from "@gradio/client";

const client = await Client.connect("Ritish15/glimpse");
const result = await client.predict("/process_photo_gpu", { 
    event_id: "evt-wedding-001", 
    photo_id: "photo-abc-123", 
});
```

**Response Payload (`result.data[0]` is a JSON string):**
```json
{
    "photo_id": "photo-abc-123",
    "event_id": "evt-wedding-001",
    "filename": "IMG_1234.jpg",
    "storage_path": "events/evt-wedding-001/IMG_1234.jpg",
    "status": "ready",
    "faces_detected": 2,
    "processing_time_ms": 3120.45,
    "faces": [
        {
            "id": "face-uuid-1",
            "photo_id": "photo-abc-123",
            "event_id": "evt-wedding-001",
            "bounding_box": {"x1": 120.5, "y1": 80.3, "x2": 280.1, "y2": 350.7},
            "det_score": 0.94,
            "gender": 1,
            "age": 28
        }
    ]
}
```

> **Note**: For batch processing, simply call `client.predict` in a loop or `Promise.all` from your Express backend. Gradio's internal queue will manage the concurrency safely.

---

## 7. Database Schema (pgvector)

All tables live in **Supabase PostgreSQL** with the `vector` extension enabled.

### Entity Relationship

```
photographers (1) ──▶ (N) events (1) ──▶ (N) photos (1) ──▶ (N) faces
                                │                                   │
                                │                                   │
                                ▼                                   ▼
                         guest_sessions ──▶ consents          matches
                                │                                ▲
                                └────────────────────────────────┘
```

### Core Tables

#### `photographers`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Supabase Auth user ID |
| `email` | TEXT (UNIQUE) | Photographer email |
| `name` | TEXT | Display name |
| `created_at` | TIMESTAMPTZ | Registration timestamp |

#### `events`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Event UUID |
| `photographer_id` | TEXT (FK → photographers) | Owner |
| `name` | TEXT | Event display name |
| `slug` | TEXT (UNIQUE) | URL slug for shareable link |
| `status` | TEXT | `draft` → `uploading` → `processing` → `ready` |
| `photo_count` | INTEGER | Total photos in event |
| `face_count` | INTEGER | Total indexed faces |

#### `photos`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Photo UUID |
| `event_id` | TEXT (FK → events) | Parent event |
| `storage_path` | TEXT | Path in Supabase Storage |
| `status` | TEXT | `uploaded` → `processing` → `ready` / `failed` |
| `face_count` | INTEGER | Faces detected in this photo |
| `width` / `height` | INTEGER | Image dimensions |
| `size_bytes` | BIGINT | File size |

#### `faces` (pgvector)
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Face UUID |
| `photo_id` | TEXT (FK → photos) | Source photo |
| `event_id` | TEXT (FK → events) | Parent event (denormalized for fast search) |
| `embedding` | `vector(512)` | **512-dim ArcFace feature vector** |
| `bounding_box` | JSONB | `{"x1", "y1", "x2", "y2"}` pixel coordinates |
| `det_score` | FLOAT | Detection confidence (0.0–1.0) |
| `gender` | INTEGER | 0 = female, 1 = male |
| `age` | INTEGER | Estimated age |

### Indexes

```sql
-- B-tree indexes for foreign key lookups
CREATE INDEX idx_photos_event_id ON photos(event_id);
CREATE INDEX idx_faces_event_id ON faces(event_id);
CREATE INDEX idx_faces_photo_id ON faces(photo_id);

-- HNSW vector index for fast cosine similarity search
CREATE INDEX idx_faces_embedding_hnsw
ON faces USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

**Why HNSW?** Hierarchical Navigable Small World graphs provide sub-linear approximate nearest neighbor search. With `m=16` and `ef_construction=64`, recall is >95% for our scale (hundreds to low thousands of faces per event).

---

## 8. Face Engine (InsightFace)

### Model Bundle: `buffalo_l`

The `buffalo_l` model pack contains 5 ONNX models:

| Model File | Task | Input Size | Output |
|---|---|---|---|
| `det_10g.onnx` | Face Detection (RetinaFace) | Dynamic | Bounding boxes + 5-point landmarks |
| `w600k_r50.onnx` | Face Recognition (ArcFace) | 112×112 | **512-dim float32 embedding** |
| `genderage.onnx` | Gender & Age | 96×96 | Gender (0/1), Age (int) |
| `1k3d68.onnx` | 3D Landmark (68-point) | 192×192 | 68 facial landmarks |
| `2d106det.onnx` | 2D Landmark (106-point) | 192×192 | 106 facial landmarks |

### Processing Pipeline (per image)

```
Raw Image Bytes
      │
      ▼
  cv2.imdecode() ──▶ BGR numpy array
      │
      ▼
  det_10g.onnx ──▶ Face bounding boxes + confidence scores
      │                  (filtered by det_thresh ≥ 0.5)
      │
      ▼ (for each detected face)
  Align face ──▶ 112×112 aligned crop
      │
      ▼
  w600k_r50.onnx ──▶ 512-dim raw embedding
      │
      ▼
  L2 Normalize ──▶ Unit-length 512-dim vector
      │
      ▼
  genderage.onnx ──▶ Gender + Age attributes
```

### Singleton Pattern

The `FaceEngine` uses a **thread-safe singleton** with double-checked locking to avoid loading the ~100MB model multiple times:

```python
engine = FaceEngine.get_instance()  # Returns cached singleton
faces = engine.extract_faces_from_bytes(image_bytes)
```

### Performance Characteristics

| Metric | Value |
|---|---|
| Model load time (cold start) | ~3-5s on CPU |
| Single face detection + embedding | ~200-500ms on CPU |
| Group photo (5-10 faces) | ~1-3s on CPU |
| Embedding dimension | 512 × float32 = 2,048 bytes |
| Model memory footprint | ~150MB |

---

## 9. Storage Layer

The storage layer uses a **factory pattern** with automatic fallback:

```
get_storage_provider()
      │
      ├── SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set?
      │       │
      │       ├── YES → SupabaseStorageProvider
      │       └── NO  → LocalStorageProvider (./storage_data/)
      │
      └── Explicit: get_storage_provider("supabase") or ("local")
```

### Storage Path Convention

```
event-photos/                           ← Supabase bucket name
  └── events/
        └── {event_id}/
              ├── IMG_1234.jpg          ← Original uploaded photo
              ├── IMG_1235.jpg
              └── ...
```

### Provider Interface

```python
class BaseStorageProvider(ABC):
    def download_image(self, storage_path: str) -> bytes
    def upload_image(self, storage_path: str, data: bytes, content_type: str) -> str
    def list_files(self, prefix: str) -> list[str]
    def get_public_url(self, storage_path: str) -> str
```

---

## 10. Configuration

All configuration is loaded from the root `.env` file via `python-dotenv`.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://...localhost:5432/glimpse` | PostgreSQL connection string (pgvector) |
| `SUPABASE_URL` | _(empty)_ | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | _(empty)_ | Secret backend service role key |
| `SUPABASE_STORAGE_BUCKET` | `event-photos` | Storage bucket name |
| `INSIGHTFACE_MODEL` | `buffalo_l` | Model pack name |
| `INSIGHTFACE_CTX_ID` | `-1` | `-1` = CPU, `0+` = CUDA GPU ID |
| `INSIGHTFACE_DET_THRESH` | `0.5` | Min face detection confidence |

### Example `.env`

```env
# Database
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres

# Supabase
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_STORAGE_BUCKET=event-photos

# InsightFace
INSIGHTFACE_MODEL=buffalo_l
INSIGHTFACE_CTX_ID=-1
INSIGHTFACE_DET_THRESH=0.5
```

---

## 11. How Express.js Backend Calls the ML Service

The Express.js backend acts as the orchestrator. It uploads photos to Supabase, and then fires a standard HTTP POST request to the Modal FastAPI service.

### Single Photo Processing (after upload)

```javascript
// express-api/controllers/photoController.js
const processPhoto = async (req, res) => {
    const { eventId } = req.params;
    const file = req.file;

    // 1. Upload to Supabase Storage
    const storagePath = `events/${eventId}/${file.originalname}`;
    await adminSupabase.storage.from('event-photos').upload(storagePath, file.buffer);

    // 2. Insert into PostgreSQL (status: processing)
    const { data: photo } = await adminSupabase.from('photos').insert({
        event_id: eventId,
        storage_path: storagePath,
        filename: file.originalname,
        status: 'processing'
    }).select().single();

    // 3. Call Modal Serverless GPU API to extract faces & embeddings
    try {
        const mlUrl = "https://ritishmahajan15--glimpse-ml-pipeline-fastapi-app.modal.run";
        const response = await fetch(`${mlUrl}/process-photo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_id: eventId,
                photo_id: photo.id,
                storage_path: photo.storage_path,
                filename: photo.filename
            })
        });

        if (!response.ok) throw new Error("Modal API Error");
        const mlPayload = await response.json();
        
        res.json({ success: true, ...mlPayload });
    } catch (err) {
        console.error("ML Processing failed:", err);
        await adminSupabase.from('photos').update({ status: 'failed' }).eq('id', photo.id);
        res.status(500).json({ success: false, error: "ML Pipeline failed" });
    }
};
```

### Batch Upload (async pattern)

Because Modal automatically spins up multiple serverless GPU containers dynamically, you can safely trigger multiple predictions concurrently using `Promise.allSettled`. 

```javascript
const processBatch = async (eventId, photos) => {
    const mlEndpoint = "https://ritishmahajan15--glimpse-ml-pipeline-fastapi-app.modal.run";
    
    // Fire all requests concurrently; Modal auto-scales GPUs instantly
    Promise.allSettled(photos.map(async (photo) => {
        try {
            await fetch(`${mlEndpoint}/process-photo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_id: eventId,
                    photo_id: photo.id,
                    storage_path: photo.storage_path,
                    filename: photo.filename
                })
            });
        } catch (err) {
            console.error(`Failed to process photo ${photo.id}:`, err);
        }
    }));
};
```
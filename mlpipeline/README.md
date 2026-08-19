# Glimpse ML Pipeline (Photographer Face Detection & Embedding)

Photographer-side computer vision pipeline for **Glimpse**.

```
Event Photos (Object Storage)
       │
       ▼
InsightFace Face Detection & Alignment
       │
       ▼
ArcFace 512-dim Normalized Embedding Generation
       │
       ▼
PostgreSQL / Supabase Storage with pgvector
```

---

## Features

- **Object Storage Integration**: Downloads high-res event photos directly from Supabase Storage (with fallback to local storage for offline development).
- **InsightFace Face Analysis**: Detects single and group faces, computes bounding boxes, landmarks, detection confidence, and 512-dimensional ArcFace vector embeddings.
- **pgvector Persistence**: Stores face records in PostgreSQL using `vector(512)` indexed with HNSW for ultra-fast cosine similarity lookups.
- **Photo-to-Embedding Mapping**: Associates every detected face ID and coordinate with the original photo ID and event ID.

---

## Directory Structure

```
mlpipeline/
├── config.py                          # Environment and model configurations
├── requirements.txt                   # Pipeline dependencies
├── .env.example                       # Environment variables template
├── db/
│   ├── connection.py                  # PostgreSQL connection manager with pgvector
│   ├── repository.py                  # Photo, Face, and Event repositories
│   └── schema.sql                     # Database schema definition with vector(512)
├── storage/
│   ├── base.py                        # Abstract storage interface
│   ├── supabase_storage.py            # Supabase Storage client
│   ├── local_storage.py               # Local filesystem storage
│   └── factory.py                     # Storage provider factory
├── face_engine/
│   ├── detector.py                    # InsightFace FaceEngine singleton
│   └── utils.py                       # Image decoding & normalization utilities
├── pipeline/
│   └── photographer_pipeline.py       # Photographer pipeline orchestrator
└── test_photographer_pipeline.py      # Pipeline runner & test script
```

---

## Quickstart

### 1. Install Dependencies

```bash
pip install -r mlpipeline/requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` in the project root:

```bash
cp mlpipeline/.env.example .env
```

Set your `DATABASE_URL`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

### 3. Initialize Database Schema

```python
from mlpipeline.db import init_database
init_database()
```

### 4. Run Photographer Pipeline

```python
from mlpipeline.pipeline import PhotographerPipeline

pipeline = PhotographerPipeline()

# Process a single photo
result = pipeline.process_single_photo(
    event_id="evt_wedding_01",
    storage_path="events/evt_wedding_01/originals/photo_001.jpg",
    photo_id="photo_001",
    filename="photo_001.jpg"
)

print(f"Detected {result['faces_detected']} faces!")
```

---

## Running Verification Tests

```bash
python -m mlpipeline.test_photographer_pipeline
```

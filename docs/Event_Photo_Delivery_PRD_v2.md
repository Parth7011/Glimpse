# PRD — Hackathon Prototype
## Event Photo Delivery Platform (Face-Recognition Based)

**Status:** Draft v2 — Hackathon Scope  
**Constraint:** 100% free-tier tools only, every listed feature must work live in the demo  
**Last updated:** August 20, 2026

---

## 1. Why this version is different from the full PRD

This is a **scoped-down, demo-reliable version** of the original product PRD. The rule for this document: if a feature can't be built and verified working with free-tier tools before the demo, it is either cut or marked as "described, not built" (mocked in the pitch deck, not claimed as live).

Guiding principle: **fewer working features beats more broken ones.** Judges remember what breaks on stage.

The implementation uses a clear separation between the **React + JavaScript frontend**, the **Express public API**, and the dedicated **ML face-recognition pipeline**.

---

## 2. Demo Scope (What Must Actually Work)

| # | Feature | Must work live? |
|---|---|---|
| 1 | Photographer uploads a batch of event photos | ✅ Yes |
| 2 | ML pipeline detects faces and creates face embeddings | ✅ Yes |
| 3 | Face embeddings are stored in PostgreSQL using pgvector | ✅ Yes |
| 4 | Photographer gets a shareable link/QR code for the event | ✅ Yes |
| 5 | Guest opens link, takes/uploads a selfie | ✅ Yes |
| 6 | Guest ML pipeline creates a face embedding | ✅ Yes |
| 7 | Guest embedding is searched against the event's stored embeddings | ✅ Yes |
| 8 | Guest sees all matching photos (solo + group) | ✅ Yes |
| 9 | Guest downloads photos (single + bulk zip) | ✅ Yes |
| 10 | Basic consent checkbox before selfie is used | ✅ Yes |
| 11 | WhatsApp/email auto-push delivery | ❌ Cut — mention as roadmap only |
| 12 | Paid downloads / monetization | ❌ Cut — mention as roadmap only |
| 13 | Custom branding per photographer | ❌ Cut — mention as roadmap only |
| 14 | Analytics dashboard | ⚠️ Nice-to-have if time remains — simple counts only (photos uploaded, guests matched) |

---

## 3. User Flow (Demo Script)

### Photographer flow

1. **Photographer** logs in → creates an event → uploads ~30–50 sample photos.
2. The Express API receives the upload and stores the photos in Supabase Storage.
3. The ML pipeline detects faces in each photo.
4. The ML pipeline creates a face embedding for every detected face.
5. The embeddings are stored in PostgreSQL using pgvector, linked to the event and photo.
6. Dashboard shows a status indicator (processing → ready).
7. Photographer clicks "Get Link" → QR code + URL generated.

### Guest flow

8. **Judge/demo guest** scans the QR code → lands on the guest portal.
9. Guest gives consent → taps "Find My Photos" → camera opens.
10. Guest takes/uploads a selfie.
11. The ML pipeline detects the face in the selfie.
12. The ML pipeline creates the guest face embedding.
13. The embedding is used to search for similar embeddings belonging to that event.
14. Matching solo and group photos appear in a grid.
15. Guest taps "Download All" → ZIP downloads.

The guest should be able to complete the core flow in under one minute.

---

## 4. Free-Tier Tech Stack

Every tool below has a free tier sufficient for a hackathon-scale demo. No paid API or unnecessary infrastructure should be required.

| Layer | Tool | Role |
|---|---|---|
| Frontend | **React + JavaScript** | Photographer dashboard and guest portal |
| Frontend build tool | **Vite** | Local development and production build |
| Styling | **Tailwind CSS** | UI styling |
| UI components | **shadcn/ui** | Reusable UI components where useful |
| Data fetching | **TanStack Query** | API calls, caching and processing-status polling |
| QR code | **qrcode.react / qrcode** | Event QR generation |
| Camera | Browser `getUserMedia()` | Guest selfie capture |
| Selfie compression | **browser-image-compression** | Compress guest selfie before upload |
| Frontend hosting | **Vercel Hobby** | Host the React/Vite frontend |
| Public backend API | **Express.js + Node.js** | Authentication-related API integration, events, uploads, guest sessions, results and downloads |
| ML service | **Python + FastAPI** | Dedicated face-recognition processing service |
| Face recognition | **face_recognition + dlib + NumPy** | Face detection and face embedding creation |
| Database | **Supabase PostgreSQL** | Application data and face records |
| Vector search | **pgvector** | Face embedding storage and similarity search |
| File storage | **Supabase Storage** | Original photos, previews and thumbnails |
| Authentication | **Supabase Auth** | Photographer login |
| Image processing | **Pillow** | Thumbnails, previews, resizing and compression |
| ZIP generation | Python `zipfile` | Bulk photo download |
| Version control / CI | **GitHub + GitHub Actions** | Source control and deployment automation |

### Architecture rule

The frontend communicates with the **Express public API**. The Express API communicates with Supabase and the ML service. The ML service handles only the face-recognition pipeline.

Do not expose the ML service directly to the browser.

---

## 5. Architecture (Hackathon Version)

```text
                         INTERNET
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌───────────────┐       ┌───────────────┐
        │ PHOTOGRAPHER  │       │     GUEST     │
        │   DASHBOARD   │       │    PORTAL     │
        └───────┬───────┘       └───────┬───────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                 ┌─────────────────────┐
                 │ React + JavaScript   │
                 │ Vite / Vercel       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Express.js API      │
                 │ Node.js / Render    │
                 └──────┬─────────┬────┘
                        │         │
              ┌─────────┘         └─────────────┐
              ▼                                 ▼
     ┌─────────────────┐               ┌─────────────────┐
     │    Supabase     │               │  Python FastAPI │
     │ PostgreSQL      │               │    ML Service   │
     │ pgvector        │               └────────┬────────┘
     │ Storage         │                        │
     │ Auth            │                        ▼
     └─────────────────┘               ┌─────────────────┐
                                       │ face_recognition│
                                       │ dlib + NumPy    │
                                       └─────────────────┘
```

### Responsibilities

**React + JavaScript**
- Photographer dashboard
- Guest portal
- Event pages
- Selfie capture
- Results grid
- QR display
- Processing status UI

**Express.js public API**
- Public HTTP API consumed by the frontend
- Photographer/event operations
- Upload orchestration
- Guest session handling
- Calls to the ML service
- Match/result retrieval
- Download authorization and delivery
- API-level validation and error handling

**FastAPI ML service**
- Face detection
- Face embedding creation
- Similarity-search request handling
- No frontend-facing routes
- No UI responsibilities

**Supabase**
- PostgreSQL
- pgvector
- Authentication
- Storage
- Row Level Security

---

## 6. ML Pipeline

The face-recognition flow is intentionally split into two pipelines.

### 6.1 Photographer Pipeline

```text
Photographer uploads event photo
                ↓
          Face Detection
                ↓
      Face Embedding Creation
                ↓
      Embedding Storage in pgvector
                ↓
       Linked to event + photo
```

For every detected face, store the embedding with the corresponding `event_id` and `photo_id`.

### 6.2 Guest Pipeline

```text
Guest opens event
        ↓
   Consent given
        ↓
 Selfie capture/upload
        ↓
   Face Detection
        ↓
 Face Embedding Creation
        ↓
Search for Similar Embeddings
        ↓
  Similarity / threshold check
        ↓
     Matched photo IDs
        ↓
     Results grid
```

### ML responsibilities

Use:

- Python
- FastAPI
- `face_recognition`
- `dlib`
- NumPy

The ML service should expose only the endpoints required by the Express API, for example:

```text
POST /process-photo
POST /search-face
GET  /health
```

The exact endpoint naming can be adjusted during implementation without changing the product architecture.

### Matching strategy

For the hackathon dataset of approximately 30–50 photos, simple embedding comparison is sufficient.

Preferred path:

```text
Guest embedding
      ↓
pgvector similarity search
      ↓
event-scoped candidate embeddings
      ↓
similarity threshold
      ↓
matching photo IDs
```

If pgvector integration becomes a time sink, similarity calculations can temporarily be performed in Python with NumPy. The product flow remains the same.

Do not build a GPU cluster or complex ML infrastructure for the hackathon.

---

## 7. Database

### Supabase

Use Supabase for:

- PostgreSQL
- Authentication
- pgvector
- Storage
- Row Level Security

No separate Firebase, MongoDB, Pinecone, Qdrant Cloud, Auth0 or Clerk service is required.

### Database schema

```text
photographers
----------------
id
email
name
created_at


events
----------------
id
photographer_id
name
slug
created_at
status


photos
----------------
id
event_id
storage_path
thumbnail_path
filename
status
created_at


faces
----------------
id
photo_id
event_id
embedding
bounding_box
created_at


guest_sessions
----------------
id
event_id
session_token
created_at
expires_at


matches
----------------
id
guest_session_id
photo_id
similarity
created_at


consents
----------------
id
event_id
guest_session_id
consent_given
created_at
```

---

## 8. Vector Search

Use:

**PostgreSQL + pgvector**

No dedicated vector database is required.

### Preferred implementation

Store each face embedding in the `faces` table.

For guest search:

1. Create the guest embedding.
2. Restrict the search to the current event.
3. Use pgvector similarity search.
4. Apply a similarity/distance threshold.
5. Return the matching `photo_id` values.
6. Fetch the corresponding photo previews from Supabase Storage.

For 30–50 photos, this is completely acceptable for the demo.

Do not waste development time optimizing vector search for millions of embeddings.

---

## 9. Storage

### Use Supabase Storage

Store:

```text
/events/{event_id}/originals/
    photo1.jpg
    photo2.jpg

/events/{event_id}/previews/
    photo1.webp
    photo2.webp

/events/{event_id}/thumbnails/
    photo1.webp
    photo2.webp
```

### Image processing

Use **Pillow** for:

- thumbnails
- previews
- resizing
- compression

Use **browser-image-compression** for:

- guest selfie compression before upload

---

## 10. Authentication

### Photographer

Use:

**Supabase Auth**

Recommended MVP:

```text
Email
Password
```

or magic link.

### Guest

**NO LOGIN.**

Guest receives an event URL such as:

```text
https://yourapp.vercel.app/e/event-abc123
```

A temporary guest session can be created for the event.

The guest should never be forced to:

- register
- create a password
- provide an email
- install an app

---

## 11. Background Processing

Do **not** use Redis/BullMQ/Celery initially.

The PRD only requires a small hackathon-scale dataset.

Use simple asynchronous processing coordinated by the Express API and ML service.

### Photographer processing flow

```text
Upload
  ↓
Express API creates photo record
  ↓
status = processing
  ↓
Express sends photo to ML service
  ↓
ML: Face Detection
  ↓
ML: Face Embedding Creation
  ↓
Express/DB stores embeddings in pgvector
  ↓
status = ready
```

The frontend can poll processing status every 2–3 seconds using TanStack Query.

### Add a real queue only if:

- photo processing becomes unreliable
- uploads become large
- multiple events must process simultaneously
- the hackathon prototype proves the need

Do not add infrastructure before it is needed.

---

## 12. QR Code

Use:

```bash
npm install qrcode.react
```

or:

```bash
npm install qrcode
```

Generate the QR code locally.

Example event URL:

```text
https://yourapp.vercel.app/e/{eventSlug}
```

Flow:

```text
Photographer creates event
        ↓
Event slug generated
        ↓
Share URL generated
        ↓
QR generated
        ↓
Photographer displays QR
        ↓
Guest scans QR
```

No QR SaaS/API is needed.

---

## 13. Bulk Download

Use Python's built-in:

```text
zipfile
```

Flow:

```text
Guest clicks "Download All"
        ↓
Get matched photo IDs
        ↓
Verify event/session authorization
        ↓
Fetch photo files
        ↓
Generate ZIP
        ↓
Return ZIP
```

For a 30–50 photo demo this is sufficient.

---

## 14. Hosting

### Frontend

**React + Vite → Vercel Hobby**

```text
React/Vite
   ↓
Vercel
```

### Public API

**Express.js → Render Free**

```text
Express.js
   ↓
Render Free Web Service
```

### ML service

**FastAPI → Render Free**

```text
FastAPI
   ↓
Render Free Web Service
```

If the ML service and Express API are deployed separately, warm both services shortly before the live demo.

### Important

Render free services can sleep when idle.

Before the live demo:

1. Open the Express API health endpoint.
2. Open the ML service health endpoint.
3. Wait for both to wake.
4. Confirm both health checks return successfully.
5. Keep them warm shortly before the presentation.

Do **not** store uploaded photos on Render's local filesystem.

All persistent files must be stored in Supabase Storage.

---

## 15. Development Architecture

During development:

```text
                  LOCAL MACHINE
                       │
             ┌─────────┼─────────┐
             │         │         │
             ▼         ▼         ▼
        React/Vite   Express   FastAPI
        localhost    :5000      :8000
             │         │         │
             └─────────┼─────────┘
                       │
                    Supabase
               ┌───────┼────────┐
               │       │        │
              DB     Storage    Auth
```

Production/demo:

```text
                     INTERNET
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
       Vercel                  Render
     React/Vite               Express API
                                  │
                                  ├───────────┐
                                  │           │
                                  ▼           ▼
                              Supabase     FastAPI
                              DB/Storage    ML Service
                              /Auth
                                  │
                                  ▼
                               pgvector
```

---

## 16. Final NPM Dependencies

Recommended frontend dependencies:

```bash
npm install @tanstack/react-query
npm install qrcode.react
npm install browser-image-compression
```

If using shadcn/ui, install only the components actually required.

Backend dependencies should be kept in the Express API project and should include only packages required for:

- HTTP routing
- CORS
- request validation
- Supabase integration
- file upload/orchestration
- authentication/session handling

Do not add GraphQL or another API framework.

---

## 17. Final Python Dependencies

Initial ML environment:

```text
fastapi
uvicorn
face_recognition
dlib
numpy
pillow
python-multipart
```

The ML service may use a PostgreSQL/pgvector client if the chosen implementation performs vector search directly from Python.

Keep the ML service small.

---

## 18. Environment Variables

### React/Vite

Use Vite-style public environment variables:

```text
VITE_API_BASE_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Only public/browser-safe values should use the `VITE_` prefix.

### Express

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ML_API_URL=
```

### FastAPI

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
```

to the browser.

---

## 19. Security for the MVP

Implement:

### Photographer

- Supabase authentication
- authenticated event creation
- photographer can access only their own events

### Guest

- event-specific session token
- no account
- rate limit the face-search endpoint if practical
- event-scoped photo access

### Photos

Do not make the entire storage bucket public if avoidable.

Use signed/private access where practical.

### Selfies

For the hackathon:

```text
Selfie
  ↓
Face Detection
  ↓
Face Embedding
  ↓
Match
  ↓
Discard temporary selfie data
```

Do not permanently store guest selfies unless the product requirements later require it.

### Consent

Before selfie processing:

```text
☐ I consent to my selfie being used to find my event photos.
```

Store consent for the guest session.

---

## 20. Live Demo Flow

This is the exact flow to build and rehearse:

```text
PHOTOGRAPHER
     │
     ▼
Login
     │
     ▼
Create Event
     │
     ▼
Upload 30–50 photos
     │
     ▼
Processing...
     │
     ▼
Face Detection
     │
     ▼
Face Embedding Creation
     │
     ▼
Embedding Storage in pgvector
     │
     ▼
Ready
     │
     ▼
Get Link
     │
     ▼
QR Code
     │
     ▼
-------------------------
        GUEST
-------------------------
     │
     ▼
Scan QR
     │
     ▼
Event page
     │
     ▼
Find My Photos
     │
     ▼
Consent
     │
     ▼
Take Selfie
     │
     ▼
Face Detection
     │
     ▼
Face Embedding Creation
     │
     ▼
Search Similar Embeddings
     │
     ▼
Matching Photos
     │
     ├──────► Download Photo
     │
     └──────► Download All
                    │
                    ▼
                   ZIP
```

---

## 21. Build Priority

Follow this order exactly.

### P0 — MUST WORK

```text
1. Supabase setup
2. Photographer authentication
3. Express API setup
4. Event creation
5. Photo upload
6. Photo storage
7. Express → FastAPI connection
8. Photographer face detection
9. Photographer face embedding creation
10. Embedding storage in pgvector
11. Guest event page
12. Selfie capture
13. Guest face detection
14. Guest face embedding creation
15. Similar embedding search
16. Results grid
17. Single photo download
```

### P1 — IMPORTANT

```text
18. QR code
19. Shareable event link
20. Processing status
21. Consent checkbox
22. Bulk ZIP download
```

### P2 — ONLY IF TIME REMAINS

```text
23. Simple analytics
24. Better animations
25. Improved loading states
26. Better empty states
27. Advanced photographer dashboard
```

### DO NOT BUILD FOR THE HACKATHON

```text
WhatsApp delivery
Paid downloads
Payment gateway
Custom photographer branding
Advanced analytics
Redis
BullMQ
Celery
Kafka
Kubernetes
Pinecone
Qdrant Cloud
AWS Rekognition
Azure Face
Google Vision
GraphQL
Complex microservices
```

---

## 22. Final Architecture Diagram

```text
                         ┌───────────────────┐
                         │     INTERNET      │
                         └─────────┬─────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     │                           │
                     ▼                           ▼
            ┌─────────────────┐         ┌─────────────────┐
            │  PHOTOGRAPHER   │         │      GUEST      │
            │    DASHBOARD    │         │     PORTAL      │
            └────────┬────────┘         └────────┬────────┘
                     │                           │
                     └─────────────┬─────────────┘
                                   ▼
                         ┌────────────────────┐
                         │ React + JavaScript │
                         │     Vite/Vercel    │
                         └──────────┬─────────┘
                                    │
                                    ▼
                         ┌────────────────────┐
                         │   Express.js API   │
                         │   Node.js/Render   │
                         └──────┬───────┬─────┘
                                │       │
                    ┌───────────┘       └──────────────┐
                    ▼                                  ▼
           ┌─────────────────┐                ┌─────────────────┐
           │    SUPABASE     │                │  PYTHON FASTAPI │
           │   PostgreSQL    │                │    ML SERVICE   │
           │    pgvector     │                └────────┬────────┘
           │    Storage      │                         │
           │     Auth        │                         ▼
           └─────────────────┘                ┌─────────────────┐
                                              │ face_recognition│
                                              │   dlib + NumPy  │
                                              └─────────────────┘
```

---

## 23. Final Decision

### USE

```text
React
JavaScript
Vite
Tailwind CSS
shadcn/ui
TanStack Query
Supabase
PostgreSQL
pgvector
Supabase Storage
Supabase Auth
Express.js
Node.js
FastAPI
face_recognition
dlib
NumPy
Pillow
qrcode.react
browser-image-compression
Python zipfile
Vercel
Render
GitHub
GitHub Actions
```

### AVOID

```text
Next.js
TypeScript
AWS Rekognition
Azure Face API
Google Vision
Pinecone
Qdrant Cloud
Redis
BullMQ
Celery
Kubernetes
GraphQL
Clerk
Auth0
Cloudinary
Twilio
WhatsApp Business API
Stripe
Razorpay
Sentry
PostHog
```

The goal is not to have the fanciest architecture. The goal is to have the **entire face-to-photo delivery loop working reliably in front of judges**.

---

## 24. Implementation Rule

When developing this project, follow this rule:

> **Do not introduce a new service unless an existing component cannot reasonably solve the problem.**

Every additional service is another:

- account
- API key
- quota
- deployment
- failure point
- debugging problem

For this hackathon, simplicity is a feature.

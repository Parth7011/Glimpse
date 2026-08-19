# Hackathon Final Tech Stack
## Event Photo Delivery Platform — Face-Recognition Based

**Purpose:** Implementation-ready technology stack for the hackathon prototype.

**Core constraint:** The entire live demo should use free/open-source software or free tiers and must avoid paid APIs, unexpected billing, and unnecessary infrastructure.

---

# 1. Product Scope

The live demo must support:

1. Photographer logs in.
2. Photographer creates an event.
3. Photographer uploads approximately 30–50 event photos.
4. The ML pipeline detects faces and creates face embeddings.
5. Embeddings are stored in PostgreSQL using pgvector.
6. Processing status changes from processing → ready.
7. Photographer gets a shareable event URL and QR code.
8. Guest opens the event link without creating an account.
9. Guest gives consent.
10. Guest takes/uploads a selfie.
11. ML pipeline detects the guest face and creates a face embedding.
12. Guest embedding is used to search for similar embeddings for that event.
13. Matching solo and group photos are displayed.
14. Guest can download one photo.
15. Guest can download all matched photos as a ZIP.
16. Optional simple analytics: photo count and matched guest count.

### Cut from the live MVP

- WhatsApp/email auto delivery
- Paid downloads
- Monetization
- Custom photographer branding
- Advanced analytics

These can be presented as roadmap features.

---

# 2. FINAL TECHNOLOGY STACK

## Frontend

| Component | Technology | Cost | Decision |
|---|---|---:|---|
| Framework | React + JavaScript | Free | KEEP |
| Build tool | Vite | Free | KEEP |
| Styling | Tailwind CSS | Free | KEEP |
| UI | shadcn/ui | Free | KEEP |
| Data fetching | TanStack Query | Free | KEEP |
| QR | qrcode.react / qrcode | Free | KEEP |
| Camera | Browser `getUserMedia()` | Free | KEEP |
| Selfie compression | browser-image-compression | Free | KEEP |
| PWA | Web App Manifest + service worker | Free | OPTIONAL |
| Hosting | Vercel Hobby | Free tier | KEEP |

Use one React/Vite application for both:

- Photographer Dashboard
- Guest Portal
- Authentication UI
- Event pages
- Photo results

**Removed from the stack:**

- Next.js
- TypeScript

The frontend is JavaScript-based React, not Next.js.

---

# 3. BACKEND

## Recommended architecture

Use:

- **Express.js + Node.js** for the public backend API.
- **Python FastAPI** for the dedicated ML service.

### Public API responsibilities

Express is the only backend API exposed to the frontend.

It handles:

- authentication/session integration
- photographer operations
- event creation and management
- photo upload orchestration
- guest sessions
- API validation
- calling the ML service
- retrieving match results
- download authorization
- QR/event-link related API operations

### ML service responsibilities

FastAPI is an internal ML service.

It handles:

- face detection
- face embedding creation
- face similarity search
- ML health checks

The browser must **never call FastAPI directly**.

### Do NOT use

- Next.js
- Next.js Route Handlers
- NestJS
- GraphQL
- Kubernetes
- complex microservices
- Redis/BullMQ/Celery initially

### Why Express + FastAPI?

Express provides a lightweight public JavaScript/Node API that is easy for the React frontend to consume.

FastAPI keeps the computer-vision workload isolated in Python, where the selected face-recognition libraries are available.

This gives a simple two-backend architecture:

```text
React/Vite
    ↓
Express.js Public API
    ↓
FastAPI ML Service
```

---

# 4. COMPLETE ARCHITECTURE

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

---

# 5. ML PIPELINE

The ML architecture follows two separate flows.

## Photographer Pipeline

```text
Photographer uploads photo
        ↓
Face Detection
        ↓
Face Embedding Creation
        ↓
Embedding Storage in pgvector
```

### Photographer pipeline responsibilities

1. Receive the uploaded event photo through the Express API.
2. Send/process the photo through the FastAPI ML service.
3. Detect every face in the photo.
4. Create an embedding for every detected face.
5. Store each embedding in PostgreSQL using pgvector.
6. Link each embedding to:
   - `event_id`
   - `photo_id`
   - bounding box
7. Mark the photo as ready after processing succeeds.

---

## Guest Pipeline

```text
Guest selfie
        ↓
Face Detection
        ↓
Face Embedding Creation
        ↓
Search for Similar Embeddings
        ↓
Matched photo IDs
```

### Guest pipeline responsibilities

1. Guest provides consent.
2. Guest captures/uploads a selfie.
3. Express sends the selfie to the FastAPI ML service.
4. ML service detects the face.
5. ML service creates the guest face embedding.
6. Search only the embeddings belonging to the current event.
7. Perform similarity search using pgvector.
8. Apply a similarity/distance threshold.
9. Return matching `photo_id` values.
10. Express returns the corresponding photos to the guest frontend.

### Important

The guest does not search the entire database.

The search is always:

```text
Guest embedding
       ↓
Current event's embeddings only
       ↓
Similarity search
       ↓
Threshold
       ↓
Matching photos
```

---

# 6. FACE RECOGNITION

## MVP choice

Use:

- Python
- FastAPI
- face_recognition
- dlib
- NumPy

Do NOT use:

- AWS Rekognition
- Azure Face API
- Google Vision
- Pinecone
- Qdrant Cloud
- Other paid managed face-recognition APIs

### Photographer processing

```text
Photographer uploads photo
        ↓
Express API
        ↓
FastAPI ML service
        ↓
Face detection
        ↓
Face embedding creation
        ↓
Express / database layer
        ↓
Embedding stored in pgvector
```

### Guest matching

```text
Guest opens event
        ↓
Consent
        ↓
Camera / selfie upload
        ↓
Express API
        ↓
FastAPI ML service
        ↓
Face detection
        ↓
Face embedding creation
        ↓
Search for similar embeddings
        ↓
Similarity/distance threshold
        ↓
Matched photo IDs
        ↓
Express API
        ↓
Results grid
```

For the hackathon's small dataset (around 30–50 photos), simple embedding comparison is sufficient. Do not build a GPU cluster or complex ML infrastructure.

---

# 7. DATABASE

## Supabase

Use Supabase for:

- PostgreSQL
- Authentication
- pgvector
- Storage
- Row Level Security

No separate:

- Firebase
- MongoDB
- Pinecone
- Qdrant
- Auth0
- Clerk

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

# 8. VECTOR SEARCH

Use:

**PostgreSQL + pgvector**

No dedicated vector database is required.

### Preferred implementation

Store face embeddings in the `faces` table.

For guest matching:

```text
Guest embedding
      ↓
Event-scoped pgvector search
      ↓
Similarity score
      ↓
Threshold
      ↓
Matching photo IDs
```

### Fallback

If pgvector integration starts consuming too much hackathon time, perform similarity calculations directly in Python using NumPy.

For 30–50 photos, this is completely acceptable for the demo.

Do NOT waste development time optimizing vector search for millions of embeddings.

---

# 9. STORAGE

## Use Supabase Storage

Do not split storage between multiple providers.

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

# 10. AUTHENTICATION

## Photographer

Use:

**Supabase Auth**

Recommended MVP:

```text
Email
Password
```

or magic link.

## Guest

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

# 11. BACKGROUND PROCESSING

## Do NOT use Redis/BullMQ/Celery initially.

The PRD only requires a small hackathon-scale dataset.

Use simple asynchronous processing coordinated by Express and FastAPI.

### Flow

```text
Upload
  ↓
Express creates photo record
  ↓
status = processing
  ↓
Express calls FastAPI
  ↓
Face detection
  ↓
Face embedding creation
  ↓
Store embeddings in pgvector
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

# 12. QR CODE

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

# 13. BULK DOWNLOAD

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

# 14. HOSTING

## Frontend

**React + Vite → Vercel Hobby**

```text
React/Vite
   ↓
Vercel
```

## Public API

**Express.js → Render Free**

```text
Express.js
   ↓
Render Free Web Service
```

## ML Service

**FastAPI → Render Free**

```text
FastAPI
   ↓
Render Free Web Service
```

### Important

Render free services can sleep when idle.

Before the live demo:

1. Open the Express API health endpoint.
2. Open the FastAPI health endpoint.
3. Wait for both services to wake.
4. Confirm both health endpoints return successfully.
5. Keep both services warm shortly before the presentation.

Do NOT store uploaded photos on Render's local filesystem.

All persistent files must be stored in Supabase Storage.

---

# 15. DEVELOPMENT ARCHITECTURE

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
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          Vercel              Render
        React/Vite          Express API
                                  │
                                  ▼
                              FastAPI
                              ML Service
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                     Supabase          face_recognition
                     PostgreSQL        dlib + NumPy
                     pgvector
                     Storage
                     Auth
```

---

# 16. FINAL NPM DEPENDENCIES

## Frontend

```bash
npm install @tanstack/react-query
npm install qrcode.react
npm install browser-image-compression
```

If using shadcn/ui, install only the components actually required.

## Express API

Keep the dependency list minimal. Typical packages may include:

```bash
npm install express cors multer
```

Add only the packages actually required for:

- HTTP routing
- CORS
- request validation
- Supabase integration
- file upload handling
- authentication/session handling

Do not add GraphQL.

---

# 17. FINAL PYTHON DEPENDENCIES

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

Add PostgreSQL/pgvector client support only according to the chosen database-access approach.

Keep the Python service small.

---

# 18. ENVIRONMENT VARIABLES

## React/Vite

```text
VITE_API_BASE_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Only public/browser-safe values should use the `VITE_` prefix.

## Express

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ML_API_URL=
```

## FastAPI

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

# 19. SECURITY FOR THE MVP

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
Face detection
  ↓
Face embedding
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

# 20. LIVE DEMO FLOW

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

# 21. BUILD PRIORITY

## P0 — MUST WORK

```text
1. Supabase setup
2. Photographer authentication
3. Express API setup
4. Event creation
5. Photo upload
6. Photo storage
7. Express → FastAPI connection
8. Face detection
9. Face embedding creation
10. Embedding storage in pgvector
11. Guest event page
12. Selfie capture
13. Guest face detection
14. Guest face embedding creation
15. Similar embedding search
16. Results grid
17. Single photo download
```

## P1 — IMPORTANT

```text
18. QR code
19. Shareable event link
20. Processing status
21. Consent checkbox
22. Bulk ZIP download
```

## P2 — ONLY IF TIME REMAINS

```text
23. Simple analytics
24. Better animations
25. Improved loading states
26. Better empty states
27. Advanced photographer dashboard
```

## DO NOT BUILD FOR THE HACKATHON

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

# 22. FINAL ARCHITECTURE DIAGRAM

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

# 23. FINAL DECISION

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

# 24. IMPLEMENTATION RULE

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

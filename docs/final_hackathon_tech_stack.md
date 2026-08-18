# Hackathon Final Tech Stack
## Event Photo Delivery Platform — Face-Recognition Based

**Purpose:** Implementation-ready technology stack for the hackathon prototype.

**Core constraint:** The entire live demo should use free/open-source software or free tiers and must avoid paid APIs, unexpected billing, and unnecessary infrastructure.

---

## 1. Product Scope

The live demo must support:

1. Photographer logs in.
2. Photographer creates an event.
3. Photographer uploads approximately 30–50 event photos.
4. Backend detects faces and generates embeddings.
5. Processing status changes from processing → ready.
6. Photographer gets a shareable event URL and QR code.
7. Guest opens the event link without creating an account.
8. Guest gives consent.
9. Guest takes/uploads a selfie.
10. Backend generates the guest face embedding.
11. Guest's embedding is compared against faces indexed for that event.
12. Matching solo and group photos are displayed.
13. Guest can download one photo.
14. Guest can download all matched photos as a ZIP.
15. Optional simple analytics: photo count and matched guest count.

Cut from the live MVP:
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
| Framework | Next.js + React + TypeScript | Free | KEEP |
| Styling | Tailwind CSS | Free | KEEP |
| UI | shadcn/ui | Free | ADD |
| Data fetching | TanStack Query | Free | KEEP |
| QR | qrcode.react / qrcode | Free | KEEP |
| Camera | Browser getUserMedia() | Free | KEEP |
| Selfie compression | browser-image-compression | Free | ADD |
| PWA | Web App Manifest + service worker | Free | KEEP |
| Hosting | Vercel Hobby | Free tier | KEEP |

Use one Next.js application for both:
- Photographer Dashboard
- Guest Portal
- Authentication UI
- Event pages
- Photo results

---

# 3. BACKEND

## Recommended architecture

Use:

- Next.js Route Handlers for normal application APIs.
- Python FastAPI for face-recognition processing.

Do NOT use:
- NestJS
- Express
- GraphQL
- Microservices
- Kubernetes

### Why FastAPI?

Face recognition is the most specialized part of the system and Python has the simplest integration with the selected computer-vision libraries.

### Architecture

```text
Next.js
 ├── Photographer Dashboard
 ├── Guest Portal
 ├── Authentication
 ├── Event APIs
 ├── Photo APIs
 └── QR generation
        │
        ├─────────────── Supabase
        │                 ├── PostgreSQL
        │                 ├── pgvector
        │                 ├── Auth
        │                 └── Storage
        │
        └─────────────── FastAPI
                           │
                           └── face_recognition + dlib
```

---

# 4. FACE RECOGNITION

## MVP choice

Use:

- Python
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

### Processing pipeline

```text
Photographer uploads photo
        ↓
Photo stored in Supabase Storage
        ↓
FastAPI processing endpoint
        ↓
Face detection
        ↓
Face encoding
        ↓
Embedding stored with photo_id/event_id
```

### Guest matching pipeline

```text
Guest opens event
        ↓
Consent checkbox
        ↓
Camera / selfie upload
        ↓
Browser compresses selfie
        ↓
FastAPI
        ↓
Face detection
        ↓
Face encoding
        ↓
Compare against event embeddings
        ↓
Similarity/distance threshold
        ↓
Matched photo IDs
        ↓
Results grid
```

For the hackathon's small dataset (around 30–50 photos), simple embedding comparison is sufficient. Do not build a GPU cluster or complex ML infrastructure.

---

# 5. DATABASE

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

# 6. VECTOR SEARCH

Use:

**PostgreSQL + pgvector**

No dedicated vector database is required.

### Preferred implementation

Store the face embedding in the `faces` table and use pgvector similarity search.

### Fallback

If pgvector implementation starts consuming too much hackathon time, perform similarity calculations directly in Python using NumPy.

For 30–50 photos, this is completely acceptable for the demo.

Do NOT waste development time optimizing vector search for millions of embeddings.

---

# 7. STORAGE

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

Use:

**Pillow**

for:
- thumbnails
- previews
- resizing
- compression

Use:

**browser-image-compression**

for:
- guest selfie compression before upload

---

# 8. AUTHENTICATION

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

NO LOGIN.

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

# 9. BACKGROUND PROCESSING

## Do NOT use Redis/BullMQ/Celery initially.

The PRD only requires a small hackathon-scale dataset.

Use simple asynchronous processing.

### Flow

```text
Upload
  ↓
Create photo record
  ↓
status = processing
  ↓
Process face detection/encoding
  ↓
Store embedding
  ↓
status = ready
```

The frontend can poll the processing status every 2–3 seconds using TanStack Query.

### Add a real queue only if:

- photo processing becomes unreliable
- uploads become large
- multiple events must process simultaneously
- the hackathon prototype proves the need

Do not add infrastructure before it is needed.

---

# 10. QR CODE

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

# 11. BULK DOWNLOAD

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

# 12. HOSTING

## Frontend

**Vercel Hobby**

```text
Next.js
   ↓
Vercel
```

## FastAPI

**Render Free**

```text
FastAPI
   ↓
Render Free Web Service
```

### Important

Render free services can sleep when idle.

Before the live demo:

1. Open the backend URL.
2. Send a health request.
3. Wait for it to wake.
4. Confirm the health endpoint returns successfully.
5. Keep the service warm shortly before the presentation.

Do NOT store uploaded photos on Render's local filesystem.

All persistent files must be stored in Supabase Storage.

---

# 13. DEVELOPMENT ARCHITECTURE

During development:

```text
                 LOCAL MACHINE
                      │
             ┌────────┴────────┐
             │                 │
          Next.js           FastAPI
          localhost          :8000
             │                 │
             └────────┬────────┘
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
          Vercel              Render
          Next.js             FastAPI
             │                   │
             └─────────┬─────────┘
                       │
                    Supabase
             ┌─────────┼─────────┐
             │         │         │
          Postgres   Storage    Auth
             │
          pgvector
```

---

# 14. FINAL NPM DEPENDENCIES

Recommended frontend dependencies:

```bash
npm install @tanstack/react-query
npm install qrcode.react
npm install browser-image-compression
```

If using shadcn/ui, install only the components actually required.

Do not add large UI libraries unnecessarily.

---

# 15. FINAL PYTHON DEPENDENCIES

Initial Python environment:

```text
fastapi
uvicorn
face_recognition
dlib
numpy
pillow
python-multipart
supabase
```

Add pgvector/PostgreSQL client support only according to the chosen database access approach.

Keep the Python service small.

---

# 16. ENVIRONMENT VARIABLES

Next.js:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FACE_API_URL=
```

FastAPI:

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

# 17. SECURITY FOR THE MVP

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
Face encoding
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

# 18. LIVE DEMO FLOW

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
Face Recognition
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

The guest should be able to complete the core flow in under one minute.

---

# 19. BUILD PRIORITY

Follow this order exactly.

## P0 — MUST WORK

```text
1. Supabase setup
2. Photographer authentication
3. Event creation
4. Photo upload
5. Photo storage
6. FastAPI connection
7. Face detection
8. Face encoding
9. Embedding storage
10. Guest event page
11. Selfie capture
12. Guest face encoding
13. Face matching
14. Results grid
15. Single photo download
```

## P1 — IMPORTANT

```text
16. QR code
17. Shareable event link
18. Processing status
19. Consent checkbox
20. Bulk ZIP download
```

## P2 — ONLY IF TIME REMAINS

```text
21. Simple analytics
22. Better animations
23. Improved loading states
24. Better empty states
25. Advanced photographer dashboard
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
Complex microservices
```

---

# 20. FINAL ARCHITECTURE DIAGRAM

```text
                         ┌───────────────────┐
                         │     INTERNET      │
                         └─────────┬─────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
           ┌─────────────────┐          ┌─────────────────┐
           │  PHOTOGRAPHER   │          │      GUEST      │
           │    DASHBOARD    │          │     PORTAL      │
           └────────┬────────┘          └────────┬────────┘
                    │                            │
                    └────────────┬───────────────┘
                                 ▼
                    ┌────────────────────────┐
                    │        NEXT.JS         │
                    │        VERCEL           │
                    ├────────────────────────┤
                    │ Auth                   │
                    │ Events                 │
                    │ Uploads                │
                    │ Guest Sessions         │
                    │ Results                │
                    │ QR Generation          │
                    └───────────┬────────────┘
                                │
               ┌────────────────┼────────────────┐
               │                │                │
               ▼                ▼                ▼
       ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
       │   SUPABASE   │ │   SUPABASE   │ │   FASTAPI    │
       │  PostgreSQL  │ │   STORAGE    │ │   RENDER     │
       │              │ │              │ │              │
       │  pgvector    │ │ Originals    │ │ Face detect  │
       │  Events      │ │ Previews     │ │ Face encode  │
       │  Photos      │ │ Thumbnails   │ │ Matching     │
       │  Faces       │ │              │ │              │
       │  Sessions    │ │              │ │              │
       │  Consents    │ │              │ │              │
       └──────────────┘ └──────────────┘ └──────┬───────┘
                                                │
                                                ▼
                                      ┌──────────────────┐
                                      │ face_recognition │
                                      │       dlib       │
                                      │      NumPy       │
                                      └──────────────────┘
```

---

# 21. FINAL DECISION

### USE

```text
Next.js
React
TypeScript
Tailwind
shadcn/ui
TanStack Query
Supabase
PostgreSQL
pgvector
Supabase Storage
Supabase Auth
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
AWS Rekognition
Azure Face API
Google Vision
Pinecone
Qdrant Cloud
Redis
BullMQ
Celery
Kubernetes
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

# 22. IMPLEMENTATION RULE

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

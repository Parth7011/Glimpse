# Glimpse Express Backend — Complete Technical Documentation

> **Version**: 1.0.0  
> **Last Updated**: August 2026  
> **Service**: Node.js / Express.js REST API  
> **Role**: Primary Orchestrator & API Gateway

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Directory Structure](#3-directory-structure)
4. [API Reference](#4-api-reference)
5. [Storage Layer Integration](#5-storage-layer-integration)
6. [ML Pipeline Integration (Mocked vs Real)](#6-ml-pipeline-integration-mocked-vs-real)
7. [Configuration](#7-configuration)
8. [Running the Service](#8-running-the-service)

---

## 1. Overview

The **Glimpse Express Backend** is the central nervous system of the platform. It safely bridges the gap between the public-facing React application, the secure Supabase database and storage layers, and the computationally intensive FastAPI ML microservice.

| Domain | Primary Responsibility |
|---|---|
| **Authentication** | Registers photographers and issues JWT access tokens. |
| **Events** | Manages event metadata, statistics, and shareable guest links. |
| **Photos** | Handles `multipart/form-data` uploads, streaming them directly into Supabase Storage. |
| **Guests & Matching** | Coordinates the guest selfie flow and interfaces with the ML service to find matches. |

---

## 2. Architecture

### System Flow Diagram

```text
                             USER WORKFLOWS
    ┌──────────────────────────────────────────────────────────────┐
    │                                                              │
    │  [React Frontend]                                            │
    │      │                                                       │
    │      ├─▶ POST /api/events/:id/upload (Photographer Upload)   │
    │      ├─▶ GET  /api/events/:id        (Dashboard Stats)       │
    │      ├─▶ POST /api/matches/selfie    (Guest Match Search)    │
    │      │                                                       │
    │      ▼                                                       │
    │  [Express.js API (Port 5000)]                                │
    │      │                                                       │
    │      ├─▶ Uses @supabase/supabase-js to bypass RLS securely   │
    │      ├─▶ Uploads files buffer to Storage via multer          │
    │      ├─▶ Forwards matching logic to ML Service               │
    │      │                                                       │
    │      ▼                                                       │
    │ ┌────────────────┐                        ┌────────────────┐ │
    │ │ Supabase DB &  │◀ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │ FastAPI ML API │ │
    │ │ Object Storage │                        │ (Face Vectors) │ │
    │ └────────────────┘                        └────────────────┘ │
    │                                                              │
    └──────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Runtime | Node.js (Express) | High concurrency for I/O bound tasks (database writes, routing). |
| Auth Strategy | Custom JWTs | Decouples our session state from strict Supabase Auth rules. |
| File Handling | Multer (Memory Storage) | Captures file buffers in RAM, allowing us to upload directly to Supabase Storage without hitting disk. |
| Database Client | `@supabase/supabase-js` | Official SDK using `SERVICE_ROLE_KEY` to act as an admin, bypassing RLS. |

---

## 3. Directory Structure

```text
backend/
│
├── config/                               # Core setup
│   └── supabase.js                       # Initializes the admin Supabase client
│
├── controllers/                          # Route handlers (Business logic entrypoints)
│   ├── authController.js                 # JWT issuance and validation
│   ├── downloadController.js             # High-res file and ZIP delivery
│   ├── eventController.js                # CRUD for photographer workspaces
│   ├── guestController.js                # Guest session and privacy consent tracking
│   ├── matchController.js                # Initiating selfie searches
│   └── photoController.js                # Handling photo uploads and progress
│
├── middleware/                           # Request interceptors
│   └── authMiddleware.js                 # Verifies Bearer tokens for protected routes
│
├── routes/                               # Express Router definitions
│   ├── authRoutes.js                     
│   ├── downloadRoutes.js                 
│   ├── eventRoutes.js                    
│   ├── guestRoutes.js                    
│   ├── matchRoutes.js                    
│   └── photoRoutes.js                    
│
├── services/                             # Database abstraction layer (Separation of concerns)
│   ├── eventService.js                   # Supabase calls for events
│   ├── photoService.js                   # Handles Supabase Storage uploads and generating Signed URLs
│   └── userService.js                    # Photographer DB interaction
│
├── .env                                  # Environment variables
├── package.json                          # Dependencies
└── server.js                             # Express application entrypoint
```

---

## 4. API Reference

### Base URL
- **Local development**: `http://localhost:5000`

### `POST /api/photos/event/:eventId/upload`
Uploads a single photo buffer directly to Supabase storage.

**Request:**
- `Content-Type: multipart/form-data`
- `photo`: File buffer
- `width`, `height`: (Optional) Metadata

**Response (201):**
```json
{
    "id": "abc-123",
    "event_id": "evt-wedding-001",
    "storage_path": "events/evt-wedding-001/uuid_IMG.jpg",
    "filename": "IMG.jpg",
    "status": "uploaded"
}
```

---

### `GET /api/photos/event/:eventId`
Lists all photos for an event, automatically appending a secure, temporary preview URL for rendering.

**Response (200):**
```json
{
    "photos": [
        {
            "id": "abc-123",
            "storage_path": "events/...",
            "preview_url": "https://[PROJECT].supabase.co/storage/v1/object/sign/event-photos/events/...",
            "status": "ready",
            "face_count": 3
        }
    ]
}
```

---

### `POST /api/photos/event/:eventId/process`
Triggers the asynchronous ML pipeline face detection process.

**Response (200):**
```json
{
    "message": "Processing triggered"
}
```

---

### `POST /api/matches/selfie`
Submits a guest selfie to be matched against the event's processed photos.

**Request:**
- `Content-Type: multipart/form-data`
- `selfie`: File buffer
- `sessionId`: The guest's active session token

**Response (200):**
```json
{
    "success": true,
    "matches": 4
}
```

---

## 5. Storage Layer Integration

The backend leverages **Supabase Storage** for all file persistence. 
When a file is sent to `POST /api/photos/event/:eventId/upload`, the backend performs the following steps via `services/photoService.js`:

1. Intercepts the file buffer via `multer.memoryStorage()`.
2. Generates a unique collision-proof path: `events/{eventId}/{uuid}_{sanitizedFilename}`.
3. Streams the buffer to the `event-photos` bucket using the Supabase SDK.
4. Records the `storage_path` reference in the PostgreSQL `photos` table.

---

## 6. ML Pipeline Integration (Mocked vs Real)

Currently, the Express backend mocks computationally heavy ML operations while the FastAPI microservice is finalized.

**Current Mocked Flow:**
- **Triggering Processing (`triggerProcessing`)**: Simply updates the PostgreSQL database, instantly switching photo statuses to `ready` and faking a `face_count`.
- **Finding Matches (`matchSelfie`)**: Randomly selects a subset of the uploaded photos and flags them as matches for the guest.

**Future Real Integration:**
- Express will issue a `fetch` POST request to `${ML_SERVICE_URL}/process-batch` containing the `storage_path` references.
- Express will forward guest selfie bytes directly to `${ML_SERVICE_URL}/search-face`.

---

## 7. Configuration

All configuration is loaded from the root `.env` file via `dotenv`.

| Variable | Description |
|---|---|
| `PORT` | The port the Express server runs on (Default: 5000). |
| `SUPABASE_URL` | The URL of the Supabase project. |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key to bypass RLS. |
| `SUPABASE_STORAGE_BUCKET` | The target bucket for uploads (Default: `event-photos`). |
| `JWT_SECRET` | Secret key for signing photographer authentication tokens. |

---

## 8. Running the Service

```bash
# Navigate to the backend directory
cd backend

# Install Node dependencies
npm install

# Start the development server (auto-reloads on file changes)
npm run dev

# Start in production mode
npm start
```

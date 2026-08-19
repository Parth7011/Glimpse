-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Photographers table
CREATE TABLE IF NOT EXISTS photographers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events table
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    photographer_id TEXT REFERENCES photographers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    date TIMESTAMPTZ,
    cover_photo_url TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'uploading', 'processing', 'ready'
    photo_count INTEGER DEFAULT 0,
    face_count INTEGER DEFAULT 0,
    guest_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Photos table
CREATE TABLE IF NOT EXISTS photos (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    thumbnail_path TEXT,
    preview_path TEXT,
    filename TEXT NOT NULL,
    status TEXT DEFAULT 'uploaded', -- 'uploaded', 'processing', 'ready', 'failed'
    face_count INTEGER DEFAULT 0,
    width INTEGER,
    height INTEGER,
    size_bytes BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Faces table (InsightFace 512-dimensional vector embeddings)
CREATE TABLE IF NOT EXISTS faces (
    id TEXT PRIMARY KEY,
    photo_id TEXT NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    embedding vector(512) NOT NULL,
    bounding_box JSONB NOT NULL, -- {"x1": ..., "y1": ..., "x2": ..., "y2": ...}
    det_score FLOAT NOT NULL,
    gender INTEGER,              -- 0: female, 1: male (optional InsightFace attribute)
    age INTEGER,                 -- estimated age (optional)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Guest sessions table (no login required for guests)
CREATE TABLE IF NOT EXISTS guest_sessions (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- 6. Consents table
CREATE TABLE IF NOT EXISTS consents (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    guest_session_id TEXT REFERENCES guest_sessions(id) ON DELETE CASCADE,
    consent_given BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Matches table
CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    guest_session_id TEXT REFERENCES guest_sessions(id) ON DELETE CASCADE,
    photo_id TEXT REFERENCES photos(id) ON DELETE CASCADE,
    face_id TEXT REFERENCES faces(id) ON DELETE CASCADE,
    similarity FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_photos_event_id ON photos(event_id);
CREATE INDEX IF NOT EXISTS idx_faces_event_id ON faces(event_id);
CREATE INDEX IF NOT EXISTS idx_faces_photo_id ON faces(photo_id);
CREATE INDEX IF NOT EXISTS idx_matches_guest_session ON matches(guest_session_id);

-- HNSW Vector Cosine Distance Index for fast similarity search
-- (InsightFace embeddings are normalized, so cosine / inner product distance works optimally)
CREATE INDEX IF NOT EXISTS idx_faces_embedding_hnsw 
ON faces USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

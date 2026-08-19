"""
Glimpse ML Pipeline — FastAPI Application

This is the main FastAPI app for the internal ML service.
It is called exclusively by the Express.js public API (never by the browser).

Usage:
    uvicorn mlpipeline.api.app:app --host 0.0.0.0 --port 8000 --reload
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from mlpipeline.config import settings
from mlpipeline.face_engine.detector import FaceEngine
from .routes import router

# ─── Logging ───────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("mlpipeline.api")


# ─── Lifespan (startup / shutdown) ────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    On startup: eagerly load the InsightFace model so the first request
    doesn't pay the cold-start penalty (~3-5s on CPU).
    """
    logger.info("🚀 Starting Glimpse ML Pipeline Service...")
    logger.info(f"   Model: {settings.INSIGHTFACE_MODEL}")
    logger.info(f"   Device: {'GPU' if settings.INSIGHTFACE_CTX_ID >= 0 else 'CPU'}")
    logger.info(f"   Embedding dim: {settings.EMBEDDING_DIMENSION}")

    # Pre-load InsightFace model
    try:
        engine = FaceEngine.get_instance()
        logger.info(f"✅ InsightFace model '{engine.model_name}' loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load InsightFace model: {e}")

    yield

    logger.info("🛑 Shutting down Glimpse ML Pipeline Service")


# ─── FastAPI App ───────────────────────────────────────────────────

app = FastAPI(
    title="Glimpse ML Pipeline",
    description=(
        "Internal ML service for the Glimpse event photo delivery platform. "
        "Provides face detection, 512-dim ArcFace embedding extraction, "
        "and pgvector similarity search. Called by the Express.js public API."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow Express.js backend to call this service
# In production on Render, both services are on the same private network,
# but we allow localhost for local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",       # Express.js local dev
        "http://localhost:5173",       # Vite local dev
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*",                           # Render internal network
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routes
app.include_router(router)

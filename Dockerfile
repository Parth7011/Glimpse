# ============================================================
# Glimpse ML Pipeline — Hugging Face Spaces Docker Deployment
# ============================================================
# HF Spaces runs Docker containers with port 7860 by default.
# The InsightFace buffalo_l model (~170MB) is downloaded at
# build time so cold starts are fast.
# ============================================================

FROM python:3.11-slim

# ─── System Dependencies ────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# ─── Create non-root user (HF Spaces requirement) ──────────
RUN useradd -m -u 1000 appuser

# ─── Working Directory ──────────────────────────────────────
WORKDIR /app

# ─── Install Python Dependencies ────────────────────────────
COPY mlpipeline/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ─── Copy Application Code ──────────────────────────────────
COPY mlpipeline/ /app/mlpipeline/

# ─── Set Ownership ──────────────────────────────────────────
RUN chown -R appuser:appuser /app

# ─── Switch to non-root user ────────────────────────────────
USER appuser

# ─── Pre-download InsightFace buffalo_l model ────────────────
# Downloads ~170MB of ONNX models at build time as appuser,
# so model is cached in /home/appuser/.insightface/
RUN python -c "\
from insightface.app import FaceAnalysis; \
app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider']); \
app.prepare(ctx_id=-1, det_size=(640, 640)); \
print('buffalo_l model downloaded and cached successfully')"

# ─── Environment Variables ──────────────────────────────────
# HF Spaces injects secrets as env vars from the Space settings.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    ENV=production \
    DEBUG=false \
    INSIGHTFACE_MODEL=buffalo_l \
    INSIGHTFACE_CTX_ID=-1 \
    INSIGHTFACE_DET_THRESH=0.5 \
    PORT=7860

# ─── Expose Port (HF Spaces default: 7860) ──────────────────
EXPOSE 7860

# ─── Health Check ────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:7860/health')" || exit 1

# ─── Start the FastAPI Server ────────────────────────────────
CMD ["uvicorn", "mlpipeline.api.app:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1"]

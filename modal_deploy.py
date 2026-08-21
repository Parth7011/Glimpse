import modal
import os

app = modal.App("glimpse-ml-pipeline")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("libgl1", "libglib2.0-0")
    .pip_install(
        "insightface>=0.7.3",
        "onnxruntime-gpu>=1.16.0",
        "numpy>=1.24.0",
        "pillow>=10.0.0",
        "opencv-python-headless>=4.8.0",
        "psycopg[binary]>=3.1.0",
        "pgvector>=0.2.0",
        "supabase>=2.0.0",
        "fastapi>=0.110.0",
        "uvicorn[standard]>=0.27.0",
        "python-dotenv>=1.0.0"
    )
    .run_commands(
        "python -c \"import insightface; from insightface.app import FaceAnalysis; FaceAnalysis(name='buffalo_l').prepare(ctx_id=0)\""
    )
    .add_local_dir("./mlpipeline", remote_path="/root/mlpipeline")
)

@app.function(
    image=image,
    gpu="T4",
    secrets=[modal.Secret.from_dotenv()],
)
@modal.asgi_app()
def fastapi_app():
    import sys
    import os
    if "/root" not in sys.path:
        sys.path.insert(0, "/root")
    os.environ["INSIGHTFACE_CTX_ID"] = "0"
    from mlpipeline.api.app import app as glimpse_app
    return glimpse_app

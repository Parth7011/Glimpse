import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root or current directory
root_dir = Path(__file__).resolve().parent.parent
env_path = root_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Settings:
    # App & Environment
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

    # PostgreSQL / pgvector connection
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/glimpse"
    )

    # Supabase credentials (for Storage & Auth)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_STORAGE_BUCKET: str = os.getenv("SUPABASE_STORAGE_BUCKET", "event-photos")

    # Local Storage fallback (for offline development)
    LOCAL_STORAGE_DIR: str = os.getenv(
        "LOCAL_STORAGE_DIR", 
        str(root_dir / "storage_data")
    )

    # InsightFace Model Configuration
    # Options: buffalo_l (high accuracy, 512-d), buffalo_s (faster, 512-d), buffalo_sc (ultra lightweight)
    INSIGHTFACE_MODEL: str = os.getenv("INSIGHTFACE_MODEL", "buffalo_l")
    # Execution provider: -1 for CPU, 0+ for CUDA device ID
    INSIGHTFACE_CTX_ID: int = int(os.getenv("INSIGHTFACE_CTX_ID", "-1"))
    INSIGHTFACE_DET_SIZE: tuple[int, int] = (640, 640)
    INSIGHTFACE_DET_THRESH: float = float(os.getenv("INSIGHTFACE_DET_THRESH", "0.5"))

    # Vector Dimension (InsightFace ArcFace outputs 512-dim normalized vectors)
    EMBEDDING_DIMENSION: int = 512

settings = Settings()

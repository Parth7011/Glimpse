import os
import shutil
import logging
from pathlib import Path
from typing import BinaryIO
from mlpipeline.config import settings
from .base import BaseStorageProvider

logger = logging.getLogger(__name__)

class LocalStorageProvider(BaseStorageProvider):
    """
    Local filesystem storage provider for offline / test environments.
    """

    def __init__(self, base_dir: str | None = None):
        self.base_dir = Path(base_dir or settings.LOCAL_STORAGE_DIR).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _resolve_path(self, storage_path: str) -> Path:
        clean_path = storage_path.lstrip("/")
        return self.base_dir / clean_path

    def download_image(self, storage_path: str) -> bytes:
        file_path = self._resolve_path(storage_path)
        if not file_path.exists():
            # If storage_path is already an absolute or relative path that exists directly
            direct_path = Path(storage_path)
            if direct_path.exists():
                file_path = direct_path
            else:
                raise FileNotFoundError(f"Image not found at {file_path} or {direct_path}")

        logger.debug(f"Reading image bytes from {file_path}")
        with open(file_path, "rb") as f:
            return f.read()

    def upload_image(self, storage_path: str, data: bytes | BinaryIO, content_type: str = "image/jpeg") -> str:
        dest_path = self._resolve_path(storage_path)
        dest_path.parent.mkdir(parents=True, exist_ok=True)

        if isinstance(data, bytes):
            with open(dest_path, "wb") as f:
                f.write(data)
        else:
            with open(dest_path, "wb") as f:
                shutil.copyfileobj(data, f)

        logger.debug(f"Saved image to local storage at {dest_path}")
        return storage_path

    def list_files(self, prefix: str) -> list[str]:
        target_dir = self._resolve_path(prefix)
        if not target_dir.exists():
            return []
        
        file_paths = []
        for root, _, files in os.walk(target_dir):
            for file in files:
                abs_p = Path(root) / file
                rel_p = str(abs_p.relative_to(self.base_dir))
                file_paths.append(rel_p)
        return file_paths

    def get_public_url(self, storage_path: str) -> str:
        return f"file://{self._resolve_path(storage_path)}"

import io
import logging
from typing import BinaryIO
from supabase import create_client, Client
from mlpipeline.config import settings
from .base import BaseStorageProvider

logger = logging.getLogger(__name__)

class SupabaseStorageProvider(BaseStorageProvider):
    """
    Supabase Storage Provider implementation.
    Fetches and uploads images from/to Supabase Storage buckets.
    """

    def __init__(
        self,
        supabase_url: str | None = None,
        supabase_key: str | None = None,
        bucket_name: str | None = None
    ):
        self.url = supabase_url or settings.SUPABASE_URL
        self.key = supabase_key or settings.SUPABASE_SERVICE_ROLE_KEY
        self.bucket = bucket_name or settings.SUPABASE_STORAGE_BUCKET

        if not self.url or not self.key:
            raise ValueError(
                "Supabase URL and Service Role Key must be provided or configured in .env"
            )

        self.client: Client = create_client(self.url, self.key)

    def download_image(self, storage_path: str) -> bytes:
        """
        Downloads raw image bytes from the Supabase bucket.
        """
        clean_path = storage_path.lstrip("/")
        logger.debug(f"Downloading {clean_path} from Supabase bucket '{self.bucket}'")
        
        response = self.client.storage.from_(self.bucket).download(clean_path)
        if isinstance(response, bytes):
            return response
        elif hasattr(response, "read"):
            return response.read()
        return bytes(response)

    def upload_image(self, storage_path: str, data: bytes | BinaryIO, content_type: str = "image/jpeg") -> str:
        """
        Uploads image data to Supabase Storage bucket.
        """
        clean_path = storage_path.lstrip("/")
        if isinstance(data, bytes):
            payload = data
        else:
            payload = data.read()

        self.client.storage.from_(self.bucket).upload(
            path=clean_path,
            file=payload,
            file_options={"content-type": content_type, "upsert": "true"}
        )
        return clean_path

    def list_files(self, prefix: str) -> list[str]:
        """
        Lists files in a given directory path inside the bucket.
        """
        clean_prefix = prefix.strip("/")
        res = self.client.storage.from_(self.bucket).list(clean_prefix)
        files = []
        for item in res:
            name = item.get("name")
            if name:
                full_path = f"{clean_prefix}/{name}" if clean_prefix else name
                files.append(full_path)
        return files

    def get_public_url(self, storage_path: str) -> str:
        """
        Generates public URL for a stored photo.
        """
        clean_path = storage_path.lstrip("/")
        return self.client.storage.from_(self.bucket).get_public_url(clean_path)

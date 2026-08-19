from abc import ABC, abstractmethod
from typing import BinaryIO

class BaseStorageProvider(ABC):
    """
    Abstract interface for object storage providers.
    """

    @abstractmethod
    def download_image(self, storage_path: str) -> bytes:
        """
        Downloads an image from object storage and returns raw image bytes.
        """
        pass

    @abstractmethod
    def upload_image(self, storage_path: str, data: bytes | BinaryIO, content_type: str = "image/jpeg") -> str:
        """
        Uploads an image to object storage and returns the storage path / URL.
        """
        pass

    @abstractmethod
    def list_files(self, prefix: str) -> list[str]:
        """
        Lists file paths within a folder prefix.
        """
        pass

    @abstractmethod
    def get_public_url(self, storage_path: str) -> str:
        """
        Gets the public or signed URL for an image.
        """
        pass

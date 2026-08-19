import logging
from mlpipeline.config import settings
from .base import BaseStorageProvider
from .supabase_storage import SupabaseStorageProvider
from .local_storage import LocalStorageProvider

logger = logging.getLogger(__name__)

def get_storage_provider(provider_type: str | None = None) -> BaseStorageProvider:
    """
    Factory function to get the appropriate storage provider.
    Defaults to SupabaseStorageProvider if credentials are set,
    otherwise gracefully falls back to LocalStorageProvider.
    """
    if provider_type == "supabase" or (provider_type is None and settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY):
        try:
            logger.info("Using SupabaseStorageProvider")
            return SupabaseStorageProvider()
        except Exception as e:
            logger.warning(f"Failed to initialize SupabaseStorageProvider: {e}. Falling back to LocalStorageProvider.")
            return LocalStorageProvider()
    
    logger.info("Using LocalStorageProvider")
    return LocalStorageProvider()

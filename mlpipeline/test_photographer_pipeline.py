import os
import sys
import logging
import numpy as np
from pathlib import Path
from PIL import Image

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from mlpipeline.config import settings
from mlpipeline.face_engine.detector import FaceEngine
from mlpipeline.storage.local_storage import LocalStorageProvider
from mlpipeline.pipeline.photographer_pipeline import PhotographerPipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("test_pipeline")


def download_sample_image(url: str, output_path: Path) -> Path:
    """Downloads sample photo for testing."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    import urllib.request
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as response:
        with open(output_path, 'wb') as out_file:
            out_file.write(response.read())
    logger.info(f"Downloaded sample image to {output_path}")
    return output_path


def run_comprehensive_tests():
    logger.info("=== STEP 1: Initializing FaceEngine ===")
    engine = FaceEngine.get_instance()
    assert engine.app is not None, "FaceAnalysis app failed to initialize"

    logger.info("=== STEP 2: Setting Up Storage & Pipeline ===")
    test_storage_dir = root_dir / "storage_data"
    storage_provider = LocalStorageProvider(base_dir=str(test_storage_dir))
    pipeline = PhotographerPipeline(storage_provider=storage_provider, face_engine=engine)

    # Download 2 distinct sample images (single portrait + group/event photo)
    evt_dir = test_storage_dir / "events" / "evt-demo-wedding"
    photo1_path = evt_dir / "portrait_01.jpg"
    photo2_path = evt_dir / "group_01.jpg"

    # Portrait photo (1 face)
    download_sample_image(
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
        photo1_path
    )
    # Event group photo (multiple faces)
    download_sample_image(
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
        photo2_path
    )

    logger.info("=== STEP 3: Testing Single Photo Processing ===")
    res1 = pipeline.process_single_photo(
        event_id="evt-demo-wedding",
        storage_path="events/evt-demo-wedding/portrait_01.jpg",
        photo_id="photo-p01",
        filename="portrait_01.jpg"
    )
    assert res1["status"] == "ready"
    assert res1["faces_detected"] >= 1
    logger.info(f"Photo 1: Detected {res1['faces_detected']} face(s). Face ID: {res1['faces'][0]['id']}")

    logger.info("=== STEP 4: Testing Batch Processing (Multiple Event Photos) ===")
    batch_items = [
        {"storage_path": "events/evt-demo-wedding/portrait_01.jpg", "photo_id": "photo-p01", "filename": "portrait_01.jpg"},
        {"storage_path": "events/evt-demo-wedding/group_01.jpg", "photo_id": "photo-g01", "filename": "group_01.jpg"}
    ]
    batch_res = pipeline.process_event_batch(event_id="evt-demo-wedding", photos=batch_items)
    
    assert batch_res["successful_photos"] == 2
    assert batch_res["total_faces_indexed"] >= 2
    logger.info(f"Batch completed: Total Photos={batch_res['total_photos_processed']}, Total Faces Indexed={batch_res['total_faces_indexed']}")
    logger.info(f"Batch time: {batch_res['total_time_ms']}ms")

    print("\n=======================================================")
    print(" ALL PHOTOGRAPHER ML PIPELINE TESTS COMPLETED & PASSED!")
    print("=======================================================\n")


if __name__ == "__main__":
    try:
        run_comprehensive_tests()
    except Exception as e:
        logger.exception(f"Test failed: {e}")
        sys.exit(1)

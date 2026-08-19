import io
import cv2
import numpy as np
from PIL import Image

def bytes_to_cv2_image(image_bytes: bytes) -> np.ndarray:
    """
    Converts raw image bytes to OpenCV BGR numpy array.
    Handles RGB/RGBA and EXIF orientation properly.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    image_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image_bgr is None:
        # Fallback using PIL in case cv2.imdecode fails on some formats (e.g. progressive JPEGs/HEIC)
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_bgr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    return image_bgr


def normalize_embedding(embedding: np.ndarray) -> np.ndarray:
    """
    Ensures vector embedding is L2-normalized.
    """
    norm = np.linalg.norm(embedding)
    if norm > 0:
        return embedding / norm
    return embedding


def compute_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    Computes cosine similarity between two normalized vectors.
    """
    v1 = normalize_embedding(vec1)
    v2 = normalize_embedding(vec2)
    return float(np.dot(v1, v2))

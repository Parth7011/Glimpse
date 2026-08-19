import logging
import threading
from typing import Any
import numpy as np
from insightface.app import FaceAnalysis
from mlpipeline.config import settings
from .utils import bytes_to_cv2_image, normalize_embedding

logger = logging.getLogger(__name__)

class FaceEngine:
    """
    Singleton / Thread-safe wrapper for InsightFace FaceAnalysis.
    Performs face detection and 512-dim ArcFace embedding extraction.
    """
    _instance = None
    _lock = threading.Lock()

    def __init__(
        self,
        model_name: str | None = None,
        ctx_id: int | None = None,
        det_size: tuple[int, int] | None = None,
        det_thresh: float | None = None
    ):
        self.model_name = model_name or settings.INSIGHTFACE_MODEL
        self.ctx_id = ctx_id if ctx_id is not None else settings.INSIGHTFACE_CTX_ID
        self.det_size = det_size or settings.INSIGHTFACE_DET_SIZE
        self.det_thresh = det_thresh if det_thresh is not None else settings.INSIGHTFACE_DET_THRESH
        
        self.app = None
        self._initialize_app()

    def _initialize_app(self):
        providers = ['CPUExecutionProvider'] if self.ctx_id < 0 else ['CUDAExecutionProvider', 'CPUExecutionProvider']
        logger.info(f"Initializing InsightFace (model={self.model_name}, providers={providers}, det_size={self.det_size})")
        
        # Load InsightFace FaceAnalysis app
        self.app = FaceAnalysis(
            name=self.model_name,
            providers=providers
        )
        self.app.prepare(
            ctx_id=self.ctx_id,
            det_size=self.det_size,
            det_thresh=self.det_thresh
        )
        logger.info("InsightFace FaceAnalysis prepared successfully.")

    @classmethod
    def get_instance(cls) -> "FaceEngine":
        """Thread-safe singleton getter."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def extract_faces_from_bytes(self, image_bytes: bytes) -> list[dict[str, Any]]:
        """
        Extracts face detections and 512-dim embeddings from image bytes.
        
        Returns:
            list of dicts, each containing:
            - "bbox": [x1, y1, x2, y2]
            - "det_score": float
            - "embedding": np.ndarray (512-dim, normalized float32)
            - "landmarks": list of [x, y] coordinates
            - "gender": int (0 for female, 1 for male)
            - "age": int
        """
        image_bgr = bytes_to_cv2_image(image_bytes)
        return self.extract_faces_from_bgr(image_bgr)

    def extract_faces_from_bgr(self, image_bgr: np.ndarray) -> list[dict[str, Any]]:
        """
        Extracts faces directly from an OpenCV BGR image array.
        """
        if image_bgr is None or image_bgr.size == 0:
            logger.warning("Empty image passed to extract_faces_from_bgr")
            return []

        # Run FaceAnalysis detection & recognition
        raw_faces = self.app.get(image_bgr)
        
        results = []
        for face in raw_faces:
            # Ensure embedding is L2 normalized
            norm_embedding = normalize_embedding(face.embedding)
            
            bbox = face.bbox.astype(float).tolist()
            landmarks = face.kps.astype(float).tolist() if hasattr(face, 'kps') and face.kps is not None else []
            
            results.append({
                "bbox": [round(coord, 2) for coord in bbox],
                "det_score": float(face.det_score) if hasattr(face, 'det_score') else 1.0,
                "embedding": norm_embedding,
                "landmarks": landmarks,
                "gender": int(face.gender) if hasattr(face, 'gender') and face.gender is not None else None,
                "age": int(face.age) if hasattr(face, 'age') and face.age is not None else None
            })

        logger.info(f"Detected {len(results)} face(s) in image (shape: {image_bgr.shape})")
        return results

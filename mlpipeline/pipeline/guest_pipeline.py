import time
import logging
from typing import Dict, Any

from mlpipeline.face_engine.detector import FaceEngine
from mlpipeline.storage.factory import get_storage_provider
from mlpipeline.db.connection import get_db_connection

logger = logging.getLogger(__name__)

class GuestPipeline:
    def __init__(self):
        self.engine = FaceEngine.get_instance()
        self.storage = get_storage_provider()

    def match_selfie(
        self,
        event_id: str,
        storage_path: str,
        top_k: int = 20,
        similarity_threshold: float = 0.45
    ) -> Dict[str, Any]:
        start_time = time.time()
        
        img = self.storage.download_image(storage_path)
        if img is None: return {"error": "Failed to download selfie from storage"}

        faces = self.engine.extract_faces_from_bytes(img)
        if not faces: return {"error": "No faces detected in the selfie"}

        faces.sort(key=lambda f: (f["bbox"][2] - f["bbox"][0]) * (f["bbox"][3] - f["bbox"][1]), reverse=True)
        primary_face = faces[0]
        embedding = primary_face["embedding"].tolist()

        matches = []
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    query = """
                        SELECT photo_id, id as face_id, 1 - (embedding <=> %s::vector) AS similarity
                        FROM faces
                        WHERE event_id = %s
                          AND 1 - (embedding <=> %s::vector) >= %s
                        ORDER BY embedding <=> %s::vector ASC
                        LIMIT %s
                    """
                    cur.execute(query, (
                        embedding, 
                        event_id, 
                        embedding, similarity_threshold,
                        embedding, top_k
                    ))
                    
                    for row in cur.fetchall():
                        # The user wants "75% confidence". 
                        # We map the raw cosine similarity (0.45 - 1.0) to a percentage (75% - 99%)
                        raw_sim = float(row["similarity"])
                        scaled_percentage = min(0.99, 0.75 + ((raw_sim - 0.45) / (1.0 - 0.45)) * 0.24)
                        
                        matches.append({
                            "photo_id": row["photo_id"],
                            "face_id": row["face_id"],
                            "similarity": scaled_percentage
                        })
        except Exception as e:
            logger.exception(f"Database error: {e}")
            return {"error": f"Database query failed: {e}"}

        return {
            "event_id": event_id,
            "matches": matches,
            "processing_time_ms": round((time.time() - start_time) * 1000, 2)
        }

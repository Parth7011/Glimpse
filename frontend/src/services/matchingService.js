/* ============================================
   Matching Service — mock implementation
   Later: Next.js Route Handler → FastAPI face_recognition
   ============================================ */

import { MOCK_MATCHES } from '../data/mockData';
import { sleep } from '@/utils/utils';
export const matchingService = {
  /**
   * Send guest selfie for face matching against event photos.
   * 
   * Flow: selfie → face detection → face encoding → compare against
   * event embeddings → return matching photo IDs with similarity scores.
   * 
   * The selfie is NOT permanently stored.
   */
  async matchSelfie(eventId, sessionId, _selfie) {
    // Simulate the face processing pipeline
    await sleep(3000);
    return {
      matches: MOCK_MATCHES,
      total_found: MOCK_MATCHES.length,
      processing_time_ms: 2847
    };
  },
  /** Get previously computed matches for a session */
  async getMatches(sessionId) {
    await sleep(400);
    return MOCK_MATCHES;
  }
};
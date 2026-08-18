/* ============================================
   Guest Service — mock implementation
   Later: Next.js Route Handlers → Supabase + FastAPI
   ============================================ */

import { MOCK_GUEST_SESSION, MOCK_CONSENT } from '../data/mockData';
import { sleep, generateId } from '@/utils/utils';
export const guestService = {
  /** Create a guest session for an event (no account required) */
  async createSession(eventSlug) {
    await sleep(400);
    const session = {
      ...MOCK_GUEST_SESSION,
      id: generateId(),
      session_token: `session-${generateId()}`,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    return {
      session
    };
  },
  /** Record guest consent before selfie processing */
  async recordConsent(req) {
    await sleep(300);
    return {
      ...MOCK_CONSENT,
      id: generateId(),
      event_id: req.event_id,
      guest_session_id: req.session_id,
      consent_given: req.consent_given,
      created_at: new Date().toISOString()
    };
  },
  /** Validate a session token */
  async validateSession(sessionToken) {
    await sleep(200);
    // Mock: always valid
    return MOCK_GUEST_SESSION;
  }
};
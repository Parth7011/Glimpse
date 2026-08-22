const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://glimpse-201r.onrender.com/api';

export const guestService = {
  /** Create a guest session for an event (no account required) */
  async createSession(eventSlug) {
    const response = await fetch(`${API_URL}/guests/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventSlug })
    });
    if (!response.ok) throw new Error('Failed to create guest session');
    return await response.json();
  },
  
  /** Record guest consent before selfie processing */
  async recordConsent(req) {
    const response = await fetch(`${API_URL}/guests/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!response.ok) throw new Error('Failed to record consent');
    return await response.json();
  },
  
  /** Validate a session token */
  async validateSession(sessionToken) {
    const response = await fetch(`${API_URL}/guests/validate/${sessionToken}`);
    if (!response.ok) throw new Error('Invalid session');
    return await response.json();
  }
};
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://glimpse-201r.onrender.com/api';

export const matchingService = {
  /**
   * Send guest selfie for face matching against event photos.
   */
  async matchSelfie(eventId, sessionId, selfieFile) {
    // In a real implementation with FormData:
    // const formData = new FormData();
    // formData.append('eventId', eventId);
    // formData.append('sessionId', sessionId);
    // formData.append('selfie', selfieFile);
    
    // For now, mocking the payload since we aren't doing real ML upload
    const response = await fetch(`${API_URL}/matches/selfie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, sessionId })
    });
    
    if (!response.ok) throw new Error('Failed to match selfie');
    return await response.json();
  },
  
  /** Get previously computed matches for a session */
  async getMatches(sessionId) {
    const response = await fetch(`${API_URL}/matches/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch matches');
    return await response.json();
  }
};
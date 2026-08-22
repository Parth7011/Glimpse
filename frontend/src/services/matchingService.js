const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const matchingService = {
  async matchSelfie(eventId, sessionId, selfieBase64) {
    const formData = new FormData();
    formData.append('eventId', eventId);
    formData.append('sessionId', sessionId);
    const fetchResponse = await fetch(selfieBase64);
    const blob = await fetchResponse.blob();
    formData.append('selfie', blob, 'selfie.jpg');
    
    const response = await fetch(`${API_URL}/matches/selfie`, { method: 'POST', body: formData });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to match selfie');
    }
    return await response.json();
  },
  async getMatches(sessionId) {
    const response = await fetch(`${API_URL}/matches/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch matches');
    return await response.json();
  }
};

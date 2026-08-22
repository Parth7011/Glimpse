const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://glimpse-201r.onrender.com/api';

export const downloadService = {
  /** Download a single photo by ID */
  async downloadPhoto(photoId, eventId) {
    const response = await fetch(`${API_URL}/downloads/photo/${photoId}`);
    if (!response.ok) throw new Error('Failed to get download URL');
    const data = await response.json();
    return data.url;
  },
  
  /** Request a ZIP of multiple photos */
  async requestZipDownload(photoIds, eventId, sessionId) {
    const response = await fetch(`${API_URL}/downloads/zip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoIds, eventId, sessionId })
    });
    if (!response.ok) throw new Error('Failed to request ZIP download');
    return await response.json();
  },
  
  /** Poll ZIP generation progress */
  async getZipProgress(downloadId) {
    const response = await fetch(`${API_URL}/downloads/zip/${downloadId}`);
    if (!response.ok) throw new Error('Failed to get ZIP progress');
    return await response.json();
  }
};
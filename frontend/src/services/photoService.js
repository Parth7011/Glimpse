const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('glimpse_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const photoService = {
  /** List photos for an event */
  async listPhotos(eventId) {
    const response = await fetch(`${API_URL}/photos/event/${eventId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch photos');
    return await response.json();
  },
  
  /** Upload a photo metadata record to the backend */
  async uploadPhoto(eventId, file) {
    // In a real flow, you'd upload the file to Supabase Storage first,
    // then send the metadata to the backend.
    // Since we're not touching Supabase Storage in this Express-only mode yet,
    // we just send a mock payload representing the uploaded file.
    const payload = {
      filename: file.name,
      storage_path: `/events/${eventId}/originals/${file.name}`,
      size_bytes: file.size,
      width: 4000,
      height: 2667
    };
    
    const response = await fetch(`${API_URL}/photos/event/${eventId}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to upload photo record');
    return await response.json();
  },
  
  /** Get a signed URL for a photo */
  async getSignedUrl(photoId) {
    const response = await fetch(`${API_URL}/photos/${photoId}/url`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch signed URL');
    return await response.json();
  },
  
  /** Get processing progress for an event */
  async getProcessingProgress(eventId) {
    const response = await fetch(`${API_URL}/photos/event/${eventId}/progress`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch progress');
    return await response.json();
  },
  
  /** Trigger processing for an event's photos */
  async triggerProcessing(eventId) {
    const response = await fetch(`${API_URL}/photos/event/${eventId}/process`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to trigger processing');
    return await response.json();
  }
};
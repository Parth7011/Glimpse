const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://glimpse-201r.onrender.com/api';

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
  
  /** Upload a photo file to the backend */
  async uploadPhoto(eventId, file) {
    const formData = new FormData();
    formData.append('photo', file);
    
    // We can also append other metadata if we want, but the backend can read file.name and file.size from multer
    formData.append('width', '4000'); // mock or get real width
    formData.append('height', '2667'); // mock or get real height

    const headers = getAuthHeaders();
    // Remove Content-Type so browser sets it automatically with boundary for multipart/form-data
    delete headers['Content-Type'];

    const response = await fetch(`${API_URL}/photos/event/${eventId}/upload`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    
    if (!response.ok) {
      const err = await response.json().catch(()=>({}));
      throw new Error(err.error || 'Failed to upload photo record');
    }
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
  },

  /** Delete a photo */
  async deletePhoto(photoId) {
    const response = await fetch(`${API_URL}/photos/${photoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete photo');
    }
    
    return response.json();
  }
};
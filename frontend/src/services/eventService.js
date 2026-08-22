const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://glimpse-201r.onrender.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('glimpse_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const eventService = {
  /** List all events for the authenticated photographer */
  async listEvents() {
    const response = await fetch(`${API_URL}/events`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(()=>({}));
      throw new Error(err.error || 'Failed to fetch events');
    }
    return await response.json();
  },
  
  /** Get dashboard stats */
  async getDashboardStats() {
    const response = await fetch(`${API_URL}/events/stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(()=>({}));
      throw new Error(err.error || 'Failed to fetch stats');
    }
    return await response.json();
  },
  
  /** Get a single event by ID */
  async getEvent(eventId) {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(()=>({}));
      throw new Error(err.error || 'Failed to fetch event');
    }
    return await response.json();
  },
  
  /** Get a single event by slug (for guest access - public) */
  async getEventBySlug(slug) {
    const response = await fetch(`${API_URL}/events/slug/${slug}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const err = await response.json().catch(()=>({}));
      throw new Error(err.error || 'Failed to fetch event by slug');
    }
    return await response.json();
  },

  /** Search events by name or slug */
  async searchEvents(query) {
    const response = await fetch(`${API_URL}/events/search?q=${encodeURIComponent(query)}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const err = await response.json().catch(()=>({}));
      throw new Error(err.error || 'Failed to search events');
    }
    return await response.json();
  },
  
  /** Create a new event */
  async createEvent(req) {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(req)
    });
    if (!response.ok) {
      const err = await response.json().catch(()=>({}));
      throw new Error(err.error || 'Failed to create event');
    }
    return await response.json();
  },
  
  /** Update an event */
  async updateEvent(eventId, req) {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(req)
    });
    if (!response.ok) {
      const err = await response.json().catch(()=>({}));
      throw new Error(err.error || 'Failed to update event');
    }
    return await response.json();
  },
  
  /** Get share info for an event */
  async getShareInfo(eventId) {
    const response = await fetch(`${API_URL}/events/${eventId}/share`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(()=>({}));
      throw new Error(err.error || 'Failed to fetch share info');
    }
    return await response.json();
  }
};
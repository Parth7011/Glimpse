const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://glimpse-201r.onrender.com/api';

export const authService = {
  async register(req) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to register');
    }
    
    // Store token
    if (data.session?.access_token) {
      localStorage.setItem('glimpse_token', data.session.access_token);
      localStorage.setItem('glimpse_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  async login(req) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to login');
    }
    
    // Store token
    if (data.session?.access_token) {
      localStorage.setItem('glimpse_token', data.session.access_token);
      localStorage.setItem('glimpse_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  async logout() {
    localStorage.removeItem('glimpse_token');
    localStorage.removeItem('glimpse_user');
  },

  async getMe() {
    const token = localStorage.getItem('glimpse_token');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async updateMe(data) {
    const token = localStorage.getItem('glimpse_token');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update settings');
    }
    
    const result = await response.json();
    
    if (result.user) {
      localStorage.setItem('glimpse_user', JSON.stringify(result.user));
    }
    
    return result;
  },

  async uploadLogo(file) {
    const token = localStorage.getItem('glimpse_token');
    if (!token) throw new Error('No token found');
    
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await fetch(`${API_URL}/auth/me/logo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload logo');
    }
    
    const result = await response.json();
    
    if (result.user) {
      localStorage.setItem('glimpse_user', JSON.stringify(result.user));
    }
    
    return result;
  },

  async getUser() {
    const userStr = localStorage.getItem('glimpse_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('glimpse_token');
  }
};
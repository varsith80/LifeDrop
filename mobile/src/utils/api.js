import { API_BASE_URL } from '../constants';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('hemolink_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('hemolink_token', token);
    } else {
      localStorage.removeItem('hemolink_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.code = data.error;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const offlineError = new Error('Network offline or backend server not responding. Please check your connection.');
        offlineError.isOffline = true;
        throw offlineError;
      }
      throw err;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `${endpoint}?${query}` : endpoint, { method: 'GET' });
  }

  post(endpoint, body = {}) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  put(endpoint, body = {}) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  patch(endpoint, body = {}) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

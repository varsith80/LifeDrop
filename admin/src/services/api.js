const API_BASE = 'http://localhost:5000/api';

class AdminApiClient {
  constructor() {
    this.token = localStorage.getItem('hemolink_admin_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('hemolink_admin_token', token);
    } else {
      localStorage.removeItem('hemolink_admin_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = new Error(data.message || `Request failed with status ${response.status}`);
      err.code = data.error;
      throw err;
    }

    return data;
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `${endpoint}?${query}` : endpoint, { method: 'GET' });
  }

  post(endpoint, body = {}) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  patch(endpoint, body = {}) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  }
}

export const adminApi = new AdminApiClient();

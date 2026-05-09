import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080',
});

// Request interceptor: attach Authorization: Bearer <token>
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: on 401, clear token and redirect to /login
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const api = client;

export const designAPI = {
  getAll: () => api.get('/api/designs'),
  getPublic: () => api.get('/api/designs/public'),
  getById: (id) => api.get(`/api/designs/${id}`),
  create: (data) => api.post('/api/designs', data),
  update: (id, data) => api.put(`/api/designs/${id}`, data),
  updateAccessLevel: (id, level) => api.put(`/api/designs/${id}/access-level?accessLevel=${level}`),
  delete: (id) => api.delete(`/api/designs/${id}`),
  sendToPhone: (phoneNumber, message) => api.post('/api/sms/send', { phoneNumber, message }),
  sendEmail: (email, message) => api.post('/api/email/send', { email, message })
};

export const uploadAPI = {
  upload: (formData) => api.post('/api/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/images/${id}`)
};

export default api;

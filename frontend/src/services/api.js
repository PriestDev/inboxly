import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

export const userService = {
  getUser: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
  updateStatus: (userId, status) => api.patch(`/users/${userId}/status`, { status }),
};

export const chatService = {
  getConversations: () => api.get('/chats'),
  createConversation: (data) => api.post('/chats', data),
  getMessages: (conversationId) => api.get(`/chats/${conversationId}/messages`),
  sendMessage: (conversationId, data) => api.post(`/chats/${conversationId}/messages`, data),
  markAsRead: (conversationId) => api.patch(`/chats/${conversationId}/read`),
};

export default api;

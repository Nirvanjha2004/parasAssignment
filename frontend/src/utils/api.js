import axios from 'axios';

// Create an axios instance with default config
// Update the baseURL to point to the deployed backend
const api = axios.create({
  baseURL: 'https://parasassignment.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Books API
export const booksAPI = {
  getAll: (search) => api.get('/books', { params: { search } }),
  getById: (id) => api.get(`/books/${id}`),
  getByOwner: (ownerId) => api.get(`/books/owner/${ownerId}`),
  create: (bookData) => api.post('/books', bookData),
  update: (id, bookData) => api.patch(`/books/${id}`, bookData),
  delete: (id, ownerId) => api.delete(`/books/${id}`, { data: { ownerId } }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};

export default api;

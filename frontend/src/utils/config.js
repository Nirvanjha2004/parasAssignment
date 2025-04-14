/**
 * Application configuration with environment-specific settings
 */

// Determine if we're running in production by checking the hostname
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname !== 'localhost' && !window.location.hostname.includes('192.168.'));

// API configuration
export const API_BASE_URL = isProduction 
  ? 'https://parasassignment.onrender.com/api'
  : 'http://localhost:5000/api';

export const FRONTEND_URL = isProduction
  ? 'https://shelf-mu.vercel.app'
  : 'http://localhost:3000';

// Helper to construct a full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

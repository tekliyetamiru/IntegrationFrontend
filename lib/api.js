import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://tekliye-toxiguard-api.hf.space',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if:
    // 1. It's a 401 error
    // 2. We're not already on login or signup page
    // 3. We're in the browser
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const publicPages = ['/login', '/signup', '/'];
      const currentPath = window.location.pathname;
      
      if (!publicPages.includes(currentPath)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
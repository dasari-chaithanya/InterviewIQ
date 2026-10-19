import axios from 'axios';
import { setupAuthInterceptors } from './auth.interceptor';

const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // for HttpOnly cookies (refresh token)
});

// Attach interceptors
setupAuthInterceptors(apiClient);

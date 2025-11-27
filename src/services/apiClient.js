import axios from 'axios';

import { API_CONFIG, STORAGE_KEYS } from '../config/constants';
import { logger } from '../utils/logger';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      logger.error('Failed to read auth token from storage', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const unwrap = (response) => {
  if (!response) return null;
  if (response.data && typeof response.data === 'object') {
    return response.data.data ?? response.data;
  }
  return response.data ?? response;
};



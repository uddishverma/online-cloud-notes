import { apiClient, unwrap } from './apiClient';
import { getErrorMessage } from '../utils/helpers';

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return unwrap(response);
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};



/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { STORAGE_KEYS } from '../config/constants';
import { login as loginRequest, fetchCurrentUser } from '../services/authService';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const clearStoredAuth = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      logger.error('Failed to clear auth storage:', error);
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    let isMounted = true;

    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      logger.error('Failed to load user from storage:', error);
    } finally {
      // handled below
    }

    const hydrateProfile = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (storedToken && !storedUser) {
          const profile = await fetchCurrentUser();
          if (profile) {
            setUser(profile);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
          }
        }
      } catch (error) {
        logger.error('Failed to hydrate user profile:', error);
        setUser(null);
        setToken(null);
        clearStoredAuth();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    hydrateProfile();

    return () => {
      isMounted = false;
    };
  }, [clearStoredAuth]);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      } catch (error) {
        logger.error('Failed to save user to storage:', error);
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } catch (error) {
        logger.error('Failed to remove user from storage:', error);
      }
    }
  }, [user]);

  // Persist auth token
  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } catch (error) {
        logger.error('Failed to save token to storage:', error);
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      } catch (error) {
        logger.error('Failed to remove token from storage:', error);
      }
    }
  }, [token]);

  const login = useCallback(
    async ({ username, password }) => {
      try {
        setAuthError(null);
        const result = await loginRequest({
          username: username?.trim(),
          password,
        });
        if (!result?.user || !result?.token) {
          throw new Error('Invalid response from server');
        }
        setUser(result.user);
        setToken(result.token);
        logger.log('User logged in:', result.user);
        return result.user;
      } catch (error) {
        const message = getErrorMessage(error) || 'Login failed';
        setAuthError(message);
        throw new Error(message);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStoredAuth();
    logger.log('User logged out');
  }, [clearStoredAuth]);

  const value = {
    user,
    token,
    login,
    logout,
    authError,
    isAuthenticated: !!(user && token),
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
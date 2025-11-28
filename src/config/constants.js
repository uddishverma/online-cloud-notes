/**
 * Application Constants
 * Centralized configuration and constants
 */

export const API_CONFIG = {
BASE_URL: process.env.REACT_APP_API_URL || 'http://51.20.79.249:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  NOTE_EDITOR: '/note/:id',
  NOTE_EDITOR_BASE: '/note',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
};

export const MESSAGES = {
  ERRORS: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    GENERIC: 'An error occurred. Please try again.',
    NOTE_NOT_FOUND: 'Note not found.',
    FAILED_TO_FETCH: 'Failed to fetch notes. Please try again later.',
    FAILED_TO_SAVE: 'Failed to save note. Please try again.',
    FAILED_TO_DELETE: 'Failed to delete note. Please try again.',
  },
  SUCCESS: {
    NOTE_CREATED: 'Note created successfully!',
    NOTE_UPDATED: 'Note updated successfully!',
    NOTE_DELETED: 'Note deleted successfully!',
  },
  CONFIRMATION: {
    DELETE_NOTE: 'Are you sure you want to delete this note?',
  },
};

export const VALIDATION = {
  NOTE: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    CONTENT_MIN_LENGTH: 1,
    CONTENT_MAX_LENGTH: 10000,
  },
};

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  AUTO_SAVE: 1000,
};




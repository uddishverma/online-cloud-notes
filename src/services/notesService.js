/**
 * Notes Service
 * Handles all API calls related to notes
 */

import { MESSAGES } from '../config/constants';
import { apiClient, unwrap } from './apiClient';
import { getErrorMessage } from '../utils/helpers';

/**
 * Get all notes
 * @returns {Promise<Array>} Array of notes
 */
export const getNotes = async () => {
  try {
    const response = await apiClient.get('/notes');
    return unwrap(response) || [];
  } catch (error) {
    const errorMessage = getErrorMessage(error) || MESSAGES.ERRORS.FAILED_TO_FETCH;
    throw new Error(errorMessage);
  }
};

/**
 * Get a single note by ID
 * @param {number} id - Note ID
 * @returns {Promise<Object>} Note object
 */
export const getNoteById = async (id) => {
  try {
    const response = await apiClient.get(`/notes/${id}`);
    const note = unwrap(response);
    if (!note) {
      throw new Error(MESSAGES.ERRORS.NOTE_NOT_FOUND);
    }
    return note;
  } catch (error) {
    const errorMessage = getErrorMessage(error) || MESSAGES.ERRORS.NOTE_NOT_FOUND;
    throw new Error(errorMessage);
  }
};

/**
 * Create a new note
 * @param {Object} note - Note data
 * @returns {Promise<Object>} Created note
 */
export const createNote = async (note) => {
  try {
    const response = await apiClient.post('/notes', note);
    return unwrap(response);
  } catch (error) {
    const errorMessage = getErrorMessage(error) || MESSAGES.ERRORS.FAILED_TO_SAVE;
    throw new Error(errorMessage);
  }
};

/**
 * Update an existing note
 * @param {number} id - Note ID
 * @param {Object} noteUpdate - Updated note data
 * @returns {Promise<Object>} Updated note
 */
export const updateNote = async (id, noteUpdate) => {
  try {
    const response = await apiClient.put(`/notes/${id}`, noteUpdate);
    return unwrap(response);
  } catch (error) {
    const errorMessage = getErrorMessage(error) || MESSAGES.ERRORS.FAILED_TO_SAVE;
    throw new Error(errorMessage);
  }
};

/**
 * Delete a note
 * @param {number} id - Note ID
 * @returns {Promise<void>}
 */
export const deleteNote = async (id) => {
  try {
    await apiClient.delete(`/notes/${id}`);
  } catch (error) {
    const errorMessage = getErrorMessage(error) || MESSAGES.ERRORS.FAILED_TO_DELETE;
    throw new Error(errorMessage);
  }
};
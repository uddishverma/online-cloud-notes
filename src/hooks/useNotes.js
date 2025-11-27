/**
 * Custom Hook for Notes Management
 * Encapsulates notes-related state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/notesService';
import { logger } from '../utils/logger';
import { MESSAGES } from '../config/constants';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotes();
      setNotes(data || []);
    } catch (err) {
      const errorMessage = MESSAGES.ERRORS.FAILED_TO_FETCH;
      setError(errorMessage);
      logger.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = useCallback(async (noteData) => {
    try {
      setError(null);
      const newNote = await createNote(noteData);
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      const errorMessage = MESSAGES.ERRORS.FAILED_TO_SAVE;
      setError(errorMessage);
      logger.error('Failed to create note:', err);
      throw err;
    }
  }, []);

  const handleUpdateNote = useCallback(async (id, noteData) => {
    try {
      setError(null);
      const updatedNote = await updateNote(id, noteData);
      setNotes((prev) => prev.map((note) => (note.id === id ? updatedNote : note)));
      return updatedNote;
    } catch (err) {
      const errorMessage = MESSAGES.ERRORS.FAILED_TO_SAVE;
      setError(errorMessage);
      logger.error('Failed to update note:', err);
      throw err;
    }
  }, []);

  const handleDeleteNote = useCallback(async (id) => {
    try {
      setError(null);
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      const errorMessage = MESSAGES.ERRORS.FAILED_TO_DELETE;
      setError(errorMessage);
      logger.error('Failed to delete note:', err);
      throw err;
    }
  }, []);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote: handleCreateNote,
    updateNote: handleUpdateNote,
    deleteNote: handleDeleteNote,
  };
};




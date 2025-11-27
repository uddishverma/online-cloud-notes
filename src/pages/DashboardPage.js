/**
 * Dashboard Page Component
 * Main page displaying all notes and note management functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import NoteForm from '../components/notes/NoteForm';
import NoteList from '../components/notes/NoteList';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../hooks/useNotes';
import { ROUTES, MESSAGES } from '../config/constants';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notes, loading, error, createNote, updateNote, deleteNote, fetchNotes } = useNotes();
  const [editingNote, setEditingNote] = useState(null);

  // Optimized mouse movement effect with throttling
  useEffect(() => {
    let rafId = null;
    let lastX = 50;
    let lastY = 50;

    const handleMouseMove = (e) => {
      if (rafId) return; // Skip if already scheduled

      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        // Only update if change is significant (reduces repaints)
        if (Math.abs(x - lastX) > 1 || Math.abs(y - lastY) > 1) {
          document.documentElement.style.setProperty('--mouse-x', `${x}%`);
          document.documentElement.style.setProperty('--mouse-y', `${y}%`);
          lastX = x;
          lastY = y;
        }
        
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSaveNote = useCallback(
    async (note) => {
      try {
        if (note.id) {
          await updateNote(note.id, note);
          setEditingNote(null);
        } else {
          await createNote(note);
        }
      } catch (err) {
        // Error is handled by useNotes hook
      }
    },
    [createNote, updateNote]
  );

  const handleDeleteNote = useCallback(
    async (id) => {
      if (!window.confirm(MESSAGES.CONFIRMATION.DELETE_NOTE)) {
        return;
      }
      try {
        await deleteNote(id);
      } catch (err) {
        // Error is handled by useNotes hook
      }
    },
    [deleteNote]
  );

  const handleEditNote = useCallback((id) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setEditingNote(note);
    }
  }, [notes]);

  const handleCancelEdit = useCallback(() => {
    setEditingNote(null);
  }, []);

  const handleViewNote = useCallback(
    (id) => {
      navigate(`${ROUTES.NOTE_EDITOR_BASE}/${id}`);
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.LOGIN);
  }, [logout, navigate]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>My Notes</h1>
        <div className="dashboard-actions">
          <div className="welcome-message">Welcome, {user?.name || 'User'}!</div>
          <button onClick={handleLogout} className="logout-button" aria-label="Logout">
            Logout
          </button>
        </div>
      </header>

      {error && <ErrorMessage message={error} onDismiss={() => fetchNotes()} />}

      <NoteForm noteToEdit={editingNote} onSave={handleSaveNote} onCancel={handleCancelEdit} />

      {loading ? (
        <LoadingSpinner message="Loading notes..." />
      ) : (
        <NoteList notes={notes} onDelete={handleDeleteNote} onEdit={handleEditNote} onView={handleViewNote} />
      )}
    </div>
  );
};

export default DashboardPage;
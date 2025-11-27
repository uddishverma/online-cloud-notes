/**
 * Note List Component
 * Displays a list of notes
 */

import React from 'react';
import PropTypes from 'prop-types';
import Note from './Note';
import './NoteList.css';

const NoteList = ({ notes, onDelete, onEdit, onView }) => {
  if (!Array.isArray(notes)) {
    return null;
  }

  if (notes.length === 0) {
    return (
      <div className="no-notes" role="status" aria-live="polite">
        <p>No notes yet.</p>
        <p>Create your first note using the form above!</p>
      </div>
    );
  }

  return (
    <div className="note-list" role="list">
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      ))}
    </div>
  );
};

NoteList.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onView: PropTypes.func,
};

export default NoteList;
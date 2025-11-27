/**
 * Note Component
 * Displays a single note card
 */

import React from 'react';
import PropTypes from 'prop-types';
import { truncateText } from '../../utils/helpers';
import './Note.css';

const Note = ({ note, onDelete, onEdit, onView }) => {
  if (!note) {
    return null;
  }

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(note.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(note.id);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(note.id);
    }
  };

  const truncatedContent = truncateText(note.content, 150);

  return (
    <article className="note" onClick={handleView} role="button" tabIndex={0} aria-label={`Note: ${note.title}`}>
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
      </div>
      <div className="note-content">
        <p>{truncatedContent}</p>
        {note.content.length > 150 && (
          <span className="note-more-indicator">... (click to view more)</span>
        )}
      </div>
      <div className="note-actions" onClick={(e) => e.stopPropagation()}>
        {onView && (
          <button
            className="note-action-button note-view-button"
            onClick={handleView}
            aria-label={`View note: ${note.title}`}
          >
            View
          </button>
        )}
        {onEdit && (
          <button
            className="note-action-button note-edit-button"
            onClick={handleEdit}
            aria-label={`Edit note: ${note.title}`}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="note-action-button note-delete-button"
            onClick={handleDelete}
            aria-label={`Delete note: ${note.title}`}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

Note.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onView: PropTypes.func,
};

export default Note;
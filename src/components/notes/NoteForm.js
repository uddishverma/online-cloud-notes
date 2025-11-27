/**
 * Note Form Component
 * Handles creating and editing notes
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateNote } from '../../utils/helpers';
import { VALIDATION } from '../../config/constants';
import './NoteForm.css';

const NoteForm = ({ noteToEdit, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || '');
      setContent(noteToEdit.content || '');
    } else {
      setTitle('');
      setContent('');
    }
    setErrors({});
  }, [noteToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const noteData = {
      id: noteToEdit ? noteToEdit.id : null,
      title: title.trim(),
      content: content.trim(),
    };

    const validation = validateNote(noteData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(noteData);
      if (!noteToEdit) {
        setTitle('');
        setContent('');
      }
    } catch (error) {
      // Error handling is done by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="note-form-container">
      <form onSubmit={handleSubmit} className="note-form" noValidate>
        <h2>{noteToEdit ? 'Edit Note' : 'Create New Note'}</h2>
        
        <div className="form-field">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            maxLength={VALIDATION.NOTE.TITLE_MAX_LENGTH}
            disabled={isSubmitting}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <span id="title-error" className="field-error" role="alert">
              {errors.title}
            </span>
          )}
          <span className="character-count">
            {title.length}/{VALIDATION.NOTE.TITLE_MAX_LENGTH}
          </span>
        </div>

        <div className="form-field">
          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            placeholder="Enter note content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errors.content) setErrors((prev) => ({ ...prev, content: null }));
            }}
            maxLength={VALIDATION.NOTE.CONTENT_MAX_LENGTH}
            disabled={isSubmitting}
            rows={8}
            aria-invalid={!!errors.content}
            aria-describedby={errors.content ? 'content-error' : undefined}
          />
          {errors.content && (
            <span id="content-error" className="field-error" role="alert">
              {errors.content}
            </span>
          )}
          <span className="character-count">
            {content.length}/{VALIDATION.NOTE.CONTENT_MAX_LENGTH}
          </span>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
            {isSubmitting ? 'Saving...' : noteToEdit ? 'Update Note' : 'Create Note'}
          </button>
          {onCancel && (
            <button type="button" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

NoteForm.propTypes = {
  noteToEdit: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default NoteForm;
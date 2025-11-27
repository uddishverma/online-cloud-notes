import React from 'react';
import { useParams } from 'react-router-dom';

const NoteEditorPage = () => {
  const { id } = useParams();
  
  return (
    <div className="note-editor-page">
      <h2>Note Editor</h2>
      <p>Editing note with ID: {id}</p>
      {/* Note editor form will go here */}
    </div>
  );
};

export default NoteEditorPage;
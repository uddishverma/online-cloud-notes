/**
 * Error Message Component
 * Displays error messages in a consistent format
 */

import PropTypes from 'prop-types';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-message-component" role="alert">
      <div className="error-message-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{message}</span>
        {onDismiss && (
          <button
            className="error-dismiss-button"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onDismiss: PropTypes.func,
};

export default ErrorMessage;




/**
 * Logger Utility
 * Centralized logging with environment-aware behavior
 */

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  log(...args) {
    if (isDevelopment) {
      console.log(...args);
    }
  }

  error(...args) {
    console.error(...args);
  }

  warn(...args) {
    if (isDevelopment) {
      console.warn(...args);
    }
  }

  info(...args) {
    if (isDevelopment) {
      console.info(...args);
    }
  }

  debug(...args) {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
}

export const logger = new Logger();
export default logger;




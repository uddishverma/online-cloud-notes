/**
 * Main App Component
 * Root component that sets up routing and authentication
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NoteEditorPage from './pages/NoteEditorPage';
import { ROUTES } from './config/constants';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.NOTE_EDITOR}
                element={
                  <ProtectedRoute>
                    <NoteEditorPage />
                  </ProtectedRoute>
                }
              />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
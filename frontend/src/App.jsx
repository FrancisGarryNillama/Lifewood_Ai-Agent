import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common';
import { AuthProvider, NotificationProvider } from './context';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { StudentDocumentPage } from './pages/student';
import {
  DocumentPage,
  FinalDocumentPage,
  RequestPage,
} from './pages/faculty';

function AppContent() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected Combined Dashboard */}
      <Route
        path="/Dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Document and Request Routes */}
      <Route
        path="/student/finalDocument/:id"
        element={
          <ProtectedRoute>
            <StudentDocumentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request/:id"
        element={
          <ProtectedRoute>
            <RequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/document/:id"
        element={
          <ProtectedRoute>
            <DocumentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finalDocument/:id"
        element={
          <ProtectedRoute>
            <FinalDocumentPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
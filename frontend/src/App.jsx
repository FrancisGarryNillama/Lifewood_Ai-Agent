import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common';
import { AuthProvider, NotificationProvider } from './context';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { EmployeeDocumentPage } from './pages/employee';
import {
  AdminDocumentReviewPage,
  AdminFinalizedReportsPage,
  AdminRequestReviewPage,
} from './pages/admin';

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
      <Route
        path="/Dashboard/:folderSlug"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Document and Request Routes */}
      <Route
        path="/employee/finalDocument/:id"
        element={
          <ProtectedRoute>
            <EmployeeDocumentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request/:id"
        element={
          <ProtectedRoute>
            <AdminRequestReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/document/:id"
        element={
          <ProtectedRoute>
            <AdminDocumentReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finalDocument/:id"
        element={
          <ProtectedRoute>
            <AdminFinalizedReportsPage />
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

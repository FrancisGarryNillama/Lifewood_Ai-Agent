import React from 'react';

/**
 * ProtectedRoute - Bypass for exploration
 */
export function ProtectedRoute({ children }) {
  // BYPASS AUTHENTICATION: Allow free exploration of all pages
  return <>{children}</>;
}

/**
 * StudentRoute - Bypass for exploration
 */
export function StudentRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

/**
 * FacultyRoute - Bypass for exploration
 */
export function FacultyRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

/**
 * AuthenticatedRoute - Bypass for exploration
 */
export function AuthenticatedRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default ProtectedRoute;

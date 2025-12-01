import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Protects routes that require authentication.
 * - Shows loading spinner while checking auth state
 * - Redirects to /login if not authenticated
 * - For admin routes, also checks admin status and redirects with error if not admin
 * 
 * @param {React.ReactNode} children - The component to render if authenticated
 * @param {boolean} requireAdmin - Whether this route requires admin privileges
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin and user is not admin, redirect to dashboard
  if (requireAdmin && (!user || !user.isAdmin)) {
    // Store error message in sessionStorage for toast notification
    sessionStorage.setItem('authError', 'You do not have permission to access this page.');
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated (and admin if required)
  return <>{children}</>;
};

export default ProtectedRoute;


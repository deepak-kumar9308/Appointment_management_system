import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to the landing page
    return <Navigate to="/" replace />;
  }

  return children;
}

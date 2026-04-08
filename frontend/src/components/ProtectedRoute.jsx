import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  
  // Role-Based Access Control logic (RBAC)
  if (!allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to the landing page
    return <Navigate to="/" replace />;
  }

  return children;
}

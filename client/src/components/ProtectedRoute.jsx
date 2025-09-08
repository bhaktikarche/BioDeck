// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function safeParseUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return { name: String(raw), role: null, id: null };
  }
}

export default function ProtectedRoute({ children, role }){
  const token = localStorage.getItem('token');
  const user = safeParseUser();
  if (!token || !user) return <Navigate to="/login" />;
  if (role && user.role && user.role !== role) return <Navigate to="/" />;
  // If role is required but user.role is missing (malformed), redirect to login
  if (role && !user.role) return <Navigate to="/login" />;
  return children;
}

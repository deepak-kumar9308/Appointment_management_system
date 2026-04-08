import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import DiscoveryDashboard from './components/DiscoveryDashboard';
import Registration from './components/Registration';
import AdminLayout from './components/AdminLayout';
import PatientTimeline from './components/PatientTimeline';

import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global Toast Provider */}
        <Toaster position="top-right" toastOptions={{
          style: {
             borderRadius: '10px',
             background: '#333',
             color: '#fff',
          }
        }} />

        <Routes>
          <Route path="/" element={<DiscoveryDashboard />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/appointments" element={
            <ProtectedRoute allowedRoles={['Patient', 'patient', 'Doctor', 'doctor']}>
               <PatientTimeline />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Doctor', 'doctor']}>
               <AdminLayout onSwitchToPatientView={() => {}} />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;

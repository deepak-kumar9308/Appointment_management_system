import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import './DiscoveryDashboard.css';

export default function DiscoveryDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch Global Dynamic Doctor Roster
  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ['doctorsRoster'],
    queryFn: async () => {
       const { data } = await axios.get('/api/doctors/');
       return data.data; 
    }
  });

  const handleBookClick = (docId) => {
      if (user.role === 'guest') {
         navigate('/login');
      } else {
         setSelectedDoctorId(docId);
         setIsModalOpen(true);
      }
  };

  return (
    <div className="discovery-container">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="nav-brand">Doc<span style={{ color: '#2563eb' }}>Panel</span></div>
        <div className="nav-links">
          {user.role === 'guest' ? (
            <>
              <button className="nav-btn" onClick={() => navigate('/register')}>Register / Login</button>
            </>
          ) : (
            <div className="user-menu">
               <span className="welcome-text">Welcome, {user.name}</span>
               
               {user.role === 'patient' || user.role === 'Patient' ? (
                 <button className="nav-btn outline" onClick={() => navigate('/appointments')}>
                   <Calendar size={16} /> My Appointments
                 </button>
               ) : null}

               {user.role === 'doctor' || user.role === 'Doctor' ? (
                 <button className="nav-btn outline" onClick={() => navigate('/admin')}>
                   Doctor Panel
                 </button>
               ) : null}

               <button className="icon-btn logout" onClick={logout}><LogOut size={18} /></button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="hero-section">
        <div className="hero-text">
            <h1>Find and book the <span className="highlight">best doctors</span> near you.</h1>
            <p>Seamlessly discover top-rated specialists, view verified availability, and secure your appointment instantly.</p>
        </div>

        <div className="roster-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
            {isLoading ? (
               <p style={{color: '#64748b'}}>Loading available specialists...</p>
            ) : isError ? (
               <p style={{color: '#ef4444'}}>Failed to load doctors roster from MongoDB.</p>
            ) : doctors.length === 0 ? (
               <p style={{color: '#64748b'}}>No doctors are currently registered in the database. Please register a Doctor account!</p>
            ) : (
               doctors.map(doc => (
                 <div className="doctor-card" key={doc._id}>
                   <div className="doc-avatar">
                      <h2 style={{color: '#fff', margin: 0}}>{doc.user?.name ? doc.user.name.charAt(0).toUpperCase() : 'D'}</h2>
                   </div>
                   <div className="doc-info" style={{ textAlign: 'left' }}>
                     <h3>{doc.user ? doc.user.name : "Unknown Practitioner"}</h3>
                     <p className="specialty">{doc.specialization || "General Practitioner"}</p>
                     <p className="fee">${doc.fee || 100} / Consultation</p>
                   </div>
                   <button 
                     className="btn-book" 
                     onClick={() => handleBookClick(doc.user._id)}
                   >
                     View Availability
                   </button>
                </div>
               ))
            )}
        </div>
      </main>

      {isModalOpen && selectedDoctorId && (
        <BookingModal 
          doctorId={selectedDoctorId} 
          patientId={user.id}
          onClose={() => {
             setIsModalOpen(false);
             setSelectedDoctorId(null);
          }} 
        />
      )}
    </div>
  );
}

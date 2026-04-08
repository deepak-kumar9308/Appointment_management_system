import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LayoutDashboard, Calendar, Settings, LogOut, Bell, User } from 'lucide-react';
import StatsHeader from './StatsHeader';
import AppointmentsTable from './AppointmentsTable';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SettingsView from './SettingsView';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchAppointments = async () => {
      // Dynamic Fetch relying on the exact logged in Doctor's ID
      const { data } = await axios.get(`/api/appointments?doctorId=${user.id}`);
      return data.data; 
  };

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['appointments', user.id],
    queryFn: fetchAppointments
  });

  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'pending').length;
  const today = appointments.filter(a => {
      const d = new Date(a.startTime);
      return new Date().toDateString() === d.toDateString();
  }).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>DocPanel</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={20} /> Schedule
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
             <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="topbar">
          <div className="topbar-welcome">
            <h1>Welcome back, Dr. {user.name}</h1>
            <p>Here is what's happening with your clinic today.</p>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="avatar">
               {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} color="#fff" />}
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="dashboard-body">
          {activeTab === 'dashboard' && (
            <>
              <StatsHeader total={total} pending={pending} today={today} />
              
              <div className="table-section">
                <div className="section-header">
                  <h2>Recent Appointment Requests</h2>
                </div>
                
                {isLoading ? (
                   <div className="skeleton-table">Loading secure records...</div>
                ) : isError ? (
                   <div className="error-message">Error fetching records from MongoDB.</div>
                ) : appointments.length === 0 ? (
                   <div className="empty-message" style={{padding: '20px', color: '#64748b'}}>No appointments scheduled yet.</div>
                ) : (
                   <AppointmentsTable data={appointments} />
                )}
              </div>
            </>
          )}

          {activeTab === 'schedule' && (
            <div className="tab-placeholder">
               <h2>Configure Availability</h2>
               <div className="settings-card">
                  <p>Define the hours you are open for consultations. This will automatically sync to your Patient Booking Modal.</p>
                  <label>Working Hours</label>
                  <input type="text" placeholder="e.g. 09:00 - 17:00" className="cool-input" />
                  <button className="btn-modern">Save Schedule</button>
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsView user={user} />
          )}
        </div>
      </main>
    </div>
  );
}

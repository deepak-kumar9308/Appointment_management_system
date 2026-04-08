import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LayoutDashboard, Calendar, Settings, LogOut, Bell, User, Activity, Stethoscope } from 'lucide-react';
import StatsHeader from './StatsHeader';
import AppointmentsTable from './AppointmentsTable';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SettingsView from './SettingsView';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchAppointments = async () => {
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-10 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
           <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center p-1.5 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg text-white group-hover:shadow-md transition-all">
                <Stethoscope size={16} className="absolute -left-1 opacity-50" />
                <Activity size={20} className="z-10" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800">
                Medi<span className="text-medical-blue">Pulse</span> Admin
              </span>
           </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-medical-blue text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'schedule' ? 'bg-medical-blue text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={20} /> Schedule
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-medical-blue text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors" onClick={handleLogout}>
             <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        {/* Top Navbar */}
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, Dr. {user?.name}</h1>
            <p className="text-slate-500 mt-1">Here is what's happening with your clinic today.</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-medical-blue transition-colors">
               <Bell size={24} />
               {pending > 0 && (
                 <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
               )}
            </button>
            <div className="h-10 w-10 bg-medical-blue rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
               {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div>
          {activeTab === 'dashboard' && (
            <>
              <StatsHeader total={total} pending={pending} today={today} />
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-xl font-bold text-slate-800">Recent Appointment Requests</h2>
                </div>
                
                {isLoading ? (
                   <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-medical-blue"></div></div>
                ) : isError ? (
                   <div className="p-6 text-red-500 text-center">Error fetching records from Database.</div>
                ) : appointments.length === 0 ? (
                   <div className="p-10 text-center text-slate-500">No appointments scheduled yet.</div>
                ) : (
                   <AppointmentsTable data={appointments} />
                )}
              </div>
            </>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
               <h2 className="text-xl font-bold text-slate-800 mb-2">Configure Availability</h2>
               <p className="text-slate-500 mb-6">Define the hours you are open for consultations. This will automatically sync to your Patient Booking Modal.</p>
               <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Working Hours</label>
                    <input type="text" placeholder="e.g. 09:00 - 17:00" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all" />
                  </div>
                  <button className="bg-medical-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm">Save Schedule</button>
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
               <h2 className="text-xl font-bold text-slate-800 mb-6">Account Settings</h2>
               <SettingsView user={user} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

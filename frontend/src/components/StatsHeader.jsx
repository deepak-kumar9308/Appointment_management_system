import React from 'react';
import { Users, Clock, CalendarRange } from 'lucide-react';
import './AdminLayout.css';

export default function StatsHeader({ total, pending, today }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon blue">
          <CalendarRange size={24} color="#2563eb" />
        </div>
        <div className="stat-info">
          <p>Total Appointments</p>
          <h3>{total}</h3>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon orange">
          <Clock size={24} color="#f97316" />
        </div>
        <div className="stat-info">
          <p>Pending Requests</p>
          <h3>{pending}</h3>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon green">
          <Users size={24} color="#10b981" />
        </div>
        <div className="stat-info">
          <p>Today's Schedule</p>
          <h3>{today}</h3>
        </div>
      </div>
    </div>
  );
}

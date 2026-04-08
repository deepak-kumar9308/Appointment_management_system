import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PatientTimeline.css';

export default function PatientTimeline() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['my-appointments', user.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/appointments/me?patientId=${user.id}`);
      return data.data;
    }
  });

  const upcoming = appointments.filter(a => new Date(a.startTime) > new Date() && a.status !== 'cancelled');
  const history = appointments.filter(a => new Date(a.startTime) <= new Date() || a.status === 'cancelled');

  const renderCard = (app) => {
     const isPast = new Date(app.startTime) <= new Date();
     return (
       <div key={app._id} className={`timeline-card ${isPast ? 'past' : ''}`}>
          <div className="time-badge">
             <CalendarIcon size={16} />
             {format(new Date(app.startTime), 'MMM d, yyyy - h:mm a')}
          </div>
          <div className="card-body">
             <div className="doc-detail">
               <h4>{app.doctor?.name || "Doctor"}</h4>
               <p>{app.doctor?.specialization || "Specialist"}</p>
             </div>
             <div className={`status-pill ${app.status}`}>
               {app.status === 'approved' && <CheckCircle2 size={14}/>}
               {app.status === 'pending' && <Clock size={14}/>}
               {app.status === 'rejected' && <XCircle size={14}/>}
               {app.status.toUpperCase()}
             </div>
          </div>
          <div className="card-footer">
             <p><strong>Reason:</strong> {app.reason}</p>
          </div>
       </div>
     );
  };

  return (
    <div className="timeline-container">
      <header className="timeline-header">
         <button className="back-btn" onClick={() => navigate('/')}>
             <ArrowLeft size={18} /> Back to Dashboard
         </button>
         <h1>My Appointments</h1>
         <p>Track your upcoming visits and medical history.</p>
      </header>
      
      {isLoading ? (
        <div className="skeleton-timeline">Loading your secure history...</div>
      ) : isError ? (
        <div className="error-timeline">Failed to fetch data.</div>
      ) : (
        <div className="timeline-content">
           <section className="timeline-section">
              <h2><Clock size={20} color="#2563eb" /> Upcoming Visits</h2>
              <div className="timeline-list">
                 {upcoming.length > 0 ? upcoming.map(renderCard) : <div className="empty-state">No upcoming appointments.</div>}
              </div>
           </section>

           <section className="timeline-section">
              <h2><CheckCircle2 size={20} color="#64748b" /> Past History</h2>
              <div className="timeline-list">
                 {history.length > 0 ? history.map(renderCard) : <div className="empty-state">No historical appointments.</div>}
              </div>
           </section>
        </div>
      )}
    </div>
  );
}

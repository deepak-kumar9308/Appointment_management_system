import React from 'react';
import { Users, Clock, CalendarRange } from 'lucide-react';

export default function StatsHeader({ total, pending, today }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="bg-blue-50 p-4 rounded-xl shrink-0">
          <CalendarRange size={28} className="text-medical-blue" />
        </div>
        <div>
          <p className="text-slate-500 font-medium text-sm">Total Appointments</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{total}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="bg-amber-50 p-4 rounded-xl shrink-0">
          <Clock size={28} className="text-amber-500" />
        </div>
        <div>
          <p className="text-slate-500 font-medium text-sm">Pending Requests</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{pending}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="bg-medical-teal/10 p-4 rounded-xl shrink-0">
          <Users size={28} className="text-medical-teal" />
        </div>
        <div>
          <p className="text-slate-500 font-medium text-sm">Today's Schedule</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{today}</h3>
        </div>
      </div>
    </div>
  );
}

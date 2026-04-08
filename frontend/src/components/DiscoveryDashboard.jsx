import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Star, BadgeCheck } from 'lucide-react';
import Navbar from './Navbar';
import Hero from './Hero';

export default function DiscoveryDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />

      {/* Discovery Grid */}
      <section id="discovery-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Expert Doctors</h2>
          <p className="mt-4 text-xl text-slate-500">Select a specialist and book your slot instantly.</p>
        </div>

        {isLoading ? (
           <div className="flex justify-center items-center h-48">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
           </div>
        ) : isError ? (
           <p className="text-center text-red-500 bg-red-50 p-4 rounded-lg font-medium mx-auto max-w-2xl border border-red-100">Failed to load doctors roster from database.</p>
        ) : doctors.length === 0 ? (
           <p className="text-center text-slate-500 bg-white p-8 rounded-xl shadow-sm border border-slate-100 mx-auto max-w-2xl">No doctors are currently registered in the database. Please register a Doctor account!</p>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {doctors.map(doc => (
               <div key={doc._id} className="relative group bg-white/70 backdrop-blur-md border border-white/40 shadow-xl shadow-slate-200/50 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-medical-blue/10 transition-all duration-300">
                 
                 <div className="flex items-start justify-between">
                   <div className="flex gap-4 items-center">
                     <div className="h-16 w-16 rounded-full bg-gradient-to-br from-medical-teal/20 to-medical-blue/20 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden shrink-0">
                       <span className="text-xl font-bold text-medical-blue">
                         {doc.user?.name ? doc.user.name.charAt(0).toUpperCase() : 'D'}
                       </span>
                     </div>
                     <div>
                       <h3 className="font-bold text-lg text-slate-900 flex items-center gap-1">
                         {doc.user ? doc.user.name : "Unknown Practitioner"}
                         <BadgeCheck size={18} className="text-medical-blue shrink-0" />
                       </h3>
                       <p className="text-medical-teal font-medium text-sm">{doc.specialization || "General Practitioner"}</p>
                     </div>
                   </div>
                 </div>

                 <div className="mt-6 flex items-center gap-1">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={16} className={`${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                   ))}
                   <span className="text-slate-500 text-sm ml-2 font-medium">4.8 (120 reviews)</span>
                 </div>

                 <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                   <div className="font-semibold text-slate-700">
                     ${doc.fee || 100} <span className="text-xs text-slate-500 font-normal">/ consult</span>
                   </div>
                   <button 
                     onClick={() => handleBookClick(doc.user?._id)}
                     className="bg-slate-900 hover:bg-medical-blue text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                   >
                     Book Slot
                   </button>
                 </div>
               </div>
             ))}
           </div>
        )}
      </section>

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

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SettingsView({ user }) {
  const queryClient = useQueryClient();
  
  const [specialization, setSpecialization] = useState('');
  const [fee, setFee] = useState('');

  // Fetch initial profile values dynamically from database
  const { data: profile, isLoading } = useQuery({
    queryKey: ['doctorProfile', user.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/doctors/profile/${user.id}`);
      return data.data;
    }
  });

  // Populate localized form state once data responds from database
  useEffect(() => {
    if (profile) {
      setSpecialization(profile.specialization || '');
      setFee(profile.fee || '');
    }
  }, [profile]);

  // Establish mutation to patch profile logic
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.patch('/api/doctors/profile', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Profile Settings Saved!');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile', user.id] });
      queryClient.invalidateQueries({ queryKey: ['doctorsRoster'] }); // Force Patient dashboards to reflect new data
    },
    onError: () => {
      toast.error('Failed to update profile settings.');
    }
  });

  const handleSubmit = () => {
      if (!specialization || !fee) {
          return toast.error("Please fill in both fields");
      }
      mutation.mutate({ doctorId: user.id, specialization, fee: Number(fee) });
  };

  return (
    <div className="tab-placeholder">
       <h2>Profile Configuration</h2>
       
       {isLoading ? (
           <p style={{ color: '#64748b' }}>Pulling your current profile from the database...</p>
       ) : (
           <div className="settings-card">
              <p>Configure your visible attributes. Modifications save instantly to the Patient Directory.</p>
              
              <label>Full Name</label>
              <input type="text" value={`Dr. ${user.name}`} disabled className="cool-input" style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}/>
              
              <label>Specialization</label>
              <input 
                 type="text" 
                 placeholder="e.g. Cardiologist" 
                 className="cool-input" 
                 value={specialization}
                 onChange={(e) => setSpecialization(e.target.value)}
              />
              
              <label>Consultation Fee ($)</label>
              <input 
                 type="number" 
                 placeholder="150" 
                 className="cool-input" 
                 value={fee}
                 onChange={(e) => setFee(e.target.value)}
              />
              
              <button 
                 className="btn-modern" 
                 onClick={handleSubmit} 
                 disabled={mutation.isPending}
              >
                  {mutation.isPending ? 'Updating...' : 'Update Profile'}
              </button>
           </div>
       )}
    </div>
  );
}

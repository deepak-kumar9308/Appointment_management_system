import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Stethoscope, DollarSign, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function SettingsView({ user }) {
  const queryClient = useQueryClient();

  const [specialization, setSpecialization] = useState('');
  const [fee, setFee] = useState('');

  // Fetch current doctor profile from database
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['doctorProfile', user?.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/doctors/profile/${user?.id}`);
      return data.data;
    },
    enabled: !!user?.id,
  });

  // Populate form once data loads
  useEffect(() => {
    if (profile) {
      setSpecialization(profile.specialization || '');
      setFee(profile.fee || '');
    }
  }, [profile]);

  // Save mutation
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.patch('/api/doctors/profile', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['doctorProfile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['doctorsRoster'] });
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!specialization.trim() || !fee) {
      return toast.error('Please fill in all required fields.');
    }
    mutation.mutate({ doctorId: user?.id, specialization: specialization.trim(), fee: Number(fee) });
  };

  // ─── Loading State ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 size={40} className="text-medical-blue animate-spin" />
        <p className="text-slate-500 font-medium">Loading your profile from the database...</p>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="bg-red-50 p-4 rounded-2xl">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-800">Failed to load profile</p>
          <p className="text-slate-500 text-sm mt-1">Could not connect to the database. Please refresh and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">

      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900">Profile Configuration</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Update your public profile. Changes will reflect immediately in the Patient Discovery Dashboard.
        </p>
      </div>

      {/* Doctor Identity Card (Read-Only) */}
      <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 border border-medical-blue/10 rounded-2xl p-5 mb-8 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-medical-blue uppercase tracking-wider mb-0.5">Logged in as</p>
          <h3 className="font-bold text-slate-900 text-lg truncate">Dr. {user?.name}</h3>
          <p className="text-slate-500 text-sm">{user?.email || 'No email on file'}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-100 shrink-0">
          <CheckCircle size={14} />
          Verified
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Full Name (Read-Only) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Full Name <span className="text-slate-400 font-normal">(cannot be changed)</span>
          </label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              value={`Dr. ${user?.name || ''}`}
              disabled
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed text-sm font-medium"
            />
          </div>
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Specialization <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Stethoscope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Cardiologist, Dermatologist, Neurologist..."
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 outline-none transition-all text-slate-800 text-sm placeholder:text-slate-400"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5 ml-1">This shows as your title in the Patient Discovery Dashboard.</p>
        </div>

        {/* Consultation Fee */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Consultation Fee (USD) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              placeholder="e.g. 150"
              min="0"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 outline-none transition-all text-slate-800 text-sm placeholder:text-slate-400"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5 ml-1">Displayed on your Doctor Card. Patients see this before booking.</p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-4" />

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 bg-medical-blue hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>

          {mutation.isSuccess && (
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle size={18} />
              Saved successfully
            </div>
          )}
        </div>

      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, Activity, Stethoscope } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Registration() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Patient'
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/users/register', formData);
      login(formData.role, res.data.data.name, res.data.data._id);
      toast.success('Registration successful! Welcome to MediPulse.');
      if (formData.role === 'Doctor') {
          navigate('/admin');
      } else {
          navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-500 hover:text-medical-blue font-medium mb-6 group transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-medical-teal to-medical-blue p-8 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative flex items-center justify-center p-2 bg-white/20 rounded-lg">
                <Stethoscope size={18} className="absolute -left-1 opacity-60" />
                <Activity size={22} className="z-10" />
              </div>
              <span className="font-bold text-xl tracking-tight">MediPulse</span>
            </div>
            <div className="flex justify-center mb-3">
              <div className="bg-white/20 p-3 rounded-2xl">
                <ShieldCheck size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">Create an Account</h1>
            <p className="text-white/80 text-sm">Join thousands of patients managing their health seamlessly.</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 outline-none transition-all text-slate-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="john@example.com" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 outline-none transition-all text-slate-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 outline-none transition-all text-slate-800 text-sm"
                  />
                </div>
              </div>

              {/* Role Toggle */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Register As</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 outline-none transition-all text-slate-800 text-sm bg-white"
                >
                  <option value="Patient">🧑‍⚕️ Patient</option>
                  <option value="Doctor">👨‍⚕️ Doctor (Admin Access)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-medical-teal hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md mt-2"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-medical-teal font-semibold hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ArrowLeft, Activity, Stethoscope } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/users/login', formData);
      const userData = res.data.data;
      login(userData.role, userData.name, userData._id);
      toast.success('Welcome back!');
      if (userData.role === 'Doctor' || userData.role === 'doctor') {
          navigate('/admin');
      } else {
          navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
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
          <div className="bg-gradient-to-r from-medical-blue to-medical-teal p-8 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative flex items-center justify-center p-2 bg-white/20 rounded-lg">
                <Stethoscope size={18} className="absolute -left-1 opacity-60" />
                <Activity size={22} className="z-10" />
              </div>
              <span className="font-bold text-xl tracking-tight">MediPulse</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
            <p className="text-white/80 text-sm">Log in to manage your appointments and schedule.</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 outline-none transition-all text-slate-800 text-sm"
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
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 outline-none transition-all text-slate-800 text-sm"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-medical-blue hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'} 
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/register')} 
                className="text-medical-blue font-semibold hover:underline"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Registration.css'; // Reusing identical CSS

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
      // POST to backend
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
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
           <LogIn size={48} color="#2563eb" />
           <h1>Welcome Back</h1>
           <p>Log in to manage your appointments and schedule.</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                name="email" 
                placeholder="john@example.com" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="registration-footer">
          <p>Don't have an account? <span onClick={() => navigate('/register')} className="link">Register here</span></p>
        </div>
      </div>
    </div>
  );
}

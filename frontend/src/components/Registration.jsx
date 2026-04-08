import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Registration.css';

export default function Registration() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Patient' // Add mock toggle for demo purposes
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
      const res = await axios.post('/api/users/register', formData);
      
      // We will login globally to mock Auth Context for easy routing testing
      login(formData.role, res.data.data.name, res.data.data._id);
      
      toast.success('Registration successful! Welcome to DocPanel.');
      
      // Redirect based on role
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
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
           <ShieldCheck size={48} color="#2563eb" />
           <h1>Create an Account</h1>
           <p>Join thousands of patients managing their health seamlessly.</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                name="name" 
                placeholder="John Doe" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

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
                minLength={8}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Mock Role Toggle specifically for Demoing RBAC easily */}
          <div className="input-group role-toggle">
            <label>Register As (Demo Purposes)</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor (Admin Access)</option>
            </select>
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="registration-footer">
          <p>Already have an account? <span onClick={() => {
              navigate('/login');
          }} className="link">Log in</span></p>
        </div>
      </div>
    </div>
  );
}

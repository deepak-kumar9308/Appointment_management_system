import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Stethoscope, Menu, X, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center p-2 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg text-white group-hover:shadow-lg transition-all">
                <Stethoscope size={20} className="absolute -left-1 opacity-50" />
                <Activity size={24} className="z-10" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">
                Medi<span className="text-medical-blue">Pulse</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-medical-blue font-medium transition-colors">Home</Link>
            
            {user?.role === 'patient' || user?.role === 'Patient' ? (
              <Link to="/appointments" className="text-slate-600 hover:text-medical-blue font-medium transition-colors">My Appointments</Link>
            ) : null}

            {user?.role === 'doctor' || user?.role === 'Doctor' ? (
              <Link to="/admin" className="text-slate-600 hover:text-medical-blue font-medium transition-colors">Doctor Panel</Link>
            ) : null}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user?.role === 'guest' ? (
              <>
                <Link to="/login" className="text-slate-600 hover:text-medical-blue font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-medical-blue hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow-md">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">Hi, {user?.name}</span>
                <button 
                  onClick={logout} 
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 pb-4 px-4 space-y-3 pt-2">
          <Link to="/" className="block px-3 py-2 text-slate-600 hover:text-medical-blue font-medium rounded-md hover:bg-slate-50">Home</Link>
          
          {user?.role === 'patient' || user?.role === 'Patient' ? (
             <Link to="/appointments" className="block px-3 py-2 text-slate-600 hover:text-medical-blue font-medium rounded-md hover:bg-slate-50">My Appointments</Link>
          ) : null}

          {user?.role === 'doctor' || user?.role === 'Doctor' ? (
             <Link to="/admin" className="block px-3 py-2 text-slate-600 hover:text-medical-blue font-medium rounded-md hover:bg-slate-50">Doctor Panel</Link>
          ) : null}
          
          <div className="h-px bg-gray-100 my-2 mx-3"></div>
          
          {user?.role === 'guest' ? (
            <>
              <Link to="/login" className="block px-3 py-2 text-slate-600 hover:text-medical-blue font-medium rounded-md hover:bg-slate-50">Login</Link>
              <Link to="/register" className="block px-3 py-2 text-medical-blue font-semibold rounded-md hover:bg-blue-50">Sign Up</Link>
            </>
          ) : (
            <button 
              onClick={logout}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-500 font-medium rounded-md hover:bg-red-50"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

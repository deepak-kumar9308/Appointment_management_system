import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Clock, Users } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24">
          
          {/* LEFT: Text Content */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medical-teal/10 text-medical-teal text-sm font-semibold mb-6">
              <Star size={14} className="fill-medical-teal" />
              Top rated clinic in the city
            </span>

            <h1 className="text-5xl lg:text-6xl tracking-tight font-extrabold text-slate-900 leading-tight mb-5">
              Healthcare<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-blue to-medical-teal">
                Simplified.
              </span>
            </h1>

            <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">
              Find and book appointments with verified doctors in minutes. 
              Experience a premium, tailored healthcare journey right at your fingertips.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href="#discovery-grid" 
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-medical-blue hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg shadow-blue-200 hover:shadow-xl transition-all"
              >
                Find a Doctor <ArrowRight size={20} />
              </a>
              <a 
                href="/login" 
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-slate-200 text-slate-700 hover:border-medical-blue hover:text-medical-blue font-semibold rounded-full transition-all"
              >
                Patient Login
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <ShieldCheck size={18} className="text-medical-teal" />
                100% Verified Doctors
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Clock size={18} className="text-medical-blue" />
                Same-Day Appointments
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Users size={18} className="text-purple-500" />
                10,000+ Happy Patients
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Image Panel */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-100/60 aspect-[4/3]">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-medical-blue/20 via-transparent to-medical-teal/20 z-10 pointer-events-none" />
              <img
                className="w-full h-full object-cover object-center"
                src="https://images.unsplash.com/photo-1551076805-e18690c5e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Doctor consulting a patient"
                onError={(e) => {
                  // Fallback to a different image if Unsplash fails
                  e.target.src = "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1200";
                }}
              />
              {/* Floating Card */}
              <div className="absolute bottom-5 left-5 right-5 z-20 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/60">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Next available slot</p>
                    <p className="text-medical-blue font-semibold text-sm">Today at 3:00 PM</p>
                  </div>
                  <a href="#discovery-grid" className="ml-auto bg-medical-blue hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

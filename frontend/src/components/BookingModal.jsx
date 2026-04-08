import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import './BookingModal.css';

const fetchAvailability = async (doctorId, date) => {
  // To avoid failing entirely if backend isn't running yet during dev setup mock it if it fails
  try {
    const { data } = await axios.get(`/api/doctors/${doctorId}/availability?date=${date}`);
    return data.slots;
  } catch (error) {
    if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
      console.warn("Backend not providing real slots, using mock slots");
      // Simulate real slots fetch
      return [
        { time: '09:00 AM', isBooked: false },
        { time: '09:30 AM', isBooked: true },
        { time: '10:00 AM', isBooked: false },
        { time: '10:30 AM', isBooked: false },
        { time: '11:00 AM', isBooked: true },
        { time: '11:30 AM', isBooked: false }
      ];
    }
    throw error;
  }
};

const bookAppointment = async (payload) => {
  const { data } = await axios.post('/api/appointments/book', payload);
  return data;
};

import toast from 'react-hot-toast';

export default function BookingModal({ doctorId, patientId, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  // React Query Fetch Availability
  const { data: slots, isLoading: isSlotsLoading, error: slotsError } = useQuery({
    queryKey: ['availability', doctorId, dateStr],
    queryFn: () => fetchAvailability(doctorId, dateStr),
    staleTime: 1000 * 60, // 1 min
  });

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      setStep(3);
      toast.success('Slot secured successfully!');
    },
    onError: (error) => {
      toast.error("Failed to book: " + (error.response?.data?.error || error.message));
    }
  });

  const generateDates = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  };

  const handleNext = () => {
    if (step === 1 && !selectedSlot) return;
    if (step === 2 && !reason.trim()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    mutation.mutate({
      doctor: doctorId,
      patient: patientId || '60c72b2f5f1b2c001f3b3b3a', // Mock ID if not provided
      startTime: `${dateStr}T${selectedSlot.replace('AM', '').replace('PM', '').trim()}:00.000Z`, 
      endTime: `${dateStr}T${selectedSlot.replace('AM', '').replace('PM', '').trim()}:30.000Z`, // Assuming 30m slots
      reason
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2>Book an Appointment</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {/* Multistep Body */}
        <div className="modal-body">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="step step-1">
              <h3><CalendarIcon size={20} /> Select Date & Time</h3>
              
              <div className="date-selector">
                {generateDates().map((date, idx) => {
                  const isSelected = date.getDate() === selectedDate.getDate();
                  return (
                    <button 
                      key={idx} 
                      className={`date-bubble ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                    >
                      <span className="day">{format(date, 'EEE')}</span>
                      <span className="date">{format(date, 'd')}</span>
                    </button>
                  );
                })}
              </div>

              <div className="slots-container">
                <h4><Clock size={16} /> Available Slots</h4>
                {isSlotsLoading ? (
                  <div className="skeleton-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-chip"></div>)}
                  </div>
                ) : slotsError && slotsError.response?.status !== 404 ? (
                  <div className="error-msg">Error loading slots</div>
                ) : (
                  <div className="chips-grid">
                    {slots?.map((slot, idx) => (
                      <button
                        key={idx}
                        className={`time-chip ${slot.isBooked ? 'booked' : ''} ${selectedSlot === slot.time ? 'selected' : ''}`}
                        disabled={slot.isBooked}
                        onClick={() => setSelectedSlot(slot.time)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="step step-2">
              <h3>Brief Description</h3>
              <p>Please briefly describe your symptoms or reason for the visit.</p>
              <textarea 
                className="ailment-textarea"
                placeholder="E.g., I've been having continuous headaches for three days..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
              />
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="step step-3 confirmation">
              {mutation.isPending ? (
                 <div className="loader">Confirming your slot...</div>
              ) : mutation.isSuccess ? (
                <>
                  <CheckCircle2 color="#10b981" size={64} className="success-icon" />
                  <h2>Booking Confirmed!</h2>
                  <p>Your appointment is scheduled for {format(selectedDate, 'MMMM d, yyyy')} at {selectedSlot}.</p>
                </>
              ) : (
                <>
                  <h3>Review & Confirm</h3>
                  <div className="summary-box">
                    <p><strong>Date:</strong> {format(selectedDate, 'MMM d, yyyy')}</p>
                    <p><strong>Time:</strong> {selectedSlot}</p>
                    <p><strong>Reason:</strong> {reason}</p>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {step < 3 && (
          <div className="modal-footer">
            <button 
              className={`btn-secondary ${step === 1 ? 'hidden' : ''}`} 
              onClick={handleBack}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button 
              className="btn-primary" 
              onClick={step === 2 ? handleSubmit : handleNext}
              disabled={
                (step === 1 && !selectedSlot) || 
                (step === 2 && !reason.trim()) ||
                mutation.isPending
              }
            >
              {step === 2 ? (mutation.isPending ? 'Booking...' : 'Confirm Booking') : 'Next'} {step < 2 && <ChevronRight size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

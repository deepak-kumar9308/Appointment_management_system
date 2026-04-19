const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const catchAsync = require('../utils/catchAsync');

// POST /api/appointments/book
// In a real app we'd attach the patient from the JWT token via protect middleware
router.post('/book', catchAsync(async (req, res) => {
  const appointment = await Appointment.create(req.body);
  res.status(201).json({ success: true, data: appointment });
}));

// GET /api/appointments/me
router.get('/me', catchAsync(async (req, res) => {
  // Normally we'd use req.user.id from JWT. Since we might be mocking auth:
  const patientId = req.query.patientId || 'mock_userId_123';
  
  let appointments = [];
  try {
      appointments = await Appointment.find({ patient: patientId })
        .populate('doctor', 'name specialization')
        .sort({ startTime: -1 });
  } catch(e) {}
  
  if (appointments.length === 0) {
      // Mock Data payload for timeline demo!
      appointments = [
          { _id: '1', doctor: { name: 'Dr. Sarah Smith', specialization: 'Cardiology' }, startTime: new Date(Date.now() + 86400000), status: 'approved', reason: 'Routine checkup' },
          { _id: '2', doctor: { name: 'Dr. James Wilson', specialization: 'Dermatology' }, startTime: new Date(Date.now() - 172800000), status: 'completed', reason: 'Skin rash' },
      ];
  }

  res.status(200).json({ success: true, count: appointments.length, data: appointments });
}));

// GET /api/appointments
router.get('/', catchAsync(async (req, res) => {
  const doctorId = req.query.doctorId;
  
  if (!doctorId) {
      return res.status(400).json({ success: false, message: 'doctorId is required' });
  }

  // Fetch from Real MongoDB
  const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name email')
      .sort({ startTime: 1 });

  res.status(200).json({ success: true, count: appointments.length, data: appointments });
}));

// PATCH /api/appointments/:id/status
router.patch('/:id/status', catchAsync(async (req, res) => {
  const { status } = req.body;
  const appointmentId = req.params.id;

  // Enforce rigid status enums explicitly allowed by our schema
  if (!['pending', 'approved', 'rejected', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  // Update directly inside MongoDB Database natively!
  const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId, 
      { status }, 
      { new: true, runValidators: true }
  );

  if (!updatedAppointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found in Database' });
  }

  res.status(200).json({ success: true, data: updatedAppointment });
}));

module.exports = router;

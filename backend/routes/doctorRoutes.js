const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const catchAsync = require('../utils/catchAsync');

// GET /api/doctors/
router.get('/', catchAsync(async (req, res) => {
  // Pull ALL fully registered functional Doctors, populating their native root User accounts for UI mapping
  const doctors = await Doctor.find().populate('user', 'name');
  res.status(200).json({ success: true, count: doctors.length, data: doctors });
}));

// GET /api/doctors/profile/:userId
router.get('/profile/:userId', catchAsync(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.params.userId }).populate('user', 'name email');
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  res.status(200).json({ success: true, data: doctor });
}));

// PATCH /api/doctors/profile
router.patch('/profile', catchAsync(async (req, res) => {
  const { doctorId, specialization, fee } = req.body;
  if (!doctorId) return res.status(400).json({ success: false, message: 'doctorId is required' });

  const doctor = await Doctor.findOneAndUpdate(
     { user: doctorId },
     { specialization, fee },
     { new: true, runValidators: true }
  );

  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found in Database' });
  res.status(200).json({ success: true, data: doctor });
}));

// GET /api/doctors/:id/availability
router.get('/:id/availability', catchAsync(async (req, res) => {
  // Demo mock logic if doctor doesn't exist yet, just to make UI work
  let doctor = null;
  try {
     // Lookup by underlying root User ID rather than the generic mongo _id
     doctor = await Doctor.findOne({ user: req.params.id });
  } catch(e) { } // Ignore cast error for mock ID
  
  if (!doctor || !doctor.availableSlots || doctor.availableSlots.length === 0) {
      // Return a set of mock slots so the frontend time chips populate!
      return res.status(200).json({
          success: true,
          slots: [
              { time: '09:00 AM', isBooked: false },
              { time: '09:30 AM', isBooked: false },
              { time: '10:00 AM', isBooked: true },
              { time: '10:30 AM', isBooked: false },
              { time: '11:00 AM', isBooked: true },
              { time: '01:00 PM', isBooked: false }
          ]
      });
  }

  const slots = doctor.availableSlots.map(slot => {
     const hours = slot.startTime.getHours();
     const mins = slot.startTime.getMinutes() === 0 ? '00' : slot.startTime.getMinutes();
     const ampm = hours >= 12 ? 'PM' : 'AM';
     const displayHours = hours % 12 || 12;
     return {
        time: `${displayHours.toString().padStart(2, '0')}:${mins} ${ampm}`,
        isBooked: slot.isBooked
     };
  });

  res.status(200).json({ success: true, slots });
}));

module.exports = router;

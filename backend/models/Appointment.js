const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Appointment must belong to a patient'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Appointment must belong to a doctor'],
  },
  startTime: {
    type: Date,
    required: [true, 'Please specify the start time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please specify the end time'],
  },
  status: {
    type: String,
    enum: {
        values: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status',
    },
    default: 'pending',
  },
  reason: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true,
});

// VERY IMPORTANT: Prevent Double Booking using Compound Unique Index.
// Ensures database-level consistency that no two identical time slots are booked for the same doctor.
appointmentSchema.index({ doctor: 1, startTime: 1 }, { unique: true });

// Schema Pre-save logic for advanced "available slots" validation
appointmentSchema.pre('save', async function (next) {
  // Only run validation if it's a new appointment or timeframe is modified
  if (this.isNew || this.isModified('startTime') || this.isModified('endTime') || this.isModified('doctor')) {
    
    // 1) Verify doctor exists via User Relational Mapping
    const Doctor = mongoose.model('Doctor');
    const doctorProfile = await Doctor.findOne({ user: this.doctor });
    
    if (!doctorProfile) {
      return next(new Error('Doctor not found'));
    }

    // 2) Verify requested time corresponds to the Doctor's configured valid slots
    // If the doctor hasn't configured any slots yet, we allow open booking for demonstration purposes!
    if (doctorProfile.availableSlots && doctorProfile.availableSlots.length > 0) {
        const validSlot = doctorProfile.availableSlots.find(slot => 
          slot.startTime.getTime() === this.startTime.getTime() && 
          slot.endTime.getTime() === this.endTime.getTime()
        );

        if (!validSlot) {
          return next(new Error('Invalid slot. The requested time is outside the doctor\'s availability schedule.'));
        }

        if (validSlot.isBooked) {
          return next(new Error('This slot has already been explicitly marked as fully booked by the doctor.'));
        }
    }

    // 3) Application-level Double Booking Safety Check
    // Prevents overlaps that a basic exact-match index might miss.
    const overlappingAppointment = await this.constructor.findOne({
      doctor: this.doctor,
      status: { $in: ['pending', 'approved'] },
      $or: [
        {
          startTime: { $lt: this.endTime },
          endTime: { $gt: this.startTime }
        }
      ]
    });

    if (overlappingAppointment && overlappingAppointment._id.toString() !== this._id.toString()) {
      return next(new Error(`Double-booking prevented: Overlaps with an existing ${overlappingAppointment.status} appointment.`));
    }
  }

  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);

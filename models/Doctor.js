const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // A user can only have one doctor profile
  },
  specialization: {
    type: String,
    required: [true, 'Please provide doctor specialization'],
    trim: true,
  },
  bio: {
    type: String,
    maxLength: [1000, 'Bio cannot exceed 1000 characters'],
  },
  experienceYears: {
    type: Number,
    min: [0, 'Experience years cannot be negative'],
    default: 0
  },
  fee: {
    type: Number,
    min: [0, 'Consultation fee cannot be negative'],
    default: 100
  },
  // Subdocument array defining logical blocks of availability. 
  // It provides flexibility to validate incoming appointments against valid schedule templates.
  availableSlots: [{
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Doctor', doctorSchema);

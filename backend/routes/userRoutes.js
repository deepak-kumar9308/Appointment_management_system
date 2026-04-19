const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

// POST /api/users/register
router.post('/register', catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Real Database Flow
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  
  // Creating user triggers our bcrypt pre-save hook automatically
  const user = await User.create({ name, email, password, role });

  // Atomic Doctor Registration Integration
  if (role === 'Doctor') {
      await Doctor.create({
          user: user._id,
          specialization: 'General Practitioner', // Default
          fee: 100, // Default baseline consultation
          bio: 'A certified healthcare professional.',
          availableSlots: [] // They can configure this in Admin Panel
      });
  }

  const secret = process.env.JWT_SECRET || 'Demo_Secret_Fallback';
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30d' });

  res.status(201).json({
      success: true,
      token,
      data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
      }
  });
}));

// POST /api/users/login
router.post('/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  
  // Guard against missing user or corrupted manual DB entries lacking a password
  if (!user || !user.password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  // Use Mongoose schema method to verify encrypted hash securely
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const secret = process.env.JWT_SECRET || 'Demo_Secret_Fallback';
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30d' });

  res.status(200).json({
      success: true,
      token,
      data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
      }
  });
}));

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const errorHandler = require('./middleware/errorMiddleware');
// Route imports would go here

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic route for testing
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// App Routes
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// 404 Route handling
app.use('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Custom Error Handling Wrapper (Global)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB (cached for serverless warm starts)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/appointments_db');
    isConnected = true;
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('FATAL ERROR: MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Start server only in non-serverless (local) environments
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
} else {
  // For Vercel: connect on first request (handled by exported handler)
  connectDB();
}

module.exports = app;

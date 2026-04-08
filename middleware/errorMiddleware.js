// Global Error Handling Wrapper
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message; // Ensure message property is copied

  // Log detailed error to console during development (can be suppressed in prod)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error]: ${err.stack.split('\n')[0]}`);
  }

  // 1) Mongoose Invalid ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with invalid id: ${err.value}`;
    error = { statusCode: 404, message };
  }

  // 2) Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = 'Duplicate field value encountered. A record with this value already exists.';
    error = { statusCode: 400, message };
  }

  // 3) Mongoose Validation Error
  if (err.name === 'ValidationError') {
    // Extract comprehensive validation errors
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { statusCode: 400, message };
  }

  // Dispatch final formatted response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;

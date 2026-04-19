const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes via JSON Web Tokens
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Abstract token from Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route, token missing.' });
    }

    // Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SUPER_SECRET_FALLBACK_KEY');
    
    // Fetch user related to token and attach it to req
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route, token invalid or expired.' });
  }
};

// Middleware to restrict resource access by roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role (${req.user ? req.user.role : 'none'}) is not authorized to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

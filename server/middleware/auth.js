import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Token is automatically validated by jwt.verify() which checks expiration
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found', sessionExpired: true });
      }
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired. Please login again.', sessionExpired: true });
      }
      res.status(401).json({ message: 'Not authorized, token failed', sessionExpired: true });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token', sessionExpired: true });
  }
};

export const managerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Manager only.' });
  }
};

export const employeeOrManager = (req, res, next) => {
  if (req.user && (req.user.role === 'employee' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Employee or Manager only.' });
  }
};

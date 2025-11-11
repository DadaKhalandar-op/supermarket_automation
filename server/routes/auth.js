import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '2h', // Session timeout set to 2 hours
  });
};

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, isActive: true });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

      res.json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        token,
        expiresAt: expiresAt.toISOString(),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      fullName: req.user.fullName,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

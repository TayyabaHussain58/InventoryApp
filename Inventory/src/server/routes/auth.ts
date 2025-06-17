import express, { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

// Middleware to verify JWT token
export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Signup
const signup: RequestHandler = async (req, res) => {
  console.log('Signup Request:', { email: req.body.email, name: req.body.name });
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Signup Error: User already exists with email:', email);
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();
    console.log('New user created:', { id: user._id, email: user.email, name: user.name });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Login
const login: RequestHandler = async (req, res) => {
  console.log('Login Request:', { email: req.body.email });
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login Error: User not found with email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login Error: Invalid password for user:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    console.log('Login successful for user:', { id: user._id, email: user.email });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Logout
const logout: RequestHandler = async (req, res) => {
  try {
    // Since we're using JWT, we don't need to do anything on the server
    // The client should remove the token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out' });
  }
};

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

export default router; 
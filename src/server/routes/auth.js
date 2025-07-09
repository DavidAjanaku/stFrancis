import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Debug middleware for auth routes
router.use((req, res, next) => {
    console.log('Auth route hit:', req.method, req.url);
    console.log('Request body:', req.body);
    next();
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    
    try {
        // For demo purposes
        if (username === 'admin' && password === 'church2025') {
            const token = jwt.sign({ id: 'demo-user' }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });
            
            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });
            
            // Also return token in response
            return res.json({ 
                token, 
                message: 'Login successful',
                user: { id: 'demo-user', username: 'admin' }
            });
        }
        
        // Database user check
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });
        
        res.json({ 
            token, 
            message: 'Login successful',
            user: { id: user._id, username: user.username }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/verify', async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log('Verify route hit - Token from cookie:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('No token found in cookies');
      return res.status(200).json({ isAuthenticated: false, message: 'No token found' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      console.log('Token verified successfully for user:', decoded.id);
      
      // If it's a demo user, return success
      if (decoded.id === 'demo-user') {
        return res.status(200).json({ isAuthenticated: true, message: 'Demo user authenticated' });
      }
      
      // For database users, optionally verify user still exists
      // const user = await User.findById(decoded.id);
      // if (!user) {
      //   return res.status(200).json({ isAuthenticated: false, message: 'User not found' });
      // }
      
      res.status(200).json({ isAuthenticated: true, message: 'Token valid' });
      
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError.message);
      if (tokenError.name === 'TokenExpiredError') {
        console.log('Token expired');
        return res.status(200).json({ isAuthenticated: false, message: 'Token expired' });
      }
      return res.status(200).json({ isAuthenticated: false, message: 'Invalid token' });
    }
    
  } catch (error) {
    console.error('Verify route error:', error);
    res.status(500).json({ isAuthenticated: false, message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
});

export default router;
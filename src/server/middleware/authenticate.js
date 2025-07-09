import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  // Get token from cookies or Authorization header
  let token = req.cookies.token || req.headers.authorization;
  
  // Extract token from Bearer format if present
  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Handle demo token specially
  if (token === 'demo-token') {
    console.log('Demo token accepted');
    req.user = { id: 'demo-user' };
    return next();
  }

  try {
    // Verify regular JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    // Provide more specific error messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authenticate;
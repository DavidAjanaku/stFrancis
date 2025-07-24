import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization;
  
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export { verifyToken };


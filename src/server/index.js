import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Routes
import authRoutes from './routes/auth.js';
import massScheduleRoutes from './routes/massSchedule.js';
import aboutSectionRoutes from './routes/aboutSectionRoutes.js';
import eventsRoutes from './routes/events.js';
import galleryRouter from './routes/gallery.js';
import prayerRequestRoutes from './routes/prayerRequests.js';
import donationSectionRoutes from './routes/postSectionRoutes.js';
import donationROutes from './routes/donationSectionRoutes.js';
import liturgicalCalendarRoutes from './routes/liturgicalCalendarRoutes.js';
import heroSlideRoutes from './routes/heroSlideRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import parishSocietyRoutes from './routes/parishSocietyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Get __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);
console.log('Railway Domain:', process.env.RAILWAY_PUBLIC_DOMAIN || 'not set');

// Enhanced CORS Configuration - FIXED VERSION
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS Check - Origin:', origin);
    
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      console.log('No origin - allowing request');
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'https://distinct-stranger-production.up.railway.app',
      'https://stfrancis-1.onrender.com',
      // Add pattern for any Railway domain
      /^https:\/\/.*\.up\.railway\.app$/
    ];
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origin blocked:', origin);
      console.log('Allowed origins:', allowedOrigins);
      
      // In development, be more lenient
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔧 Development mode - allowing anyway');
        callback(null, true);
      } else {
        // Still allow localhost in production for testing
        if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
          console.log('🔧 Localhost detected - allowing');
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'Origin',
    'X-Requested-With',
    'Cache-Control',
    'Pragma',
    'Expires',
    'If-None-Match',
    'If-Modified-Since'
  ],
  exposedHeaders: [
    'Content-Length', 
    'Content-Type',
    'Cache-Control',
    'ETag',
    'Last-Modified'
  ],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours preflight cache
};

// Apply CORS middleware FIRST - before any other middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly - MOVED UP
app.options('*', cors(corsOptions));

// Add manual CORS headers as backup
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from origin: ${origin || 'no-origin'}`);
  
  // Set CORS headers manually as backup
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With, Cache-Control, Pragma, Expires, If-None-Match, If-Modified-Since');
  
  // Handle preflight manually as backup
  if (req.method === 'OPTIONS') {
    console.log('Manual preflight handler for:', req.path);
    res.header('Access-Control-Allow-Origin', origin || '*');
    return res.status(200).end();
  }
  
  next();
});

// Add cache control middleware for static assets and API responses
app.use((req, res, next) => {
  // Set cache headers for static assets
  if (req.path.startsWith('/uploads/')) {
    res.set('Cache-Control', 'public, max-age=31536000'); // 1 year for images
    res.set('ETag', `"${Date.now()}"`);
  }
  
  // Set cache headers for API routes that can be cached
  if (req.path.includes('/api/hero-slides') && req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes for hero slides
  }
  
  if (req.path.includes('/api/about-section') && req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=600'); // 10 minutes for about section
  }
  
  if (req.path.includes('/api/footer') && req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=1800'); // 30 minutes for footer
  }
  
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Create uploads directory if not exists
const uploadsPath = path.resolve(process.cwd(), 'src/data/uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
console.log('Uploads directory:', uploadsPath);

// Create hero image directory
const heroUploadsPath = path.join(uploadsPath, 'hero');
if (!fs.existsSync(heroUploadsPath)) {
  fs.mkdirSync(heroUploadsPath, { recursive: true });
}
console.log('Hero images directory:', heroUploadsPath);

// Serve uploads statically with optimized caching
app.use('/uploads', express.static(uploadsPath, {
  maxAge: '1y', // Cache for 1 year
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Set specific cache headers for different file types
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.webp')) {
      res.set('Cache-Control', 'public, max-age=31536000'); // 1 year for images
    }
  }
}));

// Database Connection with connection pooling
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes with error handling
try {
  app.use('/api/auth', authRoutes);
  console.log('✅ authRoutes loaded');

  app.use('/api/mass-schedule', massScheduleRoutes);
  console.log('✅ massScheduleRoutes loaded');

  app.use('/api/about-section', aboutSectionRoutes);
  console.log('✅ aboutSectionRoutes loaded');

  app.use('/api/events', eventsRoutes);
  console.log('✅ eventsRoutes loaded');

  app.use('/api/gallery', galleryRouter);
  console.log('✅ galleryRouter loaded');

  app.use('/api/prayer-requests', prayerRequestRoutes);
  console.log('✅ prayerRequestRoutes loaded');

  app.use('/api/donation-sections', donationSectionRoutes);
  console.log('✅ donationSectionRoutes loaded');

  app.use('/api/liturgical-calendar', liturgicalCalendarRoutes);
  console.log('✅ liturgicalCalendarRoutes loaded');

  app.use('/api/hero-slides', heroSlideRoutes);
  console.log('✅ heroSlideRoutes loaded');

  app.use('/api/contact', contactRoutes);
  console.log('✅ contactRoutes loaded');

  app.use('/api/footer', footerRoutes);
  console.log('✅ footerRoutes loaded');

  app.use('/api/donations-sections', donationROutes);
  console.log('✅ donationROutes loaded');

  app.use('/api/parish-societies', parishSocietyRoutes);
  console.log('✅ parishSocietyRoutes loaded');
} catch (err) {
  console.error('❌ Error loading route:', err);
}

// Cleanup old mass schedules
const scheduleCleanup = async () => {
  try {
    const schedules = await mongoose.model('MassSchedule').find().sort({ createdAt: -1 });
    if (schedules.length > 5) {
      const idsToDelete = schedules.slice(5).map((s) => s._id);
      await mongoose.model('MassSchedule').deleteMany({
        _id: { $in: idsToDelete },
      });
      console.log(`🧹 Cleaned up ${idsToDelete.length} old mass schedules`);
    }
  } catch (error) {
    console.error('❌ Schedule cleanup error:', error);
  }
};

// Enhanced health check route with detailed info
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    railwayDomain: process.env.RAILWAY_PUBLIC_DOMAIN || 'not set',
    cors: {
      requestOrigin: req.headers.origin,
      host: req.headers.host,
      userAgent: req.headers['user-agent'],
      allowedOrigins: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://distinct-stranger-production.up.railway.app',
        'https://stfrancis-1.onrender.com',
      ]
    }
  });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS test successful! 🎉',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    headers: {
      origin: req.headers.origin,
      host: req.headers.host,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer
    }
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working! 🚀',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware - Enhanced for CORS debugging
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:');
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  console.error('Request path:', req.path);
  console.error('Request method:', req.method);
  console.error('Request origin:', req.headers.origin);
  
  // Check if it's a CORS error
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      message: 'CORS policy violation',
      error: err.message,
      origin: req.headers.origin,
      allowedOrigins: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://distinct-stranger-production.up.railway.app',
        'https://stfrancis-1.onrender.com',
      ]
    });
  }
  
  res.status(err.status || 500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('📥 SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📥 SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    console.log('🔄 Initializing server...');
    
    // Connect to database first
    await connectDB();

    // Initial cleanup
    await scheduleCleanup();

    // Schedule daily cleanup
    setInterval(scheduleCleanup, 24 * 60 * 60 * 1000);

    // Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 ===================================');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 MongoDB: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`);
      console.log(`🌐 Railway Domain: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set'}`);
      console.log('🔒 CORS enabled for origins:');
      console.log('   - http://localhost:5173');
      console.log('   - http://127.0.0.1:5173'); 
      console.log('   - https://distinct-stranger-production.up.railway.app');
      console.log('   - https://stfrancis-1.onrender.com');
      console.log('   - Any *.up.railway.app domain');
      console.log('🚀 ===================================');
      
      // Test endpoints available
      console.log('📋 Test endpoints:');
      console.log(`   Health: https://distinct-stranger-production.up.railway.app/api/health`);
      console.log(`   CORS Test: https://distinct-stranger-production.up.railway.app/api/test-cors`);
      console.log(`   Hero Slides: https://distinct-stranger-production.up.railway.app/api/hero-slides`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
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

// Simplified CORS Configuration
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
      'https://stfrancis-1.onrender.com'
    ];
    
    // Check Railway domains dynamically
    const isRailwayDomain = origin.match(/^https:\/\/.*\.up\.railway\.app$/);
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    const isInAllowedList = allowedOrigins.includes(origin);
    
    if (isInAllowedList || isRailwayDomain || isLocalhost) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origin blocked:', origin);
      // In non-production, allow anyway
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔧 Development mode - allowing anyway');
        callback(null, true);
      } else {
        callback(null, false); // Don't throw error, just deny
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  optionsSuccessStatus: 200,
  maxAge: 86400
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Simplified preflight handler
app.options('*', (req, res) => {
  console.log('Preflight request for:', req.path, 'from origin:', req.headers.origin);
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Create uploads directory if not exists
const uploadsPath = path.resolve(process.cwd(), 'src/data/uploads');
try {
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

  // Serve uploads statically
  app.use('/uploads', express.static(uploadsPath, {
    maxAge: '1d',
    etag: true
  }));
} catch (error) {
  console.error('Error setting up uploads directory:', error);
}

// Database Connection - Simplified
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Don't exit in production, let Railway restart
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Enhanced health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    version: process.version
  });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS test successful! 🎉',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path
  });
});

// Routes - with try-catch for safety
const setupRoutes = () => {
  try {
    app.use('/api/auth', authRoutes);
    app.use('/api/mass-schedule', massScheduleRoutes);
    app.use('/api/about-section', aboutSectionRoutes);
    app.use('/api/events', eventsRoutes);
    app.use('/api/gallery', galleryRouter);
    app.use('/api/prayer-requests', prayerRequestRoutes);
    app.use('/api/donation-sections', donationSectionRoutes);
    app.use('/api/liturgical-calendar', liturgicalCalendarRoutes);
    app.use('/api/hero-slides', heroSlideRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/footer', footerRoutes);
    app.use('/api/donations-sections', donationROutes);
    app.use('/api/parish-societies', parishSocietyRoutes);
    console.log('✅ All routes loaded successfully');
  } catch (err) {
    console.error('❌ Error loading routes:', err);
  }
};

// Setup routes
setupRoutes();

// Cleanup function - simplified
const scheduleCleanup = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ Database not connected, skipping cleanup');
      return;
    }
    
    const MassSchedule = mongoose.model('MassSchedule');
    const schedules = await MassSchedule.find().sort({ createdAt: -1 });
    if (schedules.length > 5) {
      const idsToDelete = schedules.slice(5).map((s) => s._id);
      await MassSchedule.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`🧹 Cleaned up ${idsToDelete.length} old mass schedules`);
    }
  } catch (error) {
    console.error('❌ Schedule cleanup error:', error);
  }
};

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

// Simplified error handler
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err.message);
  console.error('Request:', req.method, req.path);
  console.error('Origin:', req.headers.origin);
  
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({
    error: message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('📥 Graceful shutdown initiated');
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    }
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  }
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown();
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  gracefulShutdown();
});

// Start server
const startServer = async () => {
  try {
    console.log('🔄 Initializing server...');
    
    // Connect to database
    await connectDB();

    // Initial cleanup (only if DB is connected)
    if (mongoose.connection.readyState === 1) {
      await scheduleCleanup();
      // Schedule daily cleanup
      setInterval(scheduleCleanup, 24 * 60 * 60 * 1000);
    }

    // Start listening
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 ===================================');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
      console.log(`🌐 Railway Domain: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set'}`);
      console.log('🚀 ===================================');
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
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

// Enhanced CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://distinct-stranger-production.up.railway.app',
    'https://stfrancis-1.onrender.com',
    'https://stfrancis-52b1.onrender.com/',
  ],
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

// Middleware
app.use(cors(corsOptions));

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
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // Removed deprecated options: bufferCommands and bufferMaxEntries
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes with error handling
try {
  app.use('/api/auth', authRoutes);
  console.log('authRoutes loaded');

  app.use('/api/mass-schedule', massScheduleRoutes);
  console.log('massScheduleRoutes loaded');

  app.use('/api/about-section', aboutSectionRoutes);
  console.log('aboutSectionRoutes loaded');

  app.use('/api/events', eventsRoutes);
  console.log('eventsRoutes loaded');

  app.use('/api/gallery', galleryRouter);
  console.log('galleryRouter loaded');

  app.use('/api/prayer-requests', prayerRequestRoutes);
  console.log('prayerRequestRoutes loaded');

  app.use('/api/donation-sections', donationSectionRoutes);
  console.log('donationSectionRoutes loaded');

  app.use('/api/liturgical-calendar', liturgicalCalendarRoutes);
  console.log('liturgicalCalendarRoutes loaded');

  app.use('/api/hero-slides', heroSlideRoutes);
  console.log('heroSlideRoutes loaded');

  app.use('/api/contact', contactRoutes);
  console.log('contactRoutes loaded');

  app.use('/api/footer', footerRoutes);
  console.log('footerRoutes loaded');

  app.use('/api/donations-sections', donationROutes);
  console.log('donationROutes loaded');

  app.use('/api/parish-societies', parishSocietyRoutes);
  console.log('parishSocietyRoutes loaded');
} catch (err) {
  console.error('Error loading route:', err);
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
      console.log(`Cleaned up ${idsToDelete.length} old mass schedules`);
    }
  } catch (error) {
    console.error('Schedule cleanup error:', error);
  }
};

// Health check route with detailed info
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  console.error('Request path:', req.path);
  console.error('Request method:', req.method);
  
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
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    await scheduleCleanup(); // Initial cleanup

    // Schedule daily cleanup
    setInterval(scheduleCleanup, 24 * 60 * 60 * 1000);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`MongoDB URI: ${process.env.MONGO_URI ? 'Set' : 'Not set'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
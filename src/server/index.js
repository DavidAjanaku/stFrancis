import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import massScheduleRoutes from './routes/massSchedule.js';
import aboutSectionRoutes from './routes/aboutSectionRoutes.js';
import eventsRoutes from './routes/events.js';
import galleryRouter from './routes/gallery.js';
import prayerRequestRoutes from './routes/prayerRequests.js';
import donationSectionRoutes from './routes/postSectionRoutes.js';
import donationSectionRoutess from './routes/donationSectionRoutes.js'
import liturgicalCalendarRoutes from './routes/liturgicalCalendarRoutes.js';
import heroSlideRoutes from './routes/heroSlideRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import parishSocietyRoutes from './routes/parishSocietyRoutes.js';

dotenv.config();

const app = express();
// CRITICAL: Use process.env.PORT for Render deployment
const PORT = process.env.PORT || 5001;

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration - Updated for your specific Render URL
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://stfrancis-52b1.onrender.com',
        process.env.FRONTEND_URL
      ].filter(Boolean)
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Get absolute path to uploads directory
const uploadsPath = path.resolve(process.cwd(), 'src/data/uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
console.log('Uploads directory:', uploadsPath);

const heroUploadsPath = path.join(uploadsPath, 'hero');
if (!fs.existsSync(heroUploadsPath)) {
  fs.mkdirSync(heroUploadsPath, { recursive: true });
}
console.log('Hero images directory:', heroUploadsPath);

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsPath));

// Database Connection with better error handling
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Test route - moved before other routes
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Church Website API is running',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// API Routes
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
app.use('/api/donations-sections', donationSectionRoutess);
app.use('/api/parish-societies', parishSocietyRoutes);

// Cleanup old mass schedules
const scheduleCleanup = async () => {
  try {
    // Check if the model exists and connection is ready
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, skipping cleanup');
      return;
    }

    const MassSchedule = mongoose.models.MassSchedule || mongoose.model('MassSchedule');
    const schedules = await MassSchedule
      .find()
      .sort({ createdAt: -1 });
      
    if (schedules.length > 5) {
      const idsToDelete = schedules.slice(5).map(s => s._id);
      await MassSchedule.deleteMany({ 
        _id: { $in: idsToDelete } 
      });
      console.log(`Cleaned up ${idsToDelete.length} old mass schedules`);
    }
  } catch (error) {
    console.error('Schedule cleanup error:', error);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    message: 'API route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// 404 handler for all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found - API server',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    availableRoutes: {
      health: '/api/health',
      test: '/test',
      auth: '/api/auth/*',
      massSchedule: '/api/mass-schedule/*',
      about: '/api/about-section/*',
      events: '/api/events/*',
      gallery: '/api/gallery/*',
      prayerRequests: '/api/prayer-requests/*',
      donations: '/api/donation-sections/*',
      liturgical: '/api/liturgical-calendar/*',
      heroSlides: '/api/hero-slides/*',
      contact: '/api/contact/*',
      footer: '/api/footer/*',
      parishSocieties: '/api/parish-societies/*'
    }
  });
});

// Graceful shutdown handler
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

// Start server with better error handling
const startServer = async () => {
  console.log('Starting server...');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Port:', PORT);
  
  // Try to connect to database
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.log('Warning: Starting server without database connection');
    // Don't exit - let the server start anyway for debugging
  }
  
  // Start the server - CRITICAL: bind to 0.0.0.0 for Render
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Server accessible at http://0.0.0.0:${PORT}`);
    
    // Only run cleanup if database is connected
    if (dbConnected) {
      // Initial cleanup
      scheduleCleanup();
      
      // Schedule regular cleanups (daily)
      setInterval(scheduleCleanup, 24 * 60 * 60 * 1000);
      console.log('📅 Scheduled daily cleanup activated');
    }
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
    } else {
      console.error('❌ Server error:', error);
    }
    process.exit(1);
  });

  return server;
};

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
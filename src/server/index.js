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
import liturgicalCalendarRoutes from './routes/liturgicalCalendarRoutes.js';
import heroSlideRoutes from './routes/heroSlideRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import footerRoutes from './routes/footerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
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

// Cleanup old mass schedules
const scheduleCleanup = async () => {
  try {
    const schedules = await mongoose.model('MassSchedule')
      .find()
      .sort({ createdAt: -1 });
      
    if (schedules.length > 5) {
      const idsToDelete = schedules.slice(5).map(s => s._id);
      await mongoose.model('MassSchedule').deleteMany({ 
        _id: { $in: idsToDelete } 
      });
      console.log(`Cleaned up ${idsToDelete.length} old mass schedules`);
    }
  } catch (error) {
    console.error('Schedule cleanup error:', error);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  // Initial cleanup
  await scheduleCleanup();
  
  // Schedule regular cleanups (daily)
  setInterval(scheduleCleanup, 24 * 60 * 60 * 1000);
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

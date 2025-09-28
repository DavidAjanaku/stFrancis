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
    'https://st-francis-cc-oregun.ng'
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

// Body parsing middleware (before static files)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Define both upload paths based on debug output
const uploadsPath = path.resolve(process.cwd(), 'uploads'); // /app/src/server/uploads
const altUploadsPath = path.resolve(process.cwd(), 'src/data/uploads'); // /app/src/server/src/data/uploads

// Create directories if they don't exist
[uploadsPath, altUploadsPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created directory:', dir);
  }
});

console.log('Primary uploads directory:', uploadsPath);
console.log('Secondary uploads directory:', altUploadsPath);

// Create hero image directory in both locations
const heroUploadsPath = path.join(uploadsPath, 'hero');
const altHeroUploadsPath = path.join(altUploadsPath, 'hero');

if (!fs.existsSync(heroUploadsPath)) {
  fs.mkdirSync(heroUploadsPath, { recursive: true });
}
if (!fs.existsSync(altHeroUploadsPath)) {
  fs.mkdirSync(altHeroUploadsPath, { recursive: true });
}

// Custom static middleware that checks both directories
app.use('/uploads', (req, res, next) => {
  const requestedFile = req.path.slice(1); // Remove leading slash
  
  // Define possible file locations in order of preference
  const possiblePaths = [
    path.join(altUploadsPath, requestedFile), // Check alt path first (where your donation images are)
    path.join(uploadsPath, requestedFile),     // Then check main path
  ];

  console.log(`Looking for file: ${requestedFile}`);
  
  // Check each possible path
  for (const fullPath of possiblePaths) {
    if (fs.existsSync(fullPath)) {
      console.log(`File found at: ${fullPath}`);
      
      // Set proper headers
      res.set('Cache-Control', 'public, max-age=86400'); // 1 day cache
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      
      return res.sendFile(path.resolve(fullPath));
    }
    console.log(`File not found at: ${fullPath}`);
  }
  
  // Continue to next middleware if file not found
  next();
});

// Serve from the directory with more files as fallback
app.use('/uploads', express.static(altUploadsPath, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    if (filePath.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      res.set('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// And serve from primary path as final fallback
app.use('/uploads', express.static(uploadsPath, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  }
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // Special logging for upload requests
  if (req.path.startsWith('/uploads/')) {
    console.log(`Upload request for: ${req.path}`);
    console.log(`Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  }
  
  next();
});

// Add cache control middleware for static assets and API responses
app.use((req, res, next) => {
  // Set cache headers for static assets
  if (req.path.startsWith('/uploads/')) {
    res.set('Cache-Control', 'public, max-age=86400'); // 1 day for images
    res.set('ETag', `"${Date.now()}"`);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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

// Database Connection with connection pooling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes with error handling - AFTER static file middleware
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

// Debug routes to help troubleshoot
app.get('/api/debug/uploads', (req, res) => {
  try {
    const paths = [uploadsPath, altUploadsPath];
    const result = {};
    
    paths.forEach((dirPath, index) => {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        result[`path_${index}`] = {
          path: dirPath,
          exists: true,
          files: files.length,
          fileList: files.slice(0, 10) // Show first 10 files
        };
      } else {
        result[`path_${index}`] = {
          path: dirPath,
          exists: false
        };
      }
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug donation images
app.get('/api/debug/donation-images', async (req, res) => {
  try {
    // Get all donation categories from database
    const DonationCategory = mongoose.model('DonationCategory');
    const categories = await DonationCategory.find();
    
    // Get all files in both upload directories
    const primaryFiles = fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath) : [];
    const altFiles = fs.existsSync(altUploadsPath) ? fs.readdirSync(altUploadsPath) : [];
    
    // Compare database entries with actual files
    const comparison = categories.map(category => {
      const dbImagePath = category.image;
      const filename = dbImagePath.replace('/uploads/', '');
      const fileExistsInPrimary = primaryFiles.includes(filename);
      const fileExistsInAlt = altFiles.includes(filename);
      
      return {
        categoryId: category._id,
        title: category.title,
        dbImagePath,
        filename,
        fileExistsInPrimary,
        fileExistsInAlt,
        fileExists: fileExistsInPrimary || fileExistsInAlt
      };
    });
    
    res.json({
      totalCategories: categories.length,
      primaryFiles: primaryFiles.length,
      altFiles: altFiles.length,
      comparison,
      allPrimaryFiles: primaryFiles,
      allAltFiles: altFiles
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Fix image paths if mismatched
app.post('/api/debug/fix-image-paths', async (req, res) => {
  try {
    const DonationCategory = mongoose.model('DonationCategory');
    const categories = await DonationCategory.find();
    
    const primaryFiles = fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath) : [];
    const altFiles = fs.existsSync(altUploadsPath) ? fs.readdirSync(altUploadsPath) : [];
    const allFiles = [...primaryFiles, ...altFiles];
    
    const fixes = [];
    
    for (const category of categories) {
      const dbFilename = category.image.replace('/uploads/', '');
      const fileExists = allFiles.includes(dbFilename);
      
      if (!fileExists) {
        // Try to find a matching file (by prefix)
        const prefix = dbFilename.split('-').slice(0, 2).join('-'); // e.g., "donation-1757580877448"
        const matchingFile = allFiles.find(file => file.startsWith(prefix));
        
        if (matchingFile) {
          // Update the database with the correct filename
          await DonationCategory.findByIdAndUpdate(category._id, {
            image: `/uploads/${matchingFile}`
          });
          
          fixes.push({
            categoryId: category._id,
            title: category.title,
            oldPath: category.image,
            newPath: `/uploads/${matchingFile}`,
            fixed: true
          });
        } else {
          fixes.push({
            categoryId: category._id,
            title: category.title,
            oldPath: category.image,
            error: 'No matching file found',
            fixed: false
          });
        }
      }
    }
    
    res.json({
      message: 'Image path fixing completed',
      fixes
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

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
    uptime: process.uptime(),
    uploadsPath: uploadsPath,
    altUploadsPath: altUploadsPath
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    uploadsPath: uploadsPath,
    uploadsExists: fs.existsSync(uploadsPath),
    altUploadsPath: altUploadsPath,
    altUploadsExists: fs.existsSync(altUploadsPath)
  });
});

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// 404 handler
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  
  // If it's an upload request that wasn't found, provide helpful info
  if (req.path.startsWith('/uploads/')) {
    const filename = req.path.replace('/uploads/', '');
    const primaryFiles = fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath) : [];
    const altFiles = fs.existsSync(altUploadsPath) ? fs.readdirSync(altUploadsPath) : [];
    
    res.status(404).json({
      message: 'File not found',
      path: req.path,
      filename: filename,
      availableFiles: {
        primary: primaryFiles.filter(f => f.includes('donation')),
        alt: altFiles.filter(f => f.includes('donation'))
      }
    });
  } else {
    res.status(404).json({
      message: 'Route not found',
      path: req.path,
      method: req.method
    });
  }
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
      console.log(`Primary uploads directory: ${uploadsPath}`);
      console.log(`Secondary uploads directory: ${altUploadsPath}`);
      
      // Log existing files in both directories
      if (fs.existsSync(uploadsPath)) {
        const files = fs.readdirSync(uploadsPath);
        console.log(`Found ${files.length} files in primary uploads directory`);
      }
      if (fs.existsSync(altUploadsPath)) {
        const files = fs.readdirSync(altUploadsPath);
        console.log(`Found ${files.length} files in secondary uploads directory`);
        if (files.length > 0) {
          console.log('Sample files:', files.slice(0, 3));
        }
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
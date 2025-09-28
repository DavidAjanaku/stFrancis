import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Get __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://distinct-stranger-production.up.railway.app',
    'https://stfrancis-1.onrender.com',
    'https://stfrancis-52b1.onrender.com',
    'https://st-francis-cc-oregun.ng'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Simple upload directory setup
const uploadsPath = path.resolve(process.cwd(), 'uploads');
const altUploadsPath = path.resolve(process.cwd(), 'src/data/uploads');

// Create directories
[uploadsPath, altUploadsPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created directory:', dir);
  }
});

// Simple static file serving
app.use('/uploads', (req, res, next) => {
  const requestedFile = req.path.slice(1);
  const possiblePaths = [
    path.join(altUploadsPath, requestedFile),
    path.join(uploadsPath, requestedFile)
  ];

  for (const fullPath of possiblePaths) {
    if (fs.existsSync(fullPath)) {
      res.set('Access-Control-Allow-Origin', '*');
      return res.sendFile(path.resolve(fullPath));
    }
  }
  next();
});

app.use('/uploads', express.static(altUploadsPath, {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Import routes with error handling
const loadRoutes = async () => {
  try {
    console.log('Loading routes...');

    // Import routes one by one with error handling
    try {
      const authRoutes = await import('./routes/auth.js');
      app.use('/api/auth', authRoutes.default);
      console.log('✓ Auth routes loaded');
    } catch (err) {
      console.error('✗ Failed to load auth routes:', err.message);
    }

    try {
      const massScheduleRoutes = await import('./routes/massSchedule.js');
      app.use('/api/mass-schedule', massScheduleRoutes.default);
      console.log('✓ Mass schedule routes loaded');
    } catch (err) {
      console.error('✗ Failed to load mass schedule routes:', err.message);
    }

    try {
      const aboutSectionRoutes = await import('./routes/aboutSectionRoutes.js');
      app.use('/api/about-section', aboutSectionRoutes.default);
      console.log('✓ About section routes loaded');
    } catch (err) {
      console.error('✗ Failed to load about section routes:', err.message);
    }

    try {
      const eventsRoutes = await import('./routes/events.js');
      app.use('/api/events', eventsRoutes.default);
      console.log('✓ Events routes loaded');
    } catch (err) {
      console.error('✗ Failed to load events routes:', err.message);
    }

    try {
      const galleryRouter = await import('./routes/gallery.js');
      app.use('/api/gallery', galleryRouter.default);
      console.log('✓ Gallery routes loaded');
    } catch (err) {
      console.error('✗ Failed to load gallery routes:', err.message);
    }

    try {
      const prayerRequestRoutes = await import('./routes/prayerRequests.js');
      app.use('/api/prayer-requests', prayerRequestRoutes.default);
      console.log('✓ Prayer request routes loaded');
    } catch (err) {
      console.error('✗ Failed to load prayer request routes:', err.message);
    }

    try {
      const donationSectionRoutes = await import('./routes/postSectionRoutes.js');
      app.use('/api/donation-sections', donationSectionRoutes.default);
      console.log('✓ Donation section routes loaded');
    } catch (err) {
      console.error('✗ Failed to load donation section routes:', err.message);
    }

    try {
      const liturgicalCalendarRoutes = await import('./routes/liturgicalCalendarRoutes.js');
      app.use('/api/liturgical-calendar', liturgicalCalendarRoutes.default);
      console.log('✓ Liturgical calendar routes loaded');
    } catch (err) {
      console.error('✗ Failed to load liturgical calendar routes:', err.message);
    }

    try {
      const heroSlideRoutes = await import('./routes/heroSlideRoutes.js');
      app.use('/api/hero-slides', heroSlideRoutes.default);
      console.log('✓ Hero slide routes loaded');
    } catch (err) {
      console.error('✗ Failed to load hero slide routes:', err.message);
    }

    try {
      const contactRoutes = await import('./routes/contactRoutes.js');
      app.use('/api/contact', contactRoutes.default);
      console.log('✓ Contact routes loaded');
    } catch (err) {
      console.error('✗ Failed to load contact routes:', err.message);
    }

    try {
      const footerRoutes = await import('./routes/footerRoutes.js');
      app.use('/api/footer', footerRoutes.default);
      console.log('✓ Footer routes loaded');
    } catch (err) {
      console.error('✗ Failed to load footer routes:', err.message);
    }

    try {
      const donationROutes = await import('./routes/donationSectionRoutes.js');
      app.use('/api/donations-sections', donationROutes.default);
      console.log('✓ Donation routes loaded');
    } catch (err) {
      console.error('✗ Failed to load donation routes:', err.message);
    }

    try {
      const parishSocietyRoutes = await import('./routes/parishSocietyRoutes.js');
      app.use('/api/parish-societies', parishSocietyRoutes.default);
      console.log('✓ Parish society routes loaded');
    } catch (err) {
      console.error('✗ Failed to load parish society routes:', err.message);
    }

    console.log('Route loading completed');
  } catch (error) {
    console.error('Critical error in route loading:', error);
  }
};

// Debug routes
app.get('/api/debug/uploads', (req, res) => {
  try {
    const result = {
      uploadsPath: {
        path: uploadsPath,
        exists: fs.existsSync(uploadsPath),
        files: fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath).slice(0, 10) : []
      },
      altUploadsPath: {
        path: altUploadsPath,
        exists: fs.existsSync(altUploadsPath),
        files: fs.existsSync(altUploadsPath) ? fs.readdirSync(altUploadsPath).slice(0, 10) : []
      }
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('Starting server...');
    
    await connectDB();
    console.log('✓ Database connected');
    
    await loadRoutes();
    console.log('✓ Routes loaded');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ CORS enabled for localhost:5173`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
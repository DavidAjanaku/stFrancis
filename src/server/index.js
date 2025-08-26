import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

// Routes (import your actual routes)
import authRoutes from './routes/auth.js';
import heroSlideRoutes from './routes/heroSlideRoutes.js';
// ... import other routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // CRITICAL: Explicitly bind to all interfaces

// Railway environment detection
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production' || 
                 process.env.RAILWAY === 'true' ||
                 process.env.NODE_ENV === 'production';

console.log('🚄 Railway Environment detected:', isRailway);
console.log('🔧 Environment variables:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
  MONGO_URI_SET: !!process.env.MONGO_URI
});

// Debug network interfaces
console.log('🌐 Network interfaces:');
const interfaces = os.networkInterfaces();
Object.keys(interfaces).forEach(iface => {
  interfaces[iface].forEach(addr => {
    console.log(`  ${iface}: ${addr.address} (${addr.family})`);
  });
});

// Trust Railway's proxy for proper IP and protocol handling
app.set('trust proxy', 1);

// CORS configuration for Railway
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://distinct-stranger-production.up.railway.app',
      'https://stfrancis-1.onrender.com',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://localhost:5173',
      'https://127.0.0.1:5173'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.railway.app')) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(200).end();
});

// Body parsing middleware
app.use(express.json({ 
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '50mb',
  parameterLimit: 100000
}));

app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log('\n=== REQUEST LOG ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Origin:', req.headers.origin);
  console.log('Host:', req.headers.host);
  console.log('X-Forwarded-Proto:', req.headers['x-forwarded-proto']);
  console.log('X-Forwarded-Host:', req.headers['x-forwarded-host']);
  console.log('==================\n');
  next();
});

// Health check endpoints (critical for Railway)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    platform: 'railway',
    memory: process.memoryUsage(),
    node: process.version,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/ping', (req, res) => {
  res.json({ 
    message: 'pong', 
    timestamp: new Date().toISOString(),
    server: 'express',
    proxy: 'railway',
    port: PORT,
    host: HOST
  });
});

// Internal test endpoint for Railway networking
app.get('/internal-test', (req, res) => {
  res.json({
    server: 'running',
    port: PORT,
    host: HOST,
    containerHostname: os.hostname(),
    time: new Date().toISOString(),
    networkInterfaces: interfaces
  });
});

// Test endpoint to check server configuration
app.get('/api/config', (req, res) => {
  res.json({
    server: {
      port: PORT,
      host: HOST,
      environment: process.env.NODE_ENV,
      railway: isRailway,
      trustProxy: app.get('trust proxy')
    },
    headers: {
      host: req.headers.host,
      'x-forwarded-proto': req.headers['x-forwarded-proto'],
      'x-forwarded-host': req.headers['x-forwarded-host'],
      origin: req.headers.origin
    },
    time: new Date().toISOString()
  });
});

// Your routes
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/auth', authRoutes);
// ... add other routes here

// Database connection with retry logic for Railway
const connectDB = async (retries = 5, delay = 3000) => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    if (retries > 0) {
      console.log(`🔄 Retrying connection in ${delay}ms... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    } else {
      console.error('❌ Failed to connect to MongoDB after multiple attempts');
      // In production, we can continue without DB for health checks
      if (process.env.NODE_ENV === 'development') {
        process.exit(1);
      }
    }
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.name === 'MongoServerError') {
    return res.status(503).json({
      error: 'Database temporarily unavailable',
      message: 'Please try again later'
    });
  }
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    suggestion: 'Check /health for server status'
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    
    // Connect to DB (will retry automatically)
    await connectDB();
    
    const server = app.listen(PORT, HOST, () => {
      console.log('\n🎉 Server started successfully!');
      console.log(`📍 Listening on: ${HOST}:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚄 Railway: ${isRailway}`);
      console.log(`🔗 External URL: https://distinct-stranger-production.up.railway.app`);
      console.log(`🏥 Health check: /health`);
      console.log(`📊 Ready to accept requests...\n`);
    });

    // Railway-specific server settings
    server.keepAliveTimeout = 120000;
    server.headersTimeout = 120000;
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use`);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize server
startServer();
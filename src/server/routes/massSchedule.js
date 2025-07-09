import express from 'express';
import MassSchedule from '../models/MassSchedule.js';

const router = express.Router();

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Get mass schedule
router.get('/', async (req, res) => {
  console.log('GET request received for mass schedule');
  try {
    const schedule = await MassSchedule.findOne().sort({ createdAt: -1 }).lean();
    
    if (!schedule) {
      return res.json({
        sunday: [],
        weekday: [],
        confession: [],
        specialEvents: []
      });
    }
    
    res.json({
      sunday: schedule.sunday,
      weekday: schedule.weekday,
      confession: schedule.confession || [],
      specialEvents: schedule.specialEvents || []
    });
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update mass schedule
router.put('/', async (req, res) => {
  console.log('PUT request received for mass schedule');
  
  try {
    // Prepare data (no parsing needed since client sends objects)
    const scheduleData = {
      sunday: req.body.sunday || [],
      weekday: req.body.weekday || [],
      confession: req.body.confession || [],
      specialEvents: req.body.specialEvents || []
    };

    console.log('Processed schedule data:', JSON.stringify(scheduleData, null, 2));

    // Validate data types
    if (!Array.isArray(scheduleData.sunday)) {
      return res.status(400).json({ message: 'Sunday data must be an array' });
    }
    
    if (!Array.isArray(scheduleData.weekday)) {
      return res.status(400).json({ message: 'Weekday data must be an array' });
    }

    // Create a new document
    const newSchedule = new MassSchedule(scheduleData);
    
    // Validate the document
    const validationError = newSchedule.validateSync();
    if (validationError) {
      console.error('Validation error details:', validationError.errors);
      return res.status(400).json({
        message: 'Validation failed',
        error: validationError.message
      });
    }
    
    // Save the new document
    const savedSchedule = await newSchedule.save();
    console.log('Schedule saved to MongoDB:', savedSchedule._id);
    
    // Return only the necessary data
    res.json({
      sunday: savedSchedule.sunday,
      weekday: savedSchedule.weekday,
      confession: savedSchedule.confession,
      specialEvents: savedSchedule.specialEvents
    });
    
  } catch (error) {
    console.error('PUT error:', error);
    
    // Add detailed error logging
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
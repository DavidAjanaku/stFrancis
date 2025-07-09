import express from 'express';
import LiturgicalEvent from '../models/LiturgicalEvent.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all liturgical events
router.get('/', async (req, res) => {
  try {
    const events = await LiturgicalEvent.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured liturgical event
router.get('/featured', async (req, res) => {
  try {
    const today = new Date();
    
    // Find the next upcoming featured event
    const featuredEvent = await LiturgicalEvent.findOne({
      date: { $gte: today },
      isHighlight: true
    }).sort({ date: 1 });
    
    res.json(featuredEvent || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const events = await LiturgicalEvent.find({
      date: { $gte: today }
    })
    .sort({ date: 1 }) // Sort ascending (soonest first)
    .limit(12); // Maximum 12 events
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new liturgical event (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, date, description, liturgicalSeason, color, isHighlight } = req.body;
    
    const newEvent = new LiturgicalEvent({
      name,
      date,
      description,
      liturgicalSeason,
      color,
      isHighlight
    });
    
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Update liturgical event (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    
    const updatedEvent = await LiturgicalEvent.findByIdAndUpdate(
      id, 
      eventData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Delete liturgical event (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await LiturgicalEvent.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
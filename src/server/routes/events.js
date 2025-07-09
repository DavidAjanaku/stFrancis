// src/server/routes/events.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/events.json');

// Ensure data directory exists
const dataDir = path.dirname(dataPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default events
const defaultEvents = [
  {
    id: 1,
    title: "Parish Picnic",
    date: "2025-06-15",
    time: "12:00 PM - 4:00 PM",
    description: "Join us for our annual parish picnic with food, games, and fellowship for the whole family.",
    location: "Church Grounds",
    coordinator: "John Smith"
  },
  {
    id: 2,
    title: "Youth Retreat",
    date: "2025-06-22",
    time: "All Day",
    description: "A weekend retreat for young adults focusing on faith, friendship, and personal growth.",
    location: "Retreat Center",
    coordinator: "Sarah Johnson"
  }
];

// Helper function to read data
const readData = () => {
  try {
    // Create file if it doesn't exist
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify(defaultEvents, null, 2));
    }
    
    return JSON.parse(fs.readFileSync(dataPath));
  } catch (error) {
    return defaultEvents;
  }
};

// Helper function to write data
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

const router = express.Router();

// GET all events
router.get('/', (req, res) => {
  try {
    res.json(readData());
  } catch (error) {
    res.status(500).json({ message: 'Error reading events data' });
  }
});

// Create or update an event
router.post('/', (req, res) => {
  try {
    const events = readData();
    const newEvent = req.body;
    
    if (newEvent.id) {
      // Update existing event
      const index = events.findIndex(e => e.id === newEvent.id);
      if (index !== -1) {
        events[index] = newEvent;
      } else {
        events.push(newEvent);
      }
    } else {
      // Create new event
      newEvent.id = Date.now();
      events.push(newEvent);
    }
    
    writeData(events);
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error saving event' });
  }
});

// Update an event
router.put('/:id', (req, res) => {
  try {
    const events = readData();
    const updatedEvent = req.body;
    const index = events.findIndex(e => e.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    events[index] = { ...events[index], ...updatedEvent };
    writeData(events);
    res.json(events[index]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete an event
router.delete('/:id', (req, res) => {
  try {
    const events = readData();
    const filtered = events.filter(e => e.id !== parseInt(req.params.id));
    writeData(filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
});

export default router;
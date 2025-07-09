import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/aboutSection.json');

// Ensure directory exists
const dataDir = path.dirname(dataPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default data
const defaultData = {
  mainDescription: "St. Mary's Parish has been serving our community for over 75 years...",
  image: "https://blogger.googleusercontent.com/.../church.jpg"
};

// Helper function to read data
const readData = () => {
  try {
    // Create file if it doesn't exist
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2));
    }
    
    return JSON.parse(fs.readFileSync(dataPath));
  } catch (error) {
    return defaultData;
  }
};

// Helper function to write data
const writeData = (newData) => {
  const existingData = readData();
  
  // Merge existing data with new data
  const mergedData = { 
    ...existingData, 
    ...newData
  };
  
  // Ensure directory exists before writing
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(dataPath, JSON.stringify(mergedData, null, 2));
  return mergedData;
};

const router = express.Router();

// GET endpoint
router.get('/', (req, res) => {
  try {
    res.json(readData());
  } catch (error) {
    res.status(500).json({ message: 'Error reading data' });
  }
});

// PUT endpoint (handles partial updates)
router.put('/', (req, res) => {
  try {
    const updatedData = writeData(req.body);
    res.json(updatedData);
  } catch (error) {
    console.error('Write error:', error);
    res.status(500).json({ 
      message: 'Error writing data',
      error: error.message 
    });
  }
});

export default router;
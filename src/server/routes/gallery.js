import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../../data/gallery.json');
const uploadsDir = path.resolve(process.cwd(), 'src/data/uploads');

// Ensure directories exist
[path.dirname(dataPath), uploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    cb(null, ext && mime);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Default gallery data
const defaultGallery = [
  {
    id: "1",
    url: "/uploads/default1.jpg",
    title: "Sunday Mass",
    description: "Community gathering for Sunday service",
    category: "masses",
    dateAdded: "2025-01-15",
    isActive: true
  },
  {
    id: "2",
    url: "/uploads/default2.jpg",
    title: "Youth Ministry",
    description: "Youth group activities",
    category: "ministries",
    dateAdded: "2025-02-20",
    isActive: true
  }
];

// Helper functions
const readData = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify(defaultGallery, null, 2));
    }
    return JSON.parse(fs.readFileSync(dataPath));
  } catch (error) {
    console.error('Error reading gallery data:', error);
    return defaultGallery;
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

const router = express.Router();

// GET all gallery images
router.get('/', (req, res) => {
  try {
    const gallery = readData();
    res.json(gallery);
  } catch (error) {
    console.error('Error reading gallery data:', error);
    res.status(500).json({ message: 'Error reading gallery data' });
  }
});

// Upload image endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('No file received in upload');
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }
  
  // Return full URL for the image
  const fullUrl = `'https://distinct-stranger-production.up.railway.app/uploads/${req.file.filename}`;
  
  console.log('File uploaded successfully:', {
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    url: fullUrl
  });
  
  res.json({ 
    url: fullUrl,
    filename: req.file.filename
  });
});

// Create/update gallery item
router.post('/', (req, res) => {
  try {
    const gallery = readData();
    const newImage = req.body;
    
    if (!newImage.url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    if (newImage.id) {
      // Update existing image
      const index = gallery.findIndex(img => img.id === newImage.id);
      if (index !== -1) {
        gallery[index] = { ...gallery[index], ...newImage };
        writeData(gallery);
        return res.json(gallery[index]);
      }
      return res.status(404).json({ message: 'Image not found' });
    } else {
      // Create new image
      const imageWithId = {
        ...newImage,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString().split('T')[0],
        isActive: true
      };
      
      gallery.push(imageWithId);
      writeData(gallery);
      res.json(imageWithId);
    }
  } catch (error) {
    console.error('Error saving gallery image:', error);
    res.status(500).json({ message: 'Error saving gallery image' });
  }
});

// DELETE gallery item
router.delete('/:id', (req, res) => {
  try {
    const gallery = readData();
    const imageId = req.params.id;
    const image = gallery.find(img => img.id === imageId);
    
    if (!image) return res.status(404).json({ message: 'Image not found' });
    
    // Delete associated image file
    if (image.url.startsWith('/uploads/')) {
      const filename = image.url.split('/').pop();
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted image file:', filePath);
      }
    }
    
    const filtered = gallery.filter(img => img.id !== imageId);
    writeData(filtered);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

// Reorder gallery items
router.put('/reorder', (req, res) => {
  try {
    const newOrder = req.body;
    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ message: 'Invalid request format' });
    }
    
    writeData(newOrder);
    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering gallery:', error);
    res.status(500).json({ message: 'Error reordering gallery' });
  }
});

export default router;
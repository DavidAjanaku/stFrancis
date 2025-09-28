import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import DonationCategory from '../models/DonationCategory.js';
import HeroContent from '../models/HeroContent.js';
import { verifyToken as authMiddleware } from '../middleware/auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the same upload directory as defined in server.js
const uploadsDir = path.resolve(process.cwd(), 'uploads'); // Changed from 'src/data/uploads'
const altUploadsDir = path.resolve(process.cwd(), 'src/data/uploads'); // Keep as fallback

// Ensure uploads directory exists (both paths for compatibility)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

if (!fs.existsSync(altUploadsDir)) {
  fs.mkdirSync(altUploadsDir, { recursive: true });
  console.log('Created alternative uploads directory:', altUploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the main uploads directory
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'donation-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    cb(null, ext && mime);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();

// Get all donation categories (public)
router.get('/categories', async (req, res) => {
  try {
    const categories = await DonationCategory.find({ status: 'Active' });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching donation categories:', error);
    res.status(500).json({ message: 'Error fetching donation categories' });
  }
});

// Get hero content (public)
router.get('/hero', async (req, res) => {
  try {
    const heroContent = await HeroContent.getHeroContent();
    res.json(heroContent);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    res.status(500).json({ message: 'Error fetching hero content' });
  }
});

// Upload image endpoint
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('No file received in upload');
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  console.log('File uploaded successfully:', {
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    url: imageUrl,
  });

  // Also copy file to alternative location for compatibility
  try {
    const altFilePath = path.join(altUploadsDir, req.file.filename);
    fs.copyFileSync(req.file.path, altFilePath);
    console.log('File also copied to alternative location:', altFilePath);
  } catch (error) {
    console.warn('Warning: Could not copy file to alternative location:', error.message);
  }

  res.json({
    url: imageUrl,
    filename: req.file.filename,
  });
});

// Admin: Create a new donation category with image upload
router.post('/categories', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, bankName, accountNumber, accountName, theme, status } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Also copy file to alternative location for compatibility
    try {
      const altFilePath = path.join(altUploadsDir, req.file.filename);
      fs.copyFileSync(req.file.path, altFilePath);
      console.log('File also copied to alternative location:', altFilePath);
    } catch (error) {
      console.warn('Warning: Could not copy file to alternative location:', error.message);
    }

    const newCategory = new DonationCategory({
      title,
      image: imageUrl,
      bankName,
      accountNumber,
      accountName,
      theme,
      status,
    });
    
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating donation category:', error);
    
    // Clean up uploaded files if saving failed
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        const altFilePath = path.join(altUploadsDir, req.file.filename);
        if (fs.existsSync(altFilePath)) {
          fs.unlinkSync(altFilePath);
        }
      } catch (cleanupError) {
        console.warn('Warning: Could not clean up files after error:', cleanupError.message);
      }
    }
    
    res.status(500).json({ 
      message: 'Error creating donation category', 
      error: error.message 
    });
  }
});

// Admin: Update a donation category
router.put('/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await DonationCategory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Donation category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating donation category:', error);
    res.status(500).json({ message: 'Error updating donation category', error: error.message });
  }
});

// Admin: Delete a donation category
router.delete('/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await DonationCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Donation category not found' });
    }
    
    // Delete associated image file from both locations
    if (deletedCategory.image && deletedCategory.image.startsWith('/uploads/')) {
      const filename = deletedCategory.image.split('/').pop();
      
      // Delete from main uploads directory
      const mainFilePath = path.join(uploadsDir, filename);
      if (fs.existsSync(mainFilePath)) {
        fs.unlinkSync(mainFilePath);
        console.log('Deleted image file from main location:', mainFilePath);
      }
      
      // Delete from alternative uploads directory
      const altFilePath = path.join(altUploadsDir, filename);
      if (fs.existsSync(altFilePath)) {
        fs.unlinkSync(altFilePath);
        console.log('Deleted image file from alternative location:', altFilePath);
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting donation category:', error);
    res.status(500).json({ message: 'Error deleting donation category', error: error.message });
  }
});

// Admin: Update hero content
router.put('/hero', authMiddleware, async (req, res) => {
  try {
    const heroContent = await HeroContent.getHeroContent();
    const updatedHeroContent = await HeroContent.findByIdAndUpdate(heroContent._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedHeroContent);
  } catch (error) {
    console.error('Error updating hero content:', error);
    res.status(500).json({ message: 'Error updating hero content', error: error.message });
  }
});

export default router;
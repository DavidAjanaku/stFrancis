import express from 'express';
import multer from 'multer';
import path from 'path';
import HeroSlide from '../models/HeroSlide.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Configure storage for hero images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'src/data/uploads/hero');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `hero-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Get all hero slides
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all slides for admin
router.get('/admin', verifyToken, async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new hero slide
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, cta } = req.body;
    
    let imagePath = '/uploads/hero/default-hero.jpg'; // Default image
    
    if (req.file) {
      imagePath = `/uploads/hero/${req.file.filename}`;
    }

    // Get the max order value
    const maxOrderSlide = await HeroSlide.findOne().sort('-order');
    const newOrder = maxOrderSlide ? maxOrderSlide.order + 1 : 0;
    
    const newSlide = new HeroSlide({
      title,
      subtitle,
      description,
      image: imagePath,
      cta: JSON.parse(cta),
      order: newOrder
    });

    const savedSlide = await newSlide.save();
    res.status(201).json(savedSlide);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Update hero slide
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, cta } = req.body;
    
    // Handle both stringified and object formats for CTA
    let ctaData;
    if (typeof cta === 'string') {
      try {
        ctaData = JSON.parse(cta);
      } catch (parseError) {
        return res.status(400).json({ message: 'Invalid CTA format' });
      }
    } else {
      ctaData = cta;
    }
    
    const updateData = {
      title,
      subtitle,
      description,
      cta: ctaData
    };
    
    if (req.file) {
      updateData.image = `/uploads/hero/${req.file.filename}`;
    }
    
    const updatedSlide = await HeroSlide.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedSlide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    
    res.json(updatedSlide);
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete hero slide
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSlide = await HeroSlide.findByIdAndDelete(id);
    
    if (!deletedSlide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    
    // Reorder remaining slides
    await HeroSlide.updateMany(
      { order: { $gt: deletedSlide.order } },
      { $inc: { order: -1 } }
    );
    
    res.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update slide order
router.put('/order/update', verifyToken, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    
    const updateOperations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } }
      }
    }));
    
    await HeroSlide.bulkWrite(updateOperations);
    
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
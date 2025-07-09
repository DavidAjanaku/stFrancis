import express from 'express';
import DonationSection from '../models/PostSection.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all donation posts
router.get('/', async (req, res) => {
  try {
    const donationSections = await DonationSection.find().sort({ createdAt: -1 });
    res.json(donationSections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single donation post
router.get('/:id', async (req, res) => {
  try {
    const donationSection = await DonationSection.findById(req.params.id);
    if (!donationSection) {
      return res.status(404).json({ message: 'Donation section not found' });
    }
    res.json(donationSection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new donation post (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { header, paragraph, images } = req.body;
    
    // Validate input
    if (!header || !paragraph || !images || images.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure only one active image
    const activeImages = images.filter(img => img.isActive);
    if (activeImages.length > 1) {
      return res.status(400).json({ message: 'Only one image can be active' });
    }

    const newDonationSection = new DonationSection({
      header,
      paragraph,
      images
    });

    const savedSection = await newDonationSection.save();
    res.status(201).json(savedSection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update donation post (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { header, paragraph, images } = req.body;
    
    // Validate input
    if (!header || !paragraph || !images || images.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure only one active image
    const activeImages = images.filter(img => img.isActive);
    if (activeImages.length > 1) {
      return res.status(400).json({ message: 'Only one image can be active' });
    }

    const updatedSection = await DonationSection.findByIdAndUpdate(
      req.params.id,
      {
        header,
        paragraph,
        images,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return res.status(404).json({ message: 'Donation section not found' });
    }

    res.json(updatedSection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete donation post (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedSection = await DonationSection.findByIdAndDelete(req.params.id);
    
    if (!deletedSection) {
      return res.status(404).json({ message: 'Donation section not found' });
    }

    res.json({ message: 'Donation section deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
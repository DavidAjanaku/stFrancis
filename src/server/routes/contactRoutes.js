import express from 'express';
import Contact from '../models/Contact.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get contact information
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.getContactInfo();
    res.json({
      address: contact.address,
      phone: contact.phone,
      email: contact.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update contact information (Admin)
router.put('/', verifyToken, async (req, res) => {
  try {
    const { address, phone, email } = req.body;
    
    // Validate required fields
    if (!address || !phone || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get existing contact or create new one
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact();
    }

    // Update fields
    contact.address = address;
    contact.phone = phone;
    contact.email = email;

    await contact.save();
    
    res.json({
      message: 'Contact information updated successfully',
      contact: {
        address: contact.address,
        phone: contact.phone,
        email: contact.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
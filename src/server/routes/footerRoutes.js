import express from 'express';
import authenticate from '../middleware/authenticate.js';
import FooterSetting from '../models/FooterSetting.js';

const router = express.Router();

// GET footer settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await FooterSetting.getFooterSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update footer settings (admin protected)
router.put('/', authenticate, async (req, res) => {
  try {
    let settings = await FooterSetting.findOne();
    if (!settings) {
      settings = new FooterSetting();
    }

    // Update settings with request body
    settings.churchInfo = req.body.churchInfo || settings.churchInfo;
    settings.contactInfo = req.body.contactInfo || settings.contactInfo;
    settings.officeHours = req.body.officeHours || settings.officeHours;
    settings.massTimes = req.body.massTimes || settings.massTimes;
    settings.quickLinks = req.body.quickLinks || settings.quickLinks;
    settings.socialMedia = req.body.socialMedia || settings.socialMedia;

    await settings.save();

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
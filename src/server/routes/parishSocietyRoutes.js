import express from 'express';
import ParishSociety from '../models/ParishSociety.js';
import { verifyToken as authMiddleware } from '../middleware/auth.js';
import requestLogger from '../middleware/requestLogger.js';

const router = express.Router();

router.use(requestLogger);

// Get all societies (public)
router.get('/', async (req, res) => {
  try {
    const societies = await ParishSociety.find({}).sort({ name: 1 });
    console.log(`Fetched ${societies.length} societies`);
    res.json(societies);
  } catch (error) {
    console.error('Error fetching parish societies:', error);
    res.status(500).json({ 
      message: 'Error fetching parish societies',
      error: error.message 
    });
  }
});

// Get active societies (public)
router.get('/active', async (req, res) => {
  try {
    const societies = await ParishSociety.find({ isActive: true }).sort({ name: 1 });
    console.log(`Fetched ${societies.length} active societies`);
    res.json(societies);
  } catch (error) {
    console.error('Error fetching active societies:', error);
    res.status(500).json({ 
      message: 'Error fetching active societies',
      error: error.message 
    });
  }
});

// Admin: Create a new society
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Creating new society with data:', req.body);
    
    const newSociety = new ParishSociety(req.body);
    const validationError = newSociety.validateSync();
    
    if (validationError) {
      console.error('Validation Error:', validationError.errors);
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationError.errors
      });
    }
    
    await newSociety.save();
    console.log('Society created successfully:', newSociety);
    res.status(201).json(newSociety);
  } catch (error) {
    console.error('Error creating parish society:', error);
    res.status(500).json({ 
      message: 'Error creating parish society',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Admin: Update a society
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating society ${id} with data:`, req.body);
    
    const updatedSociety = await ParishSociety.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!updatedSociety) {
      console.error(`Society ${id} not found`);
      return res.status(404).json({ message: 'Society not found' });
    }
    
    console.log(`Society ${id} updated successfully`);
    res.json(updatedSociety);
  } catch (error) {
    console.error('Error updating society:', error);
    res.status(500).json({ 
      message: 'Error updating society',
      error: error.message 
    });
  }
});

// Admin: Delete a society
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting society ${id}`);
    
    const deletedSociety = await ParishSociety.findByIdAndDelete(id);
    if (!deletedSociety) {
      console.error(`Society ${id} not found`);
      return res.status(404).json({ message: 'Society not found' });
    }
    
    console.log(`Society ${id} deleted successfully`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting society:', error);
    res.status(500).json({ 
      message: 'Error deleting society',
      error: error.message 
    });
  }
});

// Admin: Toggle society status
router.patch('/:id/toggle-status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Toggling status for society ${id}`);
    
    const society = await ParishSociety.findById(id);
    if (!society) {
      console.error(`Society ${id} not found`);
      return res.status(404).json({ message: 'Society not found' });
    }
    
    society.isActive = !society.isActive;
    await society.save();
    
    console.log(`Society ${id} status toggled to ${society.isActive}`);
    res.json(society);
  } catch (error) {
    console.error('Error toggling society status:', error);
    res.status(500).json({ 
      message: 'Error toggling society status',
      error: error.message 
    });
  }
});

// Admin: Bulk update societies
router.post('/bulk-update', authMiddleware, async (req, res) => {
  try {
    const { ids, updates } = req.body;
    console.log(`Bulk updating ${ids.length} societies with:`, updates);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      console.error('Invalid society IDs provided for bulk update');
      return res.status(400).json({ message: 'Invalid society IDs provided' });
    }

    const result = await ParishSociety.updateMany(
      { _id: { $in: ids } },
      updates,
      { runValidators: true }
    );

    console.log(`Bulk update affected ${result.modifiedCount} societies`);
    res.json({
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({ 
      message: 'Error in bulk update',
      error: error.message 
    });
  }
});

// Admin: Bulk delete societies
router.post('/bulk-delete', authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    console.log(`Bulk deleting ${ids.length} societies`);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      console.error('Invalid society IDs provided for bulk delete');
      return res.status(400).json({ message: 'Invalid society IDs provided' });
    }

    const result = await ParishSociety.deleteMany({ _id: { $in: ids } });

    console.log(`Bulk delete removed ${result.deletedCount} societies`);
    res.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    res.status(500).json({ 
      message: 'Error in bulk delete',
      error: error.message 
    });
  }
});

export default router;
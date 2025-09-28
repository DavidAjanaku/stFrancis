import mongoose from 'mongoose';

const donationCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },
  accountName: {
    type: String,
    required: true,
    trim: true,
  },
  theme: {
    type: String,
    required: true,
    enum: ['brown', 'harvest', 'building'], // Restrict to specific themes
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

// Make sure to export as default
export default mongoose.model('DonationCategory', donationCategorySchema);
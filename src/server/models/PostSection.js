import mongoose from 'mongoose';

const donationSectionSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true
  },
  paragraph: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: "Donation image"
    },
    isActive: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
donationSectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('DonationSection', donationSectionSchema);
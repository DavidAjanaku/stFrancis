import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  cta: {
    primary: {
      text: {
        type: String,
        required: true
      },
      link: {
        type: String,
        required: true
      }
    },
    secondary: {
      text: {
        type: String,
        required: true
      },
      link: {
        type: String,
        required: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('HeroSlide', heroSlideSchema);
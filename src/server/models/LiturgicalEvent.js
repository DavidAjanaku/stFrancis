import mongoose from 'mongoose';

const liturgicalEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  liturgicalSeason: {
    type: String,
    required: true,
    enum: ['Advent', 'Christmas', 'Lent', 'Easter', 'Ordinary Time']
  },
  color: {
    type: String,
    required: true,
    enum: ['green', 'purple', 'white', 'red', 'rose']
  },
  isHighlight: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('LiturgicalEvent', liturgicalEventSchema);
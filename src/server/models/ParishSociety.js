import mongoose from 'mongoose';

const parishSocietySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Society name is required'],
    trim: true,
    minlength: [3, 'Society name must be at least 3 characters long']
  },
  howToJoin: {
    type: String,
    required: [true, 'How to join information is required'],
    minlength: [10, 'How to join information must be at least 10 characters long']
  },
  meetingDate: {
    type: String,
    required: [true, 'Meeting date is required'],
    minlength: [3, 'Meeting date must be at least 3 characters long']
  },
  meetingTime: {
    type: String,
    required: [true, 'Meeting time is required'],
    minlength: [3, 'Meeting time must be at least 3 characters long']
  },
  coordinator: {
    type: String,
    required: [true, 'Coordinator name is required'],
    minlength: [3, 'Coordinator name must be at least 3 characters long']
  },
  contacts: [{
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      minlength: [2, 'Contact name must be at least 2 characters long']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      minlength: [6, 'Phone number must be at least 6 characters long']
    }
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update lastUpdated on save
parishSocietySchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Add text index for searching
parishSocietySchema.index({
  name: 'text',
  coordinator: 'text',
  'contacts.name': 'text'
});

const ParishSociety = mongoose.model('ParishSociety', parishSocietySchema);

export default ParishSociety;
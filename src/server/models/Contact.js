import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    default: '123 Church Street, Anytown, ST 12345'
  },
  phone: {
    type: String,
    required: true,
    default: '(555) 123-4567'
  },
  email: {
    type: String,
    required: true,
    default: 'info@stmarysparish.org'
  }
}, {
  timestamps: true,
  // Ensure only one contact document exists
  minimize: false,
  versionKey: false
});

// Static method to get the single contact document
contactSchema.statics.getContactInfo = async function() {
  let contact = await this.findOne();
  if (!contact) {
    contact = await this.create({});
  }
  return contact;
};

export default mongoose.model('Contact', contactSchema);
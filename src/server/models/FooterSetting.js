import mongoose from 'mongoose';

const footerSettingSchema = new mongoose.Schema({
  // Church Information
  churchInfo: {
    name: { type: String, default: 'St. Francis Catholic Church' },
    location: { type: String, default: 'Oregun, Lagos' },
    description: { 
      type: String, 
      default: 'A vibrant Catholic community committed to worship, fellowship, and service to God and our neighbors.' 
    },
    logo: { type: String, default: '✚' }
  },
  
  // Contact Information
  contactInfo: {
    address: {
      street: { type: String, default: '123 Church Street' },
      city: { type: String, default: 'Oregun, Lagos State' },
      country: { type: String, default: 'Nigeria' }
    },
    phone: { type: String, default: '+234 xxx xxx xxxx' },
    email: { type: String, default: 'info@stfrancisoregun.org' },
    whatsapp: { type: Boolean, default: true }
  },
  
  // Office Hours
  officeHours: {
    weekdays: { type: String, default: '9:00 AM - 4:00 PM' },
    saturday: { type: String, default: '9:00 AM - 2:00 PM' },
    sunday: { type: String, default: 'After Mass' }
  },
  
  // Mass Times
  massTimes: [{
    day: String,
    times: String
  }],
  
  // Quick Links
  quickLinks: [{
    name: String,
    url: String
  }],
  
  // Social Media
  socialMedia: {
    facebook: {
      enabled: { type: Boolean, default: true },
      url: { type: String, default: '#' }
    },
    instagram: {
      enabled: { type: Boolean, default: true },
      url: { type: String, default: '#' }
    },
    youtube: {
      enabled: { type: Boolean, default: true },
      url: { type: String, default: '#' }
    }
  }
}, {
  timestamps: true,
  minimize: false
});

// Ensure only one document exists
footerSettingSchema.statics.getFooterSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      massTimes: [
        { day: 'Sunday', times: '7:00 AM, 9:00 AM, 11:00 AM' },
        { day: 'Weekdays', times: '6:30 AM, 12:00 PM' },
        { day: 'Saturday Vigil', times: '6:00 PM' }
      ],
      quickLinks: [
        { name: 'About Us', url: '/about' },
        // ... other default links
      ]
    });
  }
  return settings;
};

export default mongoose.model('FooterSetting', footerSettingSchema);
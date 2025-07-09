import mongoose from 'mongoose';

const aboutSectionSchema = new mongoose.Schema({
  mainDescription: String,
  image: String
}, { timestamps: true });

const AboutSection = mongoose.model('AboutSection', aboutSectionSchema);
export default AboutSection;
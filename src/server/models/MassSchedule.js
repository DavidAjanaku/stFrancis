import mongoose from 'mongoose';

// Define sub-schemas for each schedule type
const sundayMassSchema = new mongoose.Schema({
  time: String,
  type: String,
  language: String,
  special: String
}, { _id: false }); // Prevent unnecessary IDs

const weekdayMassSchema = new mongoose.Schema({
  day: String,
  time: String,
  type: String
}, { _id: false });

const confessionSchema = new mongoose.Schema({
  day: String,
  time: String
}, { _id: false });

const specialEventSchema = new mongoose.Schema({
  name: String,
  time: String
}, { _id: false });

// Main schema
const massScheduleSchema = new mongoose.Schema({
  sunday: [sundayMassSchema],
  weekday: [weekdayMassSchema],
  confession: [confessionSchema],
  specialEvents: [specialEventSchema]
}, {
  versionKey: false, // Remove __v field
  minimize: false, // Return empty arrays
  timestamps: true // Add createdAt and updatedAt
});

export default mongoose.model('MassSchedule', massScheduleSchema);
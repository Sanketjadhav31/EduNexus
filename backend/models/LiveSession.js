import mongoose from 'mongoose';

const liveSessionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  meetingLink: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

export default mongoose.model('LiveSession', liveSessionSchema);

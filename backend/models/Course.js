import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String },
  lectures: [{
    title: String,
    videoUrl: String,
    duration: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  assignments: [{
    title: String,
    description: String,
    fileUrl: String,
    dueDate: Date,
    uploadedAt: { type: Date, default: Date.now }
  }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);

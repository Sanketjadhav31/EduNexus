import express from 'express';
import Submission from '../models/Submission.js';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';
import cloudinary, { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', authenticate, authorize('student'), upload.single('file'), async (req, res) => {
  try {
    const { assignmentId, courseId } = req.body;

    if (!assignmentId || !courseId) {
      return res.status(400).json({ message: 'Assignment ID and Course ID are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    let fileUrl = req.body.fileUrl;

    // Handle file upload
    if (req.file) {
      console.log('Uploading submission to Cloudinary...');
      try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          resource_type: 'auto',
          folder: 'edunexus/submissions'
        });
        
        fileUrl = result.secure_url;
        console.log('Submission uploaded successfully:', fileUrl);
      } catch (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).json({ 
          message: 'File upload failed. Please check your internet connection and try again.'
        });
      }
    }

    if (!fileUrl) {
      return res.status(400).json({ message: 'File is required' });
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      course: courseId,
      student: req.user._id,
      fileUrl
    });

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('student', 'name email')
      .populate('course', 'title');

    res.status(201).json(populatedSubmission);
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: error.message || 'Failed to create submission' });
  }
});

router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let query = { course: req.params.courseId };

    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const submissions = await Submission.find(query)
      .populate('student', 'name email')
      .populate('course', 'title');

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/grade', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findById(req.params.id).populate('course');

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    if (req.user.role !== 'admin' && submission.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

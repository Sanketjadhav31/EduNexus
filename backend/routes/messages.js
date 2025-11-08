import express from 'express';
import Message from '../models/Message.js';
import Course from '../models/Course.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const isEnrolled = course.enrolledStudents.includes(req.user._id);
    const isInstructor = course.instructor.toString() === req.user._id.toString();
    
    if (!isEnrolled && !isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ course: req.params.courseId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/course/:courseId', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const isEnrolled = course.enrolledStudents.includes(req.user._id);
    const isInstructor = course.instructor.toString() === req.user._id.toString();
    
    if (!isEnrolled && !isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      course: req.params.courseId,
      sender: req.user._id,
      content: req.body.content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

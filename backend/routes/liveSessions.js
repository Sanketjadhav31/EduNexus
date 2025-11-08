import express from 'express';
import LiveSession from '../models/LiveSession.js';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const sessions = await LiveSession.find({ course: req.params.courseId })
      .populate('instructor', 'name email')
      .sort({ scheduledAt: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId, title, description, scheduledAt, duration, meetingLink } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const session = await LiveSession.create({
      course: courseId,
      title,
      description,
      scheduledAt,
      duration,
      meetingLink,
      instructor: req.user._id
    });

    const populatedSession = await LiveSession.findById(session._id)
      .populate('instructor', 'name email');

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id).populate('course');
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (req.user.role !== 'admin' && session.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(session, req.body);
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (req.user.role !== 'admin' && session.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await session.deleteOne();
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

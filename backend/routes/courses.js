import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';
import cloudinary, { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;
    const course = await Course.create({
      title,
      description,
      thumbnail,
      instructor: req.user._id
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/enroll', authenticate, authorize('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id }
    });

    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add lecture
router.post('/:id/lectures', authenticate, authorize('instructor', 'admin'), upload.single('video'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let videoUrl = req.body.videoUrl;

    // Handle video file upload
    if (req.file) {
      console.log('Uploading video to Cloudinary...');
      try {
        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          resource_type: 'video',
          folder: 'edunexus/lectures',
          chunk_size: 6000000
        });

        videoUrl = result.secure_url;
        console.log('Video uploaded successfully:', videoUrl);
      } catch (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).json({
          message: 'Video upload failed. Please check Cloudinary credentials or use YouTube URL instead.'
        });
      }
    }

    if (!videoUrl) {
      return res.status(400).json({ message: 'Video URL or file is required' });
    }

    course.lectures.push({
      title: req.body.title,
      videoUrl,
      duration: req.body.duration || 'N/A'
    });

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Add lecture error:', error);
    res.status(500).json({ message: error.message || 'Failed to add lecture' });
  }
});

// Delete lecture
router.delete('/:id/lectures/:lectureId', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    course.lectures = course.lectures.filter(l => l._id.toString() !== req.params.lectureId);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add assignment
router.post('/:id/assignments', authenticate, authorize('instructor', 'admin'), upload.single('file'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let fileUrl = req.body.fileUrl;

    // Handle file upload
    if (req.file) {
      console.log('Uploading assignment file to Cloudinary...');
      try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          resource_type: 'auto',
          folder: 'edunexus/assignments'
        });

        fileUrl = result.secure_url;
        console.log('File uploaded successfully:', fileUrl);
      } catch (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).json({
          message: 'File upload failed. Please check Cloudinary credentials or use URL instead.'
        });
      }
    }

    course.assignments.push({
      title: req.body.title,
      description: req.body.description || '',
      fileUrl: fileUrl || '',
      dueDate: req.body.dueDate
    });

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Add assignment error:', error);
    res.status(500).json({ message: error.message || 'Failed to add assignment' });
  }
});

// Delete assignment
router.delete('/:id/assignments/:assignmentId', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    course.assignments = course.assignments.filter(a => a._id.toString() !== req.params.assignmentId);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

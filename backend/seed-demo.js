import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import Submission from './models/Submission.js';

dotenv.config();

const seedDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Submission.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const instructor = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'instructor@demo.com',
      password: 'password123',
      role: 'instructor'
    });

    const student1 = await User.create({
      name: 'John Smith',
      email: 'student1@demo.com',
      password: 'password123',
      role: 'student'
    });

    const student2 = await User.create({
      name: 'Emily Davis',
      email: 'student2@demo.com',
      password: 'password123',
      role: 'student'
    });

    const student3 = await User.create({
      name: 'Michael Brown',
      email: 'student3@demo.com',
      password: 'password123',
      role: 'student'
    });

    console.log('Created users');

    // Create course with lectures and assignments
    const course = await Course.create({
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of HTML, CSS, JavaScript, and modern web development practices.',
      instructor: instructor._id,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      lectures: [
        {
          title: 'Introduction to HTML',
          videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
          duration: '45 min'
        },
        {
          title: 'CSS Styling Basics',
          videoUrl: 'https://www.youtube.com/watch?v=1PnVor36_40',
          duration: '60 min'
        },
        {
          title: 'JavaScript Fundamentals',
          videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
          duration: '90 min'
        },
        {
          title: 'Responsive Design',
          videoUrl: 'https://www.youtube.com/watch?v=srvUrASNj0s',
          duration: '50 min'
        }
      ],
      assignments: [
        {
          title: 'Build a Personal Portfolio',
          description: 'Create a responsive personal portfolio website using HTML and CSS. Include sections for About, Projects, and Contact.',
          fileUrl: 'https://example.com/assignment1.pdf',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        },
        {
          title: 'JavaScript Calculator',
          description: 'Build a functional calculator using JavaScript. It should handle basic operations: addition, subtraction, multiplication, and division.',
          fileUrl: 'https://example.com/assignment2.pdf',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
        },
        {
          title: 'Responsive Landing Page',
          description: 'Design and develop a responsive landing page for a fictional product. Use CSS Grid or Flexbox for layout.',
          fileUrl: 'https://example.com/assignment3.pdf',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago (overdue)
        }
      ],
      enrolledStudents: [student1._id, student2._id, student3._id]
    });

    // Update students' enrolled courses
    await User.updateMany(
      { _id: { $in: [student1._id, student2._id, student3._id] } },
      { $push: { enrolledCourses: course._id } }
    );

    console.log('Created course with lectures and assignments');

    // Create submissions
    const submissions = await Submission.create([
      {
        student: student1._id,
        course: course._id,
        assignment: course.assignments[0]._id,
        fileUrl: 'https://github.com/johnsmith/portfolio',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        grade: 95,
        feedback: 'Excellent work! Great design and clean code.'
      },
      {
        student: student2._id,
        course: course._id,
        assignment: course.assignments[0]._id,
        fileUrl: 'https://github.com/emilydavis/my-portfolio',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        grade: 88,
        feedback: 'Good job! Consider improving mobile responsiveness.'
      },
      {
        student: student1._id,
        course: course._id,
        assignment: course.assignments[2]._id,
        fileUrl: 'https://github.com/johnsmith/landing-page',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        // Not graded yet
      },
      {
        student: student3._id,
        course: course._id,
        assignment: course.assignments[2]._id,
        fileUrl: 'https://codepen.io/michaelbrown/landing-page',
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        grade: 92,
        feedback: 'Very creative design! Well done.'
      }
    ]);

    console.log('Created submissions');

    console.log('\n=== DEMO DATA CREATED ===');
    console.log('\nLogin Credentials:');
    console.log('\nInstructor:');
    console.log('  Email: instructor@demo.com');
    console.log('  Password: password123');
    console.log('\nStudents:');
    console.log('  Email: student1@demo.com | Password: password123');
    console.log('  Email: student2@demo.com | Password: password123');
    console.log('  Email: student3@demo.com | Password: password123');
    console.log('\nCourse: Web Development Fundamentals');
    console.log('  - 4 Lectures with video links');
    console.log('  - 3 Assignments (1 overdue)');
    console.log('  - 4 Student submissions (3 graded, 1 pending)');
    console.log('\n========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo data:', error);
    process.exit(1);
  }
};

seedDemo();

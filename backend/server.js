import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import submissionRoutes from './routes/submissions.js';
import adminRoutes from './routes/admin.js';
import messageRoutes from './routes/messages.js';
import liveSessionRoutes from './routes/liveSessions.js';
import Message from './models/Message.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://edunexus.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/live-sessions', liveSessionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EduNexus API is running' });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);

  socket.on('join-course', (courseId) => {
    socket.join(`course-${courseId}`);
    console.log(`User ${socket.userId} joined course ${courseId}`);
  });

  socket.on('send-message', async (data) => {
    try {
      const message = await Message.create({
        course: data.courseId,
        sender: socket.userId,
        content: data.content
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name role');

      io.to(`course-${data.courseId}`).emit('new-message', populatedMessage);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

# 🎓 EduNexus - Complete Learning Management System

## 🚀 Quick Start

### Setup & Run
```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Configure environment
# Copy .env.example to .env in both folders
# Update MongoDB URI and Cloudinary credentials

# 3. Seed demo data
cd backend && node seed-demo.js

# 4. Start application
npm start
# Or use: setup-demo.bat (Windows)
```

### Demo Accounts
**Instructor:** instructor@demo.com / password123  
**Students:** student1@demo.com / password123

---

## 📚 Complete Features

### 1. **Lectures** 📹
- **Upload:** Video files OR paste YouTube/Vimeo URLs
- **Watch:** Embedded video player with full controls
- **Manage:** Add/delete lectures (instructors only)
- **Progress:** Real-time upload progress with percentage
- **Support:** MP4, AVI, MOV, YouTube, Vimeo

### 2. **Assignments** 📝
- **Create:** Title, description, due date, file attachment
- **Upload:** PDF, DOC, DOCX, TXT, ZIP files OR URLs
- **Due Dates:** Automatic overdue detection (red highlight)
- **Download:** Students download assignment files
- **Progress:** Upload progress indicator

### 3. **Submissions** 📤
- **Submit:** Students upload files or paste URLs
- **Track:** View submission status and history
- **Grade:** Instructors grade 0-100 with feedback
- **Progress:** Real-time upload tracking
- **Status:** Graded/Pending indicators

### 4. **Live Sessions** 🎥
- **Create:** Instructors schedule live classes
- **Join:** Students join with meeting links
- **Manage:** Start/end sessions, view participants

### 5. **Chat** 💬
- **Real-time:** Socket.io powered messaging
- **Course-based:** Separate chat for each course
- **Participants:** All enrolled students + instructor

### 6. **User Management** 👥
- **Roles:** Admin, Instructor, Student
- **Authentication:** JWT-based secure login
- **Registration:** Email validation
- **Dashboard:** Role-specific views

### 7. **Course Management** 📖
- **Create:** Instructors create courses
- **Enroll:** Students enroll in courses
- **Edit:** Update course details, thumbnail
- **Delete:** Remove courses (instructor/admin)

### 8. **Admin Panel** ⚙️
- **Users:** View/manage all users
- **Courses:** Oversee all courses
- **Analytics:** User and course statistics

---

## 🎨 Upload System

### Unified Upload Interface
All uploads use the same clean design:

```
┌─────────────────────────────────────┐
│ 📤 Upload Video or File:            │
├─────────────────────────────────────┤
│ [Choose File]                       │
│ ✓ Selected: video.mp4 (25.5 MB)    │
│                                     │
│              OR                     │
│                                     │
│ 🔗 Paste Video URL                  │
│ [________________________]          │
└─────────────────────────────────────┘
```

### Progress Indicator
Floating card shows:
- Upload type (Lecture/Assignment/Submission)
- Animated progress bar
- Percentage (0-100%)
- Warning message

### Supported Files
- **Videos:** MP4, AVI, MOV, WebM
- **Documents:** PDF, DOC, DOCX, TXT
- **Archives:** ZIP
- **URLs:** YouTube, Vimeo, Google Drive, GitHub

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Axios (API calls)
- Socket.io-client (real-time)
- React Router (navigation)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (authentication)
- Socket.io (WebSocket)
- Multer (file handling)

**Storage:**
- Cloudinary (videos, files)
- MongoDB (data)

---

## 📊 Demo Data

### Course: Web Development Fundamentals
- **Instructor:** Dr. Sarah Johnson
- **Students:** 3 enrolled
- **Lectures:** 4 video lectures
- **Assignments:** 3 (1 overdue)
- **Submissions:** 4 (3 graded, 1 pending)

### Lectures:
1. Introduction to HTML (45 min)
2. CSS Styling Basics (60 min)
3. JavaScript Fundamentals (90 min)
4. Responsive Design (50 min)

### Assignments:
1. Build a Personal Portfolio (Due in 7 days)
2. JavaScript Calculator (Due in 14 days)
3. Responsive Landing Page (⚠️ Overdue)

---

## 🎯 User Workflows

### Instructor Workflow:
1. Login → Dashboard
2. Create/Edit Course
3. Add Lectures (upload video or URL)
4. Add Assignments (upload file or URL)
5. View Student Submissions
6. Grade Submissions with Feedback
7. Start Live Sessions
8. Chat with Students

### Student Workflow:
1. Login → Dashboard
2. Browse/Enroll in Courses
3. Watch Lecture Videos
4. Download Assignment Files
5. Submit Assignments (upload or URL)
6. View Grades & Feedback
7. Join Live Sessions
8. Chat with Classmates

---

## 🔐 Security

- JWT token authentication
- Password hashing (bcrypt)
- Role-based access control
- Protected API routes
- Secure file uploads
- Environment variables

---

## 📱 UI Features

✅ Responsive design (mobile-friendly)  
✅ Clean, modern interface  
✅ Real-time updates  
✅ Progress indicators  
✅ Color-coded status  
✅ Intuitive navigation  
✅ Error handling  
✅ Loading states

---

## 🐛 Error Handling

### Frontend:
- User-friendly error messages
- Console logging for debugging
- Form validation
- Network error handling

### Backend:
- Detailed error responses
- Console logging
- Validation checks
- Timeout handling (120s files, 300s videos)

---

## 📂 Project Structure

```
edunexus/
├── backend/
│   ├── config/         # DB, Cloudinary
│   ├── models/         # User, Course, Submission, Message
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, validation
│   ├── server.js       # Express + Socket.io
│   └── seed-demo.js    # Demo data
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Main pages
│   │   ├── context/    # Auth context
│   │   └── App.jsx     # Main app
│   └── index.html
└── package.json
```

---

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### Test Scenarios:

**1. Upload Small File (<5MB)**
- Fast upload, smooth progress

**2. Upload Large Video (>50MB)**
- Extended timeout, incremental progress

**3. Submit Assignment**
- File upload with progress tracking

**4. Grade Submission**
- Instructor grades with feedback

**5. Live Session**
- Create, join, manage sessions

**6. Real-time Chat**
- Send/receive messages instantly

---

## 📈 Performance

- **File Size Limit:** 100MB recommended
- **Video Timeout:** 5 minutes
- **File Timeout:** 2 minutes
- **Chunk Size:** 6MB (videos)
- **Progress Updates:** Real-time

---

## 🎓 Key Highlights

✅ **Complete LMS** - All essential features  
✅ **Real-time** - Chat & live sessions  
✅ **File Management** - Videos, documents, submissions  
✅ **Progress Tracking** - Visual upload indicators  
✅ **Grading System** - Scores & feedback  
✅ **Role-based** - Admin, Instructor, Student  
✅ **Modern UI** - Clean, responsive design  
✅ **Production Ready** - Error handling, security

---

## 🚀 Deployment

### Requirements:
- Node.js 16+
- MongoDB Atlas account
- Cloudinary account
- Hosting (Heroku, Vercel, Railway)

### Steps:
1. Set environment variables
2. Build frontend: `npm run build`
3. Deploy backend to hosting
4. Deploy frontend to CDN
5. Update CORS settings

---

## 📞 Support

**Issues?**
- Check MongoDB connection
- Verify Cloudinary credentials
- Ensure ports 5000 & 5173 are free
- Check console for errors

**Need Help?**
- Review error messages
- Check network tab
- Verify file sizes
- Test with demo accounts

---

## 🎉 Ready to Use!

```bash
# Quick start
setup-demo.bat

# Or manual
npm run seed-demo
npm start
```

**Login:** instructor@demo.com / password123  
**Explore:** Lectures, Assignments, Submissions, Chat, Live Sessions

---

**Built with ❤️ using MERN Stack**

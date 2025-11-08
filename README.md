# 🎓 EduNexus - Learning Management System

A complete MERN stack Learning Management System with real-time features.

## 🌐 Live Demo

**🚀 [Visit Live Application](http://projectaapp.netlify.app/login)**

### Quick Login:
- **👨‍🏫 Instructor:** instructor@demo.com / password123
- **👨‍🎓 Student:** student1@demo.com / password123

---

## ✨ Features

- 👨‍🏫 **Instructor Dashboard** - Create courses, add lectures, assignments
- 👨‍🎓 **Student Portal** - Enroll in courses, submit assignments, view grades
- 📹 **Video Lectures** - Upload videos or use YouTube/Vimeo URLs
- 📝 **Assignments** - Create assignments with due dates and file attachments
- 📤 **Submissions** - Students submit work, instructors grade with feedback
- 💬 **Real-time Chat** - Course-based messaging with Socket.io
- 🎥 **Live Sessions** - Schedule and manage virtual classes
- 🔐 **Authentication** - JWT-based secure login system
- ☁️ **Cloud Storage** - Cloudinary integration for file uploads

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sanketjadhav31/EduNexus.git
cd EduNexus
```

2. **Install dependencies**
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. **Configure environment variables**

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Seed demo data**
```bash
cd backend
node seed-demo.js
```

5. **Start the application**
```bash
# From root directory
npm start
```

Or use `setup-demo.bat` on Windows for automated setup.

## 🎯 Demo Accounts

### Instructor
- **Email:** instructor@demo.com
- **Password:** password123

### Students
- **Email:** student1@demo.com
- **Password:** password123

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Axios
- Socket.io-client
- React Router

**Backend:**
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io
- Cloudinary
- Multer

## 📂 Project Structure

```
edunexus/
├── backend/
│   ├── config/         # Database & Cloudinary config
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # Auth context
│   │   └── App.jsx     # Main app
│   └── index.html
└── package.json
```

## 🎨 Key Features Explained

### For Instructors:
- Create and manage courses
- Upload video lectures (file or YouTube URL)
- Create assignments with due dates
- Grade student submissions with feedback
- View enrolled students
- Real-time chat with students

### For Students:
- Browse and enroll in courses
- Watch video lectures
- Download assignment files
- Submit assignments
- View grades and feedback
- Chat with instructors and peers

## 📱 Screenshots

Login page includes demo account buttons for easy testing.

## 🔧 Configuration

### Cloudinary Setup
1. Create account at https://cloudinary.com
2. Get your credentials from dashboard
3. Add to `backend/.env`

### MongoDB Setup
1. Create MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Add to `backend/.env`

## 🚀 Deployment

The application can be deployed to:
- **Backend:** Heroku, Railway, Render
- **Frontend:** Vercel, Netlify
- **Database:** MongoDB Atlas

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Sanket Jadhav

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using MERN Stack**

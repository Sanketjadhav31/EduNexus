import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';

function Dashboard() {
  const { user, API_URL } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/courses`);
      
      const userId = user.id || user._id;
      
      if (user.role === 'student') {
        setCourses(data.filter(c => c.enrolledStudents.some(s => {
          const studentId = s._id || s.id || s;
          return studentId === userId;
        })));
      } else if (user.role === 'instructor') {
        setCourses(data.filter(c => {
          const instructorId = c.instructor._id || c.instructor.id;
          return instructorId === userId;
        }));
      } else {
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>
    </div>
  );

  return (
    <div className="container">
      <h2>Welcome, {user.name}!</h2>
      <p>Role: {user.role}</p>
      
      <h3 style={{ marginTop: '30px' }}>
        {user.role === 'student' ? 'My Enrolled Courses' : 
         user.role === 'instructor' ? 'My Courses' : 'All Courses'}
      </h3>
      
      {courses.length === 0 ? (
        <div className="card">
          <p>No courses found.</p>
          {user.role === 'student' && (
            <Link to="/courses">
              <button className="btn btn-primary">Browse Courses</button>
            </Link>
          )}
          {user.role === 'instructor' && (
            <Link to="/create-course">
              <button className="btn btn-primary">Create Your First Course</button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid">
          {courses.map(course => (
            <div key={course._id}>
              <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                  {course.thumbnail && (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      style={{ 
                        width: '100%', 
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '5px',
                        marginBottom: '15px'
                      }} 
                    />
                  )}
                  <h3>{course.title}</h3>
                  <p style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {course.description}
                  </p>
                  <p><strong>Instructor:</strong> {course.instructor.name}</p>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    <span>📚 {course.lectures?.length || 0} Lectures</span>
                    <span>📝 {course.assignments?.length || 0} Assignments</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';

function Courses() {
  const { user, API_URL } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/courses`);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`${API_URL}/courses/${courseId}/enroll`);
      alert('Enrolled successfully!');
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || 'Enrollment failed');
    }
  };

  if (loading) return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '50px' }}>Loading courses...</div>
    </div>
  );

  return (
    <div className="container">
      <h2>All Courses</h2>
      {courses.length === 0 ? (
        <p>No courses available yet.</p>
      ) : (
        <div className="grid">
          {courses.map(course => (
            <CourseCard 
              key={course._id} 
              course={course} 
              user={user}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;

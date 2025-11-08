import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const { API_URL } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/users`);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/stats`);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? All their data will be removed.')) return;
    
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`);
      fetchUsers();
      fetchStats();
      alert('User deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(`${API_URL}/courses/${courseId}`);
      alert('Course deleted successfully');
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete course');
    }
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      
      {stats && (
        <div className="grid" style={{ marginBottom: '30px' }}>
          <div className="card">
            <h3>Total Users</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
          </div>
          <div className="card">
            <h3>Total Courses</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalCourses}</p>
          </div>
          <div className="card">
            <h3>Total Submissions</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalSubmissions}</p>
          </div>
        </div>
      )}

      <div className="card">
        <h3>All Users</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Enrolled Courses</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{user.name}</td>
                  <td style={{ padding: '10px' }}>{user.email}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: user.role === 'admin' ? '#ef4444' : user.role === 'instructor' ? '#3b82f6' : '#10b981',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>{user.enrolledCourses?.length || 0}</td>
                  <td style={{ padding: '10px' }}>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDeleteUser(user._id)}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>All Courses</h3>
        <CoursesTable onDelete={handleDeleteCourse} />
      </div>
    </div>
  );
}

function CoursesTable({ onDelete }) {
  const [courses, setCourses] = useState([]);
  const { API_URL } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/courses`);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Instructor</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Students</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Lectures</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Assignments</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>
                <Link to={`/courses/${course._id}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>
                  {course.title}
                </Link>
              </td>
              <td style={{ padding: '10px' }}>{course.instructor?.name}</td>
              <td style={{ padding: '10px' }}>{course.enrolledStudents?.length || 0}</td>
              <td style={{ padding: '10px' }}>{course.lectures?.length || 0}</td>
              <td style={{ padding: '10px' }}>{course.assignments?.length || 0}</td>
              <td style={{ padding: '10px' }}>
                <button 
                  className="btn btn-danger" 
                  onClick={() => onDelete(course._id)}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;

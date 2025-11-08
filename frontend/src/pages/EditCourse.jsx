import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function EditCourse() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { API_URL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/courses/${id}`);
      setFormData({
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail || ''
      });
    } catch (err) {
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`${API_URL}/courses/${id}`, formData);
      navigate(`/courses/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/courses/${id}`);
      alert('Course deleted successfully');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Edit Course</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Course Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Course Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="5"
            required
          />
          <input
            type="url"
            placeholder="Thumbnail URL (optional)"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Update Course
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={handleDelete}
              style={{ flex: 1 }}
            >
              Delete Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;

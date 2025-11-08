import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function LiveSessions({ courseId, isInstructor }) {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    duration: 60,
    meetingLink: ''
  });
  const { API_URL } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, [courseId]);

  const fetchSessions = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/live-sessions/course/${courseId}`);
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/live-sessions`, {
        ...formData,
        courseId
      });
      setFormData({
        title: '',
        description: '',
        scheduledAt: '',
        duration: 60,
        meetingLink: ''
      });
      setShowForm(false);
      fetchSessions();
      alert('Live session scheduled!');
    } catch (error) {
      alert('Failed to schedule session');
    }
  };

  const handleDelete = async (sessionId) => {
    if (!confirm('Delete this session?')) return;
    try {
      await axios.delete(`${API_URL}/live-sessions/${sessionId}`);
      fetchSessions();
    } catch (error) {
      alert('Failed to delete session');
    }
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    const scheduled = new Date(session.scheduledAt);
    const endTime = new Date(scheduled.getTime() + session.duration * 60000);

    if (session.status === 'cancelled') return 'Cancelled';
    if (now < scheduled) return 'Upcoming';
    if (now >= scheduled && now <= endTime) return 'Live Now';
    return 'Completed';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Live Sessions</h3>
        {isInstructor && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Schedule Session'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card">
          <h4>Schedule Live Session</h4>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Session Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Meeting Link (Zoom/Google Meet)"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary">Schedule</button>
          </form>
        </div>
      )}

      {sessions.length === 0 ? (
        <p>No live sessions scheduled yet.</p>
      ) : (
        <div>
          {sessions.map(session => {
            const status = getSessionStatus(session);
            const statusColor = status === 'Live Now' ? '#10b981' : 
                               status === 'Upcoming' ? '#3b82f6' : '#6b7280';

            return (
              <div key={session._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4>{session.title}</h4>
                    <p>{session.description}</p>
                    <p><strong>Instructor:</strong> {session.instructor.name}</p>
                    <p><strong>Scheduled:</strong> {new Date(session.scheduledAt).toLocaleString()}</p>
                    <p><strong>Duration:</strong> {session.duration} minutes</p>
                    <p style={{ color: statusColor, fontWeight: 'bold' }}>
                      Status: {status}
                    </p>
                    {(status === 'Live Now' || status === 'Upcoming') && (
                      <a 
                        href={session.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ display: 'inline-block', marginTop: '10px' }}
                      >
                        {status === 'Live Now' ? 'Join Now' : 'Meeting Link'}
                      </a>
                    )}
                  </div>
                  {isInstructor && (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(session._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LiveSessions;

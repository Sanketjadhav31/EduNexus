import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import LiveSessions from '../components/LiveSessions';

function CourseDetail() {
  const { id } = useParams();
  const { user, API_URL } = useAuth();
  const [course, setCourse] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lectures');
  const [lectureForm, setLectureForm] = useState({ title: '', videoUrl: '', duration: '' });
  const [lectureFile, setLectureFile] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', fileUrl: '', dueDate: '' });
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState('');
  const [activeSubmissionId, setActiveSubmissionId] = useState(null);
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  useEffect(() => {
    fetchCourse();
    fetchSubmissions();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/courses/${id}`);
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/submissions/course/${id}`);
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);
    setUploadType('lecture');
    try {
      const formData = new FormData();
      formData.append('title', lectureForm.title);
      formData.append('duration', lectureForm.duration);

      if (lectureFile) {
        formData.append('video', lectureFile);
      } else if (lectureForm.videoUrl) {
        formData.append('videoUrl', lectureForm.videoUrl);
      } else {
        alert('Please provide a video file or URL');
        setUploading(false);
        return;
      }

      await axios.post(`${API_URL}/courses/${id}/lectures`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setLectureForm({ title: '', videoUrl: '', duration: '' });
      setLectureFile(null);
      setUploadProgress(0);
      setShowLectureForm(false);
      fetchCourse();
    } catch (error) {
      console.error('Lecture upload error:', error);
      alert(error.response?.data?.message || error.message || 'Failed to add lecture');
    } finally {
      setUploading(false);
      setUploadType('');
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);
    setUploadType('assignment');
    try {
      const formData = new FormData();
      formData.append('title', assignmentForm.title);
      formData.append('description', assignmentForm.description);
      formData.append('dueDate', assignmentForm.dueDate);

      if (assignmentFile) {
        formData.append('file', assignmentFile);
      } else if (assignmentForm.fileUrl) {
        formData.append('fileUrl', assignmentForm.fileUrl);
      }

      await axios.post(`${API_URL}/courses/${id}/assignments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setAssignmentForm({ title: '', description: '', fileUrl: '', dueDate: '' });
      setAssignmentFile(null);
      setUploadProgress(0);
      setShowAssignmentForm(false);
      fetchCourse();
    } catch (error) {
      console.error('Assignment upload error:', error);
      alert(error.response?.data?.message || error.message || 'Failed to add assignment');
    } finally {
      setUploading(false);
      setUploadType('');
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!confirm('Delete this lecture?')) return;
    try {
      await axios.delete(`${API_URL}/courses/${id}/lectures/${lectureId}`);
      fetchCourse();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete lecture');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      await axios.delete(`${API_URL}/courses/${id}/assignments/${assignmentId}`);
      fetchCourse();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete assignment');
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    const grade = document.getElementById(`grade-${submissionId}`).value;
    const feedback = document.getElementById(`feedback-${submissionId}`).value;

    if (!grade) {
      alert('Please enter a grade');
      return;
    }

    try {
      await axios.put(`${API_URL}/submissions/${submissionId}/grade`, {
        grade: parseInt(grade),
        feedback
      });
      fetchSubmissions();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save grade');
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (!submissionFile) {
      alert('Please select a file to submit');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadType('submission');
    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('courseId', id);
      formData.append('file', submissionFile);

      await axios.post(`${API_URL}/submissions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setSubmissionFile(null);
      setUploadProgress(0);
      setActiveSubmissionId(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Submission upload error:', error);
      alert(error.response?.data?.message || error.message || 'Failed to submit assignment');
    } finally {
      setUploading(false);
      setUploadType('');
    }
  };

  if (loading) return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '50px' }}>Loading course...</div>
    </div>
  );

  if (!course) return (
    <div className="container">
      <div className="card">
        <h3>Course not found</h3>
        <Link to="/courses">
          <button className="btn btn-primary">Back to Courses</button>
        </Link>
      </div>
    </div>
  );

  // Handle both user.id and user._id formats
  const userId = user.id || user._id;
  const instructorId = course.instructor._id || course.instructor.id;

  const isInstructor = user.role === 'instructor' && instructorId === userId;
  const isEnrolled = course.enrolledStudents.some(s => {
    const studentId = s._id || s.id || s;
    return studentId === userId;
  });

  return (
    <div className="container">
      {uploading && uploadProgress > 0 && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          minWidth: '300px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
            {uploadType === 'lecture' && '📹 Uploading Lecture...'}
            {uploadType === 'assignment' && '📄 Uploading Assignment...'}
            {uploadType === 'submission' && '📤 Submitting Assignment...'}
          </h4>
          <div style={{
            width: '100%',
            height: '24px',
            background: '#e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
              transition: 'width 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {uploadProgress}%
            </div>
          </div>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
            Please wait, do not close this page...
          </p>
        </div>
      )}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div style={{ flex: 1 }}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p><strong>Instructor:</strong> {course.instructor.name}</p>
            <p><strong>Enrolled Students:</strong> {course.enrolledStudents.length}</p>
          </div>
          {isInstructor && (
            <Link to={`/courses/${id}/edit`}>
              <button className="btn btn-primary">Edit Course</button>
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => setActiveTab('lectures')}>Lectures</button>
        <button className="btn btn-primary" onClick={() => setActiveTab('assignments')}>Assignments</button>
        <button className="btn btn-primary" onClick={() => setActiveTab('live')}>Live Sessions</button>
        <button className="btn btn-primary" onClick={() => setActiveTab('chat')}>Chat</button>
      </div>

      {activeTab === 'lectures' && (
        <div>
          <h3>Lectures</h3>
          {isInstructor && (
            showLectureForm ? (
              <div className="card">
                <h4>Add Lecture</h4>
                <form onSubmit={handleAddLecture}>
                  <input
                    placeholder="Lecture Title"
                    value={lectureForm.title}
                    onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                    required
                  />
                  <input
                    placeholder="Duration (e.g., 45 min)"
                    value={lectureForm.duration}
                    onChange={(e) => setLectureForm({ ...lectureForm, duration: e.target.value })}
                  />
                  <div style={{ marginBottom: '15px', padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '2px dashed #d1d5db' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
                      📤 Upload Video File:
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        setLectureFile(e.target.files[0]);
                        setLectureForm({ ...lectureForm, videoUrl: '' });
                      }}
                      style={{ marginBottom: '10px', width: '100%' }}
                    />
                    {lectureFile && (
                      <div style={{ padding: '10px', background: '#e0f2fe', borderRadius: '5px', fontSize: '13px' }}>
                        <strong>✓ Selected:</strong> {lectureFile.name} ({(lectureFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                    <p style={{ textAlign: 'center', margin: '15px 0', color: '#6b7280', fontWeight: 'bold' }}>OR</p>
                    <input
                      placeholder="🔗 Paste YouTube/Vimeo URL"
                      value={lectureForm.videoUrl}
                      onChange={(e) => {
                        setLectureForm({ ...lectureForm, videoUrl: e.target.value });
                        setLectureFile(null);
                      }}
                      disabled={!!lectureFile}
                      style={{ background: lectureFile ? '#f3f4f6' : 'white' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={uploading} style={{ flex: 1, padding: '12px' }}>
                      {uploading && uploadType === 'lecture'
                        ? `📤 Uploading... ${uploadProgress}%`
                        : '➕ Add Lecture'}
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setShowLectureForm(false);
                        setLectureForm({ title: '', videoUrl: '', duration: '' });
                        setLectureFile(null);
                      }}
                      style={{ padding: '12px 20px', background: '#e5e7eb', color: '#374151' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setShowLectureForm(true)}
                style={{ marginBottom: '20px', padding: '12px 24px' }}
              >
                ➕ Add New Lecture
              </button>
            )
          )}
          {[...course.lectures].reverse().map((lecture, idx) => (
            <div key={idx} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4>{lecture.title}</h4>
                  <p>Duration: {lecture.duration}</p>
                </div>
                {isInstructor && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteLecture(lecture._id)}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Delete
                  </button>
                )}
              </div>
              {lecture.videoUrl && (
                <div style={{ marginTop: '15px' }}>
                  {lecture.videoUrl.includes('youtube.com') || lecture.videoUrl.includes('youtu.be') ? (
                    <iframe
                      width="100%"
                      height="400"
                      src={lecture.videoUrl.replace('watch?v=', 'embed/')}
                      style={{ border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : lecture.videoUrl.includes('vimeo.com') ? (
                    <iframe
                      width="100%"
                      height="400"
                      src={`https://player.vimeo.com/video/${lecture.videoUrl.split('/').pop()}`}
                      style={{ border: 'none' }}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video controls style={{ width: '100%', maxHeight: '400px' }}>
                      <source src={lecture.videoUrl} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div>
          <h3>Assignments</h3>
          {isInstructor && (
            showAssignmentForm ? (
              <div className="card">
                <h4>Add Assignment</h4>
                <form onSubmit={handleAddAssignment}>
                  <input
                    placeholder="Assignment Title"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    rows="3"
                  />
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>📅 Due Date:</label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    style={{ marginBottom: '15px' }}
                  />
                  <div style={{ marginBottom: '15px', padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '2px dashed #d1d5db' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
                      📤 Upload Assignment File:
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.zip"
                      onChange={(e) => {
                        setAssignmentFile(e.target.files[0]);
                        setAssignmentForm({ ...assignmentForm, fileUrl: '' });
                      }}
                      style={{ marginBottom: '10px', width: '100%' }}
                    />
                    {assignmentFile && (
                      <div style={{ padding: '10px', background: '#e0f2fe', borderRadius: '5px', fontSize: '13px' }}>
                        <strong>✓ Selected:</strong> {assignmentFile.name}
                      </div>
                    )}
                    <p style={{ textAlign: 'center', margin: '15px 0', color: '#6b7280', fontWeight: 'bold' }}>OR</p>
                    <input
                      placeholder="🔗 Paste File URL"
                      value={assignmentForm.fileUrl}
                      onChange={(e) => {
                        setAssignmentForm({ ...assignmentForm, fileUrl: e.target.value });
                        setAssignmentFile(null);
                      }}
                      disabled={!!assignmentFile}
                      style={{ background: assignmentFile ? '#f3f4f6' : 'white' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={uploading} style={{ flex: 1, padding: '12px' }}>
                      {uploading && uploadType === 'assignment'
                        ? `📤 Uploading... ${uploadProgress}%`
                        : '➕ Add Assignment'}
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setShowAssignmentForm(false);
                        setAssignmentForm({ title: '', description: '', fileUrl: '', dueDate: '' });
                        setAssignmentFile(null);
                      }}
                      style={{ padding: '12px 20px', background: '#e5e7eb', color: '#374151' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setShowAssignmentForm(true)}
                style={{ marginBottom: '20px', padding: '12px 24px' }}
              >
                ➕ Add New Assignment
              </button>
            )
          )}
          {[...course.assignments].reverse().map((assignment, idx) => (
            <div key={idx} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4>{assignment.title}</h4>
                  <p>{assignment.description}</p>
                  {assignment.dueDate && (
                    <p style={{ color: new Date(assignment.dueDate) < new Date() ? '#ef4444' : '#666' }}>
                      <strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
                      {new Date(assignment.dueDate) < new Date() && ' (Overdue)'}
                    </p>
                  )}
                  {assignment.fileUrl && (
                    <a
                      href={assignment.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'inline-block', marginTop: '10px' }}
                    >
                      📥 Download Assignment
                    </a>
                  )}
                </div>
                {isInstructor && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Delete
                  </button>
                )}
              </div>

              {user.role === 'student' && isEnrolled && (
                <div style={{ marginTop: '15px' }}>
                  {activeSubmissionId === assignment._id ? (
                    <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '8px', border: '2px solid #86efac' }}>
                      <h5 style={{ marginTop: 0, color: '#166534' }}>📤 Submit Your Work:</h5>
                      <div style={{ padding: '15px', background: 'white', borderRadius: '8px', border: '2px dashed #d1d5db' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
                          Upload File:
                        </label>
                        <input
                          type="file"
                          onChange={(e) => {
                            setSubmissionFile(e.target.files[0]);
                          }}
                          style={{ width: '100%' }}
                          required
                        />
                        {submissionFile && (
                          <div style={{ padding: '10px', background: '#e0f2fe', borderRadius: '5px', fontSize: '13px', marginTop: '10px' }}>
                            <strong>✓ Selected:</strong> {submissionFile.name}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmitAssignment(assignment._id)}
                          disabled={uploading || !submissionFile}
                          style={{ flex: 1, padding: '12px' }}
                        >
                          {uploading && uploadType === 'submission'
                            ? `📤 Submitting... ${uploadProgress}%`
                            : '✅ Submit Assignment'}
                        </button>
                        <button
                          className="btn"
                          onClick={() => {
                            setActiveSubmissionId(null);
                            setSubmissionFile(null);
                          }}
                          style={{ padding: '12px 20px', background: '#e5e7eb', color: '#374151' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => setActiveSubmissionId(assignment._id)}
                      style={{ width: '100%', padding: '12px' }}
                    >
                      📤 Submit Assignment
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {isInstructor && (
            <div className="card">
              <h4>Student Submissions</h4>
              {submissions.length === 0 ? (
                <p>No submissions yet.</p>
              ) : (
                submissions.map(sub => (
                  <div key={sub._id} style={{ borderBottom: '1px solid #ddd', padding: '15px 0' }}>
                    <p><strong>{sub.student?.name || 'Unknown Student'}</strong></p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Submitted: {new Date(sub.submittedAt).toLocaleString()}
                    </p>
                    <a
                      href={sub.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'inline-block', margin: '10px 0' }}
                    >
                      📥 Download Submission
                    </a>
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="number"
                        placeholder="Grade (0-100)"
                        defaultValue={sub.grade || ''}
                        style={{ width: '120px', marginRight: '10px' }}
                        id={`grade-${sub._id}`}
                      />
                      <input
                        type="text"
                        placeholder="Feedback"
                        defaultValue={sub.feedback || ''}
                        style={{ width: '300px', marginRight: '10px' }}
                        id={`feedback-${sub._id}`}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => handleGradeSubmission(sub._id)}
                      >
                        Save Grade
                      </button>
                    </div>
                    {sub.grade && (
                      <p style={{ marginTop: '10px', color: '#10b981' }}>
                        <strong>Grade: {sub.grade}/100</strong>
                        {sub.feedback && ` - ${sub.feedback}`}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {user.role === 'student' && submissions.length > 0 && (
            <div className="card">
              <h4>My Submissions</h4>
              {submissions.map(sub => (
                <div key={sub._id} style={{ borderBottom: '1px solid #ddd', padding: '15px 0' }}>
                  <p>Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                  <a
                    href={sub.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'inline-block', marginTop: '10px' }}
                  >
                    📥 Download My Submission
                  </a>
                  {sub.grade ? (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#d1fae5', borderRadius: '5px' }}>
                      <p><strong>Grade: {sub.grade}/100</strong></p>
                      {sub.feedback && <p>Feedback: {sub.feedback}</p>}
                    </div>
                  ) : (
                    <p style={{ color: '#666', marginTop: '10px' }}>Not graded yet</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'live' && <LiveSessions courseId={id} isInstructor={isInstructor} />}

      {activeTab === 'chat' && <Chat courseId={id} />}
    </div>
  );
}

export default CourseDetail;

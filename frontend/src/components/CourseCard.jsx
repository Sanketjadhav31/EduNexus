import { Link } from 'react-router-dom';

function CourseCard({ course, user, onEnroll }) {
  const userId = user?.id || user?._id;
  const instructorId = course.instructor?._id || course.instructor?.id;
  
  const isEnrolled = course.enrolledStudents?.some(s => {
    const studentId = s._id || s.id || s;
    return studentId === userId;
  });
  const isInstructor = instructorId === userId;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
      <h3 style={{ marginBottom: '10px' }}>{course.title}</h3>
      <p style={{ 
        flex: 1, 
        marginBottom: '15px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical'
      }}>
        {course.description}
      </p>
      <div style={{ marginTop: 'auto' }}>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
          <strong>Instructor:</strong> {course.instructor?.name}
        </p>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          <strong>Students:</strong> {course.enrolledStudents?.length || 0}
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to={`/courses/${course._id}`}>
            <button className="btn btn-primary">View Details</button>
          </Link>
          {user?.role === 'student' && !isEnrolled && (
            <button className="btn btn-primary" onClick={() => onEnroll(course._id)}>
              Enroll
            </button>
          )}
          {isEnrolled && <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Enrolled</span>}
          {isInstructor && <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>Your Course</span>}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;

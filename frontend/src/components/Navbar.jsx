import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-content">
        <Link to="/"><h1>EduNexus</h1></Link>
        {user && (
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/courses">Courses</Link>
            {user.role === 'instructor' && <Link to="/create-course">Create Course</Link>}
            {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            <span>{user.name} ({user.role})</span>
            <button className="btn btn-danger" onClick={logout}>Logout</button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Navbar;

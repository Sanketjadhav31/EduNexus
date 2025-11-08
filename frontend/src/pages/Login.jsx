import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Login to EduNexus</h2>

        {/* Demo Credentials Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          color: 'white'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', textAlign: 'center' }}>
            🎓 Demo Accounts - Click to Login
          </h3>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('instructor@demo.com', 'password123')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              👨‍🏫 Instructor
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('student1@demo.com', 'password123')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              👨‍🎓 Student
            </button>
          </div>

          <div style={{ fontSize: '12px', textAlign: 'center', opacity: 0.9 }}>
            <p style={{ margin: '5px 0' }}>📧 instructor@demo.com | 🔑 password123</p>
            <p style={{ margin: '5px 0' }}>📧 student1@demo.com | 🔑 password123</p>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

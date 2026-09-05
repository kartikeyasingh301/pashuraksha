import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await login(username.trim(), password);
      if (user.role === 'vet') {
        navigate('/vet', { replace: true });
      } else {
        navigate('/farmer', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-icon"><Shield size={48} color="#2E7D32" /></span>
        </div>
        <h1 className="login-app-name">PashuSuraksha</h1>
        <p className="login-tagline">Pashu Swasthya Rakshak</p>
        <p className="login-subtitle">Animal Health Surveillance System</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="loading-spinner-sm" /> : null}
            {loading ? ' Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-demo-hint">
          <strong>Demo Credentials:</strong><br />
          Farmer: <code>farmer1 / farmer123</code><br />
          Vet: <code>vet1 / vet123</code>
        </div>
      </div>
    </div>
  );
}
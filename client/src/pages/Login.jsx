import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, User, Sparkles } from 'lucide-react';
import Alert from '../components/Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/groups';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <LogIn size={26} />
          </div>
          <h1>Student Login</h1>
          <p>Sign in to collaborate with study groups on StudySync</p>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              College Email <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gray-400)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gray-400)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <div className="spinner-sm"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="demo-credentials-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <Sparkles size={15} color="var(--primary-600)" />
            <span style={{ fontWeight: 700, color: 'var(--primary-800)' }}>Quick Demo Accounts:</span>
          </div>
          <ul>
            <li>
              <button
                type="button"
                className="demo-btn-link"
                onClick={() => fillDemoAccount('aarav@college.edu')}
              >
                Aarav Sharma (CSE - 6th Sem)
              </button>{' '}
              – <code>aarav@college.edu</code>
            </li>
            <li>
              <button
                type="button"
                className="demo-btn-link"
                onClick={() => fillDemoAccount('priya@college.edu')}
              >
                Priya Patel (IT - 6th Sem)
              </button>{' '}
              – <code>priya@college.edu</code>
            </li>
            <li>
              <button
                type="button"
                className="demo-btn-link"
                onClick={() => fillDemoAccount('rohan@college.edu')}
              >
                Rohan Verma (AI&DS - 4th Sem)
              </button>{' '}
              – <code>rohan@college.edu</code>
            </li>
          </ul>
          <p style={{ marginTop: '0.4rem', color: 'var(--gray-500)', fontSize: '0.78rem' }}>
            Default Password: <strong>password123</strong> (Click any name to auto-fill)
          </p>
        </div>

        <div className="auth-footer">
          Don't have a student account?{' '}
          <Link to="/register">Create new account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

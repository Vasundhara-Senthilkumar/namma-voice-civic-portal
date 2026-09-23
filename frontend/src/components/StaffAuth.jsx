import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { saveAuth } from '../authStorage';

const DEPARTMENTS = [
  'Sanitation Department',
  'Water Supply Department',
  'Electricity Board',
  'Public Works Department',
  'General Administration',
];

export default function StaffAuth({ navigateTo }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body =
        mode === 'signup'
          ? {
              name: name.trim(),
              username: staffId.trim(),
              password,
              role: 'STAFF',
              department,
            }
          : { username: staffId.trim(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      if (data.user?.role && data.user.role !== 'STAFF') {
        throw new Error('This account is not a staff account. Please use Citizen login.');
      }

      saveAuth(data.token, data.user);
      navigateTo('staff-dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              borderRadius: '0.75rem',
              background: '#f1f5f9',
              color: '#0f172a',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Staff Portal</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {mode === 'login'
              ? 'Sign in with your Staff ID to manage complaints.'
              : 'Register as municipal staff for your department.'}
          </p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            <LogIn size={16} /> Login
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            <UserPlus size={16} /> Sign Up
          </button>
        </div>

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Staff ID</label>
            <input
              className="form-control"
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="e.g. STAFF-1001"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={4}
            />
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading
              ? mode === 'signup'
                ? 'Creating account...'
                : 'Signing in...'
              : mode === 'signup'
                ? 'Create Staff Account'
                : 'Login as Staff'}
          </button>
        </form>
      </div>
    </div>
  );
}

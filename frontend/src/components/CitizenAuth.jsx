import React, { useState } from 'react';
import { User, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { saveAuth } from '../authStorage';

export default function CitizenAuth({ navigateTo }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
          ? { name: name.trim(), username: phone.trim(), password, role: 'CITIZEN' }
          : { username: phone.trim(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      if (data.user?.role && data.user.role !== 'CITIZEN') {
        throw new Error('This account is not a citizen account. Please use Staff login.');
      }

      saveAuth(data.token, data.user);
      navigateTo('submit');
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
              background: '#eff6ff',
              color: '#2563eb',
              marginBottom: '1rem',
            }}
          >
            <User size={24} />
          </div>
          <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Citizen Portal</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {mode === 'login'
              ? 'Sign in with your phone number to submit complaints.'
              : 'Create a citizen account to voice civic issues.'}
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
            <label className="form-label">Phone Number</label>
            <input
              className="form-control"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
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

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading
              ? mode === 'signup'
                ? 'Creating account...'
                : 'Signing in...'
              : mode === 'signup'
                ? 'Create Citizen Account'
                : 'Login as Citizen'}
          </button>
        </form>
      </div>
    </div>
  );
}

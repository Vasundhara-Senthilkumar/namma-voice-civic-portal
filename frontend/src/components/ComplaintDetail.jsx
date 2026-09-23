import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Globe, CheckCircle2, RefreshCw } from 'lucide-react';
import { authFetch, normalizeComplaint } from '../apiClient';

export default function ComplaintDetail({ complaint: initialComplaint, navigateTo }) {
  const [complaint, setComplaint] = useState(
    initialComplaint ? normalizeComplaint(initialComplaint) : null
  );
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!complaint) {
    return (
      <div className="container">
        <div className="card">
          <p>No complaint selected.</p>
          <button className="btn btn-primary" onClick={() => navigateTo('staff-dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setUpdateSuccess(false);
    setError(null);

    try {
      const response = await authFetch(
        `/api/complaints/${complaint.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        },
        navigateTo
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updated = normalizeComplaint(await response.json());
      setComplaint(updated);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message || 'Failed to update status on server.');
    } finally {
      setUpdating(false);
    }
  };

  const urgencyClass =
    complaint.urgency === 'HIGH' ? 'badge-high' : complaint.urgency === 'MEDIUM' ? 'badge-medium' : 'badge-low';

  return (
    <div className="container">
      <div className="card">
        <button
          className="btn btn-outline"
          onClick={() => navigateTo('staff-dashboard')}
          style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ color: '#0f172a' }}>Complaint Details</h2>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Reference ID: <strong>{complaint.id}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className={`badge ${urgencyClass}`}>{complaint.urgency} URGENCY</span>
            <span className="badge badge-category">{complaint.category}</span>
            {complaint.department && (
              <span className="badge badge-department">{complaint.department}</span>
            )}
          </div>
        </div>

        {updateSuccess && (
          <div className="alert-banner alert-info" style={{ backgroundColor: '#f0fdf4', borderColor: '#86efac', color: '#166534' }}>
            <CheckCircle2 size={18} /> Status updated successfully!
          </div>
        )}

        {error && (
          <div className="alert-banner alert-error">
            {error}
          </div>
        )}

        <div className="detail-grid">
          {/* Main content */}
          <div>
            <div className="meta-box" style={{ marginBottom: '1.5rem' }}>
              <div className="meta-label">Full Complaint Text</div>
              <div className="meta-value" style={{ fontWeight: 400, lineHeight: 1.6, marginTop: '0.5rem', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                {complaint.text}
              </div>
            </div>

            <div className="meta-box">
              <div className="meta-label">AI Summary</div>
              <div className="meta-value" style={{ fontStyle: 'italic', fontWeight: 500, color: '#475569', marginTop: '0.25rem' }}>
                "{complaint.summary}"
              </div>
            </div>
          </div>

          {/* Sidebar / Meta & Status Control */}
          <div>
            <div className="meta-box" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Update Action Status
              </label>

              <select
                className="form-control"
                value={complaint.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                style={{ fontWeight: 600, fontSize: '1rem', padding: '0.75rem' }}
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>

              {updating && (
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <RefreshCw size={14} className="spin" /> Updating backend...
                </div>
              )}
            </div>

            <div className="meta-box">
              <h4 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: '1rem' }}>Metadata</h4>

              <div className="meta-item">
                <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} /> Location
                </div>
                <div className="meta-value" style={{ fontSize: '0.95rem' }}>{complaint.location}</div>
              </div>

              <div className="meta-item">
                <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Globe size={14} /> Input Language
                </div>
                <div className="meta-value" style={{ fontSize: '0.95rem' }}>{complaint.language}</div>
              </div>

              <div className="meta-item">
                <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} /> Date Submitted
                </div>
                <div className="meta-value" style={{ fontSize: '0.875rem', color: '#475569' }}>
                  {new Date(complaint.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { CheckCircle2, Home, FileText, AlertTriangle, Tag, MapPin, Building2 } from 'lucide-react';

export default function AIResultView({ complaint, navigateTo }) {
  if (!complaint) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>No Complaint Data</h2>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigateTo('landing')}>
            <Home size={18} /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const urgencyClass =
    complaint.urgency === 'HIGH' ? 'badge-high' : complaint.urgency === 'MEDIUM' ? 'badge-medium' : 'badge-low';

  return (
    <div className="container">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <CheckCircle2 size={56} color="#16a34a" style={{ marginBottom: '0.75rem' }} />
          <h2 style={{ color: '#0f172a', fontSize: '1.75rem' }}>Complaint Submitted Successfully!</h2>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
            Reference ID: <strong>{complaint.id}</strong>
          </p>
        </div>

        <div className="meta-box" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} /> AI Classification & Summary
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Tag size={14} /> Category
              </div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className="badge badge-category">{complaint.category}</span>
              </div>
            </div>

            <div>
              <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertTriangle size={14} /> Urgency Level
              </div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge ${urgencyClass}`}>{complaint.urgency} URGENCY</span>
              </div>
            </div>

            {complaint.department && (
              <div>
                <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Building2 size={14} /> Department
                </div>
                <div style={{ marginTop: '0.25rem' }}>
                  <span className="badge badge-department">{complaint.department}</span>
                </div>
              </div>
            )}
          </div>

          <div className="meta-item">
            <div className="meta-label">Generated Summary</div>
            <div className="meta-value" style={{ fontStyle: 'italic', fontWeight: 500, color: '#334155' }}>
              "{complaint.summary}"
            </div>
          </div>

          <div className="meta-item" style={{ marginTop: '1rem' }}>
            <div className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={14} /> Location
            </div>
            <div className="meta-value">{complaint.location}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigateTo('landing')}>
            <Home size={18} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

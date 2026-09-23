import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { getAuth } from '../authStorage';
import { authFetch, normalizeComplaints } from '../apiClient';

const URGENCY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export default function StaffDashboard({ onSelectComplaint, navigateTo }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const department = getAuth()?.user?.department || 'Municipal Staff';

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (urgencyFilter !== 'ALL') params.append('urgency', urgencyFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const response = await authFetch(
        `/api/complaints?${params.toString()}`,
        {},
        navigateTo
      );
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : data.complaints || [];
      setComplaints(normalizeComplaints(list));
    } catch (err) {
      console.error('Error loading complaints:', err);
      setError(err.message || 'Could not load complaints from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter, urgencyFilter, statusFilter]);

  // Urgency-first sorting
  const sortedComplaints = [...complaints].sort((a, b) => {
    const wA = URGENCY_ORDER[a.urgency] ?? 99;
    const wB = URGENCY_ORDER[b.urgency] ?? 99;
    return wA - wB;
  });

  const getUrgencyBadge = (urgency) => {
    const cls = urgency === 'HIGH' ? 'badge-high' : urgency === 'MEDIUM' ? 'badge-medium' : 'badge-low';
    return <span className={`badge ${cls}`}>{urgency}</span>;
  };

  const getStatusBadge = (status) => {
    const cls =
      status === 'RESOLVED' ? 'badge-resolved' : status === 'IN_PROGRESS' ? 'badge-in_progress' : 'badge-pending';
    return <span className={`badge ${cls}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="container" style={{ maxWidth: '1100px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ color: '#0f172a' }}>{department} Dashboard</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Manage and resolve citizen complaints sorted by urgency priority.
            </p>
          </div>
          <button className="btn btn-outline" onClick={fetchComplaints} style={{ padding: '0.5rem 1rem' }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Category</label>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="WATER">WATER</option>
              <option value="GARBAGE">GARBAGE</option>
              <option value="ELECTRICITY">ELECTRICITY</option>
              <option value="ROAD">ROAD</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Urgency</label>
            <select
              className="form-control"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
            >
              <option value="ALL">All Urgencies</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && <div className="alert-banner alert-error">{error}</div>}

        {/* Loading / Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            Loading complaints...
          </div>
        ) : sortedComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No complaints found matching filters.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Urgency</th>
                  <th>Category</th>
                  <th>Summary</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedComplaints.map((item) => (
                  <tr key={item.id} onClick={() => onSelectComplaint(item)}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.id}</td>
                    <td>{getUrgencyBadge(item.urgency)}</td>
                    <td>
                      <span className="badge badge-category">{item.category}</span>
                    </td>
                    <td style={{ maxWidth: '300px' }}>{item.summary}</td>
                    <td style={{ color: '#475569', fontSize: '0.875rem' }}>{item.location}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaint(item);
                        }}
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

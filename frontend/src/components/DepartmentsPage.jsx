import React from 'react';
import { DEPARTMENTS } from '../data/siteContent';

export default function DepartmentsPage() {
  return (
    <div className="marketing-page">
      <div className="card">
        <h1 className="page-title">Departments</h1>
        <p className="page-lead">
          Complaints are automatically routed to one of five municipal departments based on AI
          category classification.
        </p>

        <div className="departments-grid">
          {DEPARTMENTS.map((dept) => (
            <article key={dept.name} className="department-card">
              <h2>{dept.name}</h2>
              <p>{dept.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

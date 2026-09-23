import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <div className="site-footer-brand">Namma Voice</div>
          <p className="site-footer-text">
            AI-assisted multilingual civic complaint routing for citizens and municipal departments.
          </p>
        </div>
        <div className="site-footer-links">
          <Link to="/about">About</Link>
          <Link to="/departments">Departments</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/reviews">Reviews</Link>
        </div>
        <div className="site-footer-text">
          Helpline: 1800-000-VOICE · hello@nammavoice.example
        </div>
      </div>
    </footer>
  );
}

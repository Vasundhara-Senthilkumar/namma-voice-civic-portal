import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import SiteLogo from './SiteLogo';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Us' },
  { to: '/departments', label: 'Departments' },
  { to: '/contact', label: 'Contact' },
  { to: '/reviews', label: 'Reviews' },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand">
          <SiteLogo />
          <div>
            <div className="site-brand-title">நம்ம Voice</div>
            <div className="site-brand-subtitle">Civic Complaint Portal</div>
          </div>
        </Link>

        <nav className="site-nav" aria-label="Main">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `site-nav-link${isActive ? ' site-nav-link-active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

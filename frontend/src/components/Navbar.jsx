import React from 'react';
import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { clearAuth } from '../authStorage';
import SiteLogo from './SiteLogo';

const APP_PATHS_WITH_LOGOUT = new Set([
  '/submit',
  '/ai-result',
  '/staff-dashboard',
  '/complaint-detail',
]);

export default function Navbar({ navigateTo }) {
  const location = useLocation();
  const showLogout = APP_PATHS_WITH_LOGOUT.has(location.pathname);

  const handleLogout = () => {
    clearAuth();
    navigateTo('landing');
  };

  return (
    <header className="app-header">
      <div
        className="brand-title"
        onClick={() => navigateTo('landing')}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') navigateTo('landing');
        }}
      >
        <SiteLogo />
        <div>
          <div>நம்ம Voice</div>
          <div className="brand-subtitle">Civic Complaint Portal</div>
        </div>
      </div>
      <div className="nav-badges">
        {location.pathname !== '/' && (
          <button className="nav-button" onClick={() => navigateTo('landing')}>
            Home
          </button>
        )}
        {showLogout && (
          <button className="nav-button" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        )}
      </div>
    </header>
  );
}

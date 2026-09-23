import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MarketingLayout from './components/MarketingLayout';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import DepartmentsPage from './components/DepartmentsPage';
import ContactPage from './components/ContactPage';
import ReviewsPage from './components/ReviewsPage';
import CitizenAuth from './components/CitizenAuth';
import StaffAuth from './components/StaffAuth';
import SubmitComplaint from './components/SubmitComplaint';
import AIResultView from './components/AIResultView';
import StaffDashboard from './components/StaffDashboard';
import ComplaintDetail from './components/ComplaintDetail';

/** Maps legacy view names used by auth/complaint screens to URL paths. */
export const VIEW_PATHS = {
  landing: '/',
  about: '/about',
  departments: '/departments',
  contact: '/contact',
  reviews: '/reviews',
  'citizen-auth': '/citizen-auth',
  'staff-auth': '/staff-auth',
  submit: '/submit',
  'ai-result': '/ai-result',
  'staff-dashboard': '/staff-dashboard',
  'complaint-detail': '/complaint-detail',
};

function AppLayout({ navigateTo }) {
  return (
    <div>
      <Navbar navigateTo={navigateTo} />
      <Outlet />
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const [activeComplaint, setActiveComplaint] = useState(null);

  const navigateTo = (view) => {
    const path = VIEW_PATHS[view] || (view?.startsWith('/') ? view : '/');
    navigate(path);
  };

  const handleComplaintSubmitted = (complaint) => {
    setActiveComplaint(complaint);
    navigate('/ai-result');
  };

  const handleSelectComplaint = (complaint) => {
    setActiveComplaint(complaint);
    navigate('/complaint-detail');
  };

  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Route>

      <Route element={<AppLayout navigateTo={navigateTo} />}>
        <Route path="/citizen-auth" element={<CitizenAuth navigateTo={navigateTo} />} />
        <Route path="/staff-auth" element={<StaffAuth navigateTo={navigateTo} />} />
        <Route
          path="/submit"
          element={
            <SubmitComplaint
              onComplaintSubmitted={handleComplaintSubmitted}
              navigateTo={navigateTo}
            />
          }
        />
        <Route
          path="/ai-result"
          element={<AIResultView complaint={activeComplaint} navigateTo={navigateTo} />}
        />
        <Route
          path="/staff-dashboard"
          element={
            <StaffDashboard
              onSelectComplaint={handleSelectComplaint}
              navigateTo={navigateTo}
            />
          }
        />
        <Route
          path="/complaint-detail"
          element={
            <ComplaintDetail complaint={activeComplaint} navigateTo={navigateTo} />
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

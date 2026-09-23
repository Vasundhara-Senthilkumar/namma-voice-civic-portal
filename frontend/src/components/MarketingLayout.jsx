import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function MarketingLayout() {
  return (
    <div className="marketing-shell">
      <SiteHeader />
      <main className="marketing-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

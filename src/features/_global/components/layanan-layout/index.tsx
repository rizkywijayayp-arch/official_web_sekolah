/**
 * LayananLayout.tsx
 * Layout wrapper for layanan persuratan pages (public).
 * Provides Navbar + Footer with high z-index navbar.
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { FooterComp } from '../footer';
import NavbarComp from '../navbar';

export const LayananLayout = React.memo(() => {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}>
      <div style={{ position: 'relative', zIndex: 9999999 }}>
        <NavbarComp />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterComp />
    </div>
  );
});

LayananLayout.displayName = 'LayananLayout';

export default LayananLayout;
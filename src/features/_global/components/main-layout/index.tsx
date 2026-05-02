/**
 * MainLayout.tsx
 * Wraps Navbar + Footer around public pages.
 * Use this for ALL public pages that should have school branding header/footer.
 * For admin pages, use DashboardPageLayout instead.
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { FooterComp } from '../footer';
import NavbarComp from '../navbar';

interface MainLayoutProps {
  /** Override the default z-index on the navbar wrapper */
  navbarZIndex?: number;
  /** Additional className for the main content wrapper */
  contentClassName?: string;
}

export const MainLayout = React.memo(({ navbarZIndex = 9999999, contentClassName = '' }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}>
      {/* Navbar — always on top with high z-index */}
      <div style={{ position: 'relative', zIndex: navbarZIndex }}>
        <NavbarComp />
      </div>

      {/* Page content — fills remaining height */}
      <main className={`flex-1 ${contentClassName}`}>
        <Outlet />
      </main>

      {/* Footer */}
      <FooterComp />
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
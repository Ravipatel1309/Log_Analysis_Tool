/**
 * AppLayout - Main layout wrapper component
 * Provides consistent layout with sidebar and main content area
 */

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/config/appConfig';
import { AppSidebar } from './AppSidebar';

/**
 * Main layout component that wraps all pages
 */
export const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    APP_CONFIG.sidebar.defaultCollapsed
  );
  const location = useLocation();
  const isLogsPage = location.pathname.includes('/logs');

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <main
        className={cn(
          'min-h-screen sidebar-transition',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {isLogsPage ? (
          <div className="h-screen overflow-hidden">
            <Outlet />
          </div>
        ) : (
          <div className="container py-6 px-4 md:px-8 max-w-7xl">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

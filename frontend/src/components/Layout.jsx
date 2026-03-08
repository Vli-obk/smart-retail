import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; // Drouri t-importi Outlet

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Hna fin ghadi i-t-affichaw les pages (Dashboard, Clients, etc.) */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#F9FAFB'
    }}>
      {/* Sidebar */}
      <div style={{
        display: sidebarOpen ? 'block' : 'none',
        position: 'fixed',
        width: '250px',
        height: '100%',
        zIndex: 40
      }}>
        <Sidebar />
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 30,
            display: 'none'
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Main content area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        marginLeft: sidebarOpen ? '250px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Navbar */}
        <Navbar isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Main content with scrolling */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          backgroundColor: '#F9FAFB'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;


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
      margin: 0,
      padding: 0,
      backgroundColor: '#e7f3f5ff', 
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <div style={{
        display: sidebarOpen ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '290px',
        height: '100vh',
        zIndex: 40,
        margin: 0,
        padding: 0
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
            zIndex: 30
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
        marginLeft: sidebarOpen ? '290px' : '0',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        {/* Navbar */}
        <Navbar isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Main content with scrolling */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          marginTop: '89px'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

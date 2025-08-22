import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImage from '../assets/Logo_PLN_Icon_Plus.png';
// Import MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Determine role based on current path (like in reference)
  const path = location.pathname.toLowerCase();  
  let userRole = "admin"; // default
  
  if (path.startsWith("/sales")) {
    userRole = "sales";
  } else if (path.startsWith("/admin")) {
    userRole = "admin";
  }
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Menu items untuk admin
  const adminMenuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
    },
    {
      title: "Management Data User",
      path: "/admin/data-user",
      icon: <PeopleIcon />,
    },
    {
      title: "Data Layanan",
      path: "/admin/data-layanan",
      icon: <AssignmentIcon />,
    },
    {
      title: "Data Penawaran",
      path: "/admin/data-penawaran",
      icon: <BuildIcon />,
    },
    {
      title: "Laporan Laba",
      path: "/admin/laporan-laba",
      icon: <AssessmentIcon />,
    }
  ];

  // Menu items untuk sales
  const salesMenuItems = [
    {
      title: "Dashboard",
      path: "/sales/dashboard",
      icon: <DashboardIcon />,
    },
    {
      title: "Data Penawaran",
      path: "/sales/data-penawaran",
      icon: <BuildIcon />,
    },
    {
      title: "Laporan Laba",
      path: "/sales/laporan-laba",
      icon: <AssessmentIcon />,
    }
  ];

  // Pilih menu items berdasarkan role
  const menuItems = userRole === 'sales' ? salesMenuItems : adminMenuItems;

  return (
    <>
      <div style={{
        height: '100vh',
        width: '250px',
        backgroundColor: '#E8F4FD',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #E5E7EB'
      }}>
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#E8F4FD'
        }}>
          <img 
            src={logoImage}
            alt="PLN Logo"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              objectFit: 'contain',
              marginRight: '8px'
            }}
          />
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#00AEEF',
              lineHeight: '1.2'
            }}>
              PLN
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6B7280',
              lineHeight: '1.2'
            }}>
              Icon Plus
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div style={{
          flex: 1,
          padding: '1rem 0'
        }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                margin: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: isActive(item.path) ? '#00AEEF' : 'transparent',
                color: isActive(item.path) ? 'white' : '#374151',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ 
                marginRight: '12px',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                color: isActive(item.path) ? 'white' : '#374151'
              }}>
                {item.icon}
              </span>
              <span style={{ 
                color: isActive(item.path) ? 'white' : '#374151' 
              }}>
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* User Profile Section */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#00AEEF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}>
              <span style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {userRole === 'sales' ? 'S' : 'A'}
              </span>
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                {userRole === 'sales' ? 'Sales' : 'Admin'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6B7280'
              }}>
                {userRole === 'sales' ? 'sales@pln.co.id' : 'admin@pln.co.id'}
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#00AEEF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              boxSizing: 'border-box',
              margin: '0',
              outline: 'none'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0088CC'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00AEEF'}
          >
            <span style={{ 
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <LogoutIcon fontSize="small" />
            </span>
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Konfirmasi Logout
            </h3>
            <p style={{
              color: '#6B7280',
              marginBottom: '2rem'
            }}>
              Apakah Anda yakin ingin keluar dari aplikasi?
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button
                onClick={cancelLogout}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#00AEEF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0088CC'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#00AEEF'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
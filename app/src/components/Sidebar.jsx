import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImage from '../assets/logo-pln.jpg';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
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

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: "📊",
      isActive: true
    },
    {
      title: "Management Data User",
      path: "/management-data-user",
      icon: "👥",
      isActive: false
    },
    {
      title: "Data Layanan",
      path: "/data-layanan",
      icon: "📋",
      isActive: false
    },
    {
      title: "Data Penawaran",
      path: "/data-penawaran",
      icon: "🔧",
      isActive: false
    },
    {
      title: "Laporan Laba",
      path: "/laporan-laba",
      icon: "📄",
      isActive: false
    }
  ];

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
                backgroundColor: item.title === 'Dashboard' ? '#00AEEF' : 'transparent',
                color: item.title === 'Dashboard' ? 'white' : '#374151',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (item.title !== 'Dashboard') {
                  e.target.style.backgroundColor = '#F3F4F6';
                }
              }}
              onMouseOut={(e) => {
                if (item.title !== 'Dashboard') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ 
                marginRight: '12px',
                fontSize: '16px'
              }}>
                {item.icon}
              </span>
              <span>{item.title}</span>
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
            marginBottom: '0.5rem'
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
                A
              </span>
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Admin
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6B7280'
              }}>
                admin@pln.co.id
              </div>
            </div>
          </div>
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
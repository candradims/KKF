import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImage from '../assets/Logo_PLN_Icon_Plus.png';
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
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const path = location.pathname.toLowerCase();  
  let userRole = "superAdmin"; 
  
  if (path.startsWith("/sales")) {
    userRole = "sales";
  } else if (path.startsWith("/admin")) {
    userRole = "admin";
  } else if (path.startsWith("/superadmin")) {
    userRole = "superAdmin";
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

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  // Menu items untuk Super admin
  const superAdminMenuItems = [
    {
      title: "Dashboard",
      path: "/superAdmin/dashboard",
      icon: <DashboardIcon />,
      color: colors.secondary
    },
    {
      title: "Data Penawaran",
      path: "/superAdmin/data-penawaran",
      icon: <BuildIcon />,
      color: colors.tertiary
    }
  ];

  // Menu items untuk admin
  const adminMenuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
      color: colors.secondary
    },
    {
      title: "Data User",
      path: "/admin/data-user",
      icon: <PeopleIcon />,
      color: colors.tertiary
    },
    {
      title: "Data Layanan",
      path: "/admin/data-layanan",
      icon: <AssignmentIcon />,
      color: colors.accent1
    },
    {
      title: "Data Penawaran",
      path: "/admin/data-penawaran",
      icon: <BuildIcon />,
      color: colors.accent2
    },
    {
      title: "Laporan Laba",
      path: "/admin/laporan-laba",
      icon: <AssessmentIcon />,
      color: colors.success
    }
  ];

  // Menu items untuk sales
  const salesMenuItems = [
    {
      title: "Dashboard",
      path: "/sales/dashboard",
      icon: <DashboardIcon />,
      color: colors.secondary
    },
    {
      title: "Data Penawaran",
      path: "/sales/data-penawaran",
      icon: <BuildIcon />,
      color: colors.tertiary
    },
    {
      title: "Laporan Laba",
      path: "/sales/laporan-laba",
      icon: <AssessmentIcon />,
      color: colors.success
    }
  ];

  // Pilih menu items berdasarkan role
  let menuItems = adminMenuItems;
    if (userRole === "sales") {
      menuItems = salesMenuItems;
    } else if (userRole === "superAdmin") {
      menuItems = superAdminMenuItems;
    }

  const sidebarStyle = {
    height: '100vh',
    width: '270px',
    background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
    display: 'flex',
    flexDirection: 'column',
    borderRight: 'none',
    boxShadow: '4px 0 20px rgba(3, 91, 113, 0.15)',
    position: 'relative',
    overflow: 'hidden'
  };

  const logoSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    padding: '9px',
    position: 'relative'
  };

  const menuItemStyle = (item, index) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    margin: '6px 12px',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: isActive(item.path) 
      ? 'rgba(255, 255, 255, 0.15)' 
      : hoveredItem === index 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'transparent',
    color: 'white',
    fontSize: '14px',
    fontWeight: isActive(item.path) ? '600' : '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: hoveredItem === index ? 'translateX(4px)' : 'translateX(0)',
    border: isActive(item.path) ? `1px solid rgba(255, 255, 255, 0.2)` : '1px solid transparent',
    backdropFilter: isActive(item.path) ? 'blur(10px)' : 'none',
    position: 'relative',
    overflow: 'hidden'
  });

  const iconStyle = (item, index) => ({
    marginRight: '15px',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
    color: isActive(item.path) ? 'white' : hoveredItem === index ? item.color : 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    filter: isActive(item.path) ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' : 'none'
  });

  const logoutButtonStyle = {
    width: 'calc(100% - 24px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 20px',
    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    margin: '12px',
    outline: 'none',
    boxShadow: '0 4px 15px rgba(0, 191, 202, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <>
      <div style={sidebarStyle}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 191, 202, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(63, 186, 140, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />

        {/* Logo Section */}
        <div style={logoSectionStyle}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <img 
            src={logoImage}
            alt="PLN Logo"
            style={{
              width: '145px',
              height: 'auto',
              objectFit: 'contain',
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(203, 235, 234, 0.95)',
              boxShadow: `
                0 6px 20px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 2px 10px rgba(255, 255, 255, 0.3)
              `,
              transition: 'all 0.3s ease',
              zIndex: 1,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05) translateY(-2px)';
              e.target.style.boxShadow = `
                0 10px 25px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.15),
                inset 0 2px 12px rgba(255, 255, 255, 0.4)
              `;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = `
                0 6px 20px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 2px 10px rgba(255, 255, 255, 0.3)
              `;
            }}
          />
        </div>

        {/* Navigation Menu */}
        <div style={{
          flex: 1,
          padding: '20px 0',
          position: 'relative'
        }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              style={menuItemStyle(item, index)}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Active indicator */}
              {isActive(item.path) && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '24px',
                  background: `linear-gradient(180deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                  borderRadius: '0 2px 2px 0',
                  boxShadow: '0 0 10px rgba(0, 191, 202, 0.5)'
                }} />
              )}
              
              <span style={iconStyle(item, index)}>
                {item.icon}
              </span>
              <span style={{ 
                color: 'white',
                letterSpacing: '0.3px',
                textShadow: isActive(item.path) ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
              }}>
                {item.title}
              </span>

              {/* Hover effect background */}
              {hoveredItem === index && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${item.color}20 0%, transparent 100%)`,
                  borderRadius: '12px',
                  pointerEvents: 'none'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div style={{
          padding: '20px 0',
          position: 'relative'
        }}>
          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 191, 202, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 191, 202, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
              borderRadius: '12px',
              pointerEvents: 'none'
            }} />
            <span style={{  
              marginRight: '10px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 1
            }}>
              <LogoutIcon fontSize="small" />
            </span>
            <span style={{ zIndex: 1 }}>Logout</span>
          </button>
        </div>
      </div>

      {/* Enhanced Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 91, 113, 0.3)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '420px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease'
          }}>
            {/* Modal background gradient */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.success} 100%)`
            }} />
            
            <h3 style={{
              fontSize: '1.375rem',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Konfirmasi Logout
            </h3>
            <p style={{
              color: '#6B7280',
              marginBottom: '2rem',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              Apakah Anda yakin ingin keluar dari aplikasi?
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={cancelLogout}
                style={{
                  padding: '12px 24px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#F3F4F6';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#F9FAFB';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '12px 24px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 191, 202, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(0, 191, 202, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 191, 202, 0.3)';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
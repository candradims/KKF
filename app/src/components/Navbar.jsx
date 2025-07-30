import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const profileMenuRef = useRef(null);

  useEffect(() => {
    const routeTitles = {
      "/dashboard": "Dashboard",
      "/management-data-user": "Management Data User",
      "/data-layanan": "Data Layanan",
      "/data-pemasangan": "Data Pemasangan",
      "/laporan-lelak": "Laporan Lelak",
      "/login": "Login",
    };

    setPageTitle(routeTitles[location.pathname] || "Dashboard");
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '64px'
      }}>
        {/* Left side - Menu toggle and Page title */}
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <button
            onClick={toggleSidebar}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              marginRight: '1rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#F3F4F6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '20px' }}>☰</span>
          </button>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1F2937',
            margin: 0
          }}>
            {pageTitle}
          </h1>
        </div>

        {/* Right side - Search and Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Search Bar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{
              position: 'absolute',
              left: '12px',
              color: '#9CA3AF',
              fontSize: '16px'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search"
              style={{
                padding: '8px 12px 8px 36px',
                borderRadius: '20px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#F9FAFB',
                fontSize: '14px',
                width: '200px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00AEEF'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>

          {/* User profile button */}
          <div style={{ position: 'relative' }} ref={profileMenuRef}>
            <button
              onClick={handleProfileClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#00AEEF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  A
                </span>
              </div>
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '8px',
                width: '200px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                zIndex: 50,
                border: '1px solid #E5E7EB'
              }}>
                <div style={{
                  padding: '1rem',
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    margin: 0
                  }}>
                    Admin
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    margin: 0
                  }}>
                    admin@pln.co.id
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
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

export default Navbar;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Notifications, Settings, AccountCircle, Menu } from '@mui/icons-material';

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.startsWith("/sales")) {
      setUserRole("sales");
    } else if (path.startsWith("/admin")) {
      setUserRole("admin");
    } else if (path.startsWith("/superadmin")) {
      setUserRole("superAdmin");
    }
  }, [location.pathname]);

  useEffect(() => {
    const routeTitles = {
      "/dashboard": "Dashboard",
      "/admin/dashboard": "Dashboard",
      "/sales/dashboard": "Dashboard",
      "/superAdmin/dashboard": "Dashboard",
      "/superAdmin/data-penawaran": "Data Penawaran",
      "/data-user": "Data User",
      "/admin/data-user": "Data User",
      "/data-layanan": "Data Layanan",
      "/admin/data-layanan": "Data Layanan",
      "/data-penawaran": "Data Penawaran",
      "/admin/data-penawaran": "Data Penawaran",
      "/sales/data-penawaran": "Data Penawaran",
      "/laporan-laba": "Laporan Laba",
      "/admin/laporan-laba": "Laporan Laba",
      "/sales/laporan-laba": "Laporan Laba",
      "/pengeluaran-lain-lain": "Pengeluaran Lain-lain",
      "/sales/pengeluaran-lain-lain": "Pengeluaran Lain-lain",
      "/login": "Login",
    };

    setPageTitle(routeTitles[location.pathname] || "Dashboard");  
  }, [location.pathname]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  return (
    <>
      <div style={{
         background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
          borderBottom: 'none',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '85px',
          boxShadow: '0 4px 20px rgba(3, 91, 113, 0.15)',
          position: 'fixed',                         
          top: 0,
          left: isSidebarOpen ? '270px' : '0',
          width: isSidebarOpen ? 'calc(100% - 270px)' : '100%',
          zIndex: 100,
          overflow: 'hidden',
          transition: 'all 0.3s ease'
      }}>
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

        {/* Left side - Menu toggle and Page title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 2
        }}>
          <button
            onClick={toggleSidebar}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              marginRight: '1.5rem',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <Menu style={{ 
              fontSize: '22px', 
              color: 'white',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
            }} />
          </button>
          
          {/* Page Title with Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '6px',
              height: '32px',
              background: `linear-gradient(180deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
              borderRadius: '3px',
              boxShadow: '0 0 10px rgba(0, 191, 202, 0.5)'
            }} />
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'white',
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Center - Time and Date */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'white',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            letterSpacing: '1px',
            fontFamily: 'monospace'
          }}>
            {formatTime(currentTime)}
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.8)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            marginTop: '2px',
            letterSpacing: '0.3px'
          }}>
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Right side - Search and User Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Enhanced Search Bar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              position: 'absolute',
              left: '14px',
              zIndex: 1,
              transition: 'all 0.3s ease'
            }}>
              <Search 
                style={{
                  color: isSearchFocused ? colors.secondary : 'rgba(255, 255, 255, 0.95)',
                  fontSize: '20px',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Cari sesuatu..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                padding: '12px 16px 12px 46px',
                borderRadius: '16px',
                border: isSearchFocused 
                  ? `2px solid ${colors.secondary}` 
                  : '2px solid rgba(255, 255, 255, 1)',
                backgroundColor: isSearchFocused 
                  ? 'rgba(255, 255, 255, 0.95)' 
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                fontSize: '14px',
                width: '260px',
                outline: 'none',
                transition: 'all 0.3s ease',
                color: isSearchFocused ? colors.primary : 'white',
                fontWeight: '500',
                boxShadow: isSearchFocused 
                  ? `0 8px 25px rgba(0, 191, 202, 0.3)` 
                  : 'none'
              }}
            />
            
            {/* Search Focus Effect */}
            {isSearchFocused && (
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)`,
                animation: 'shimmer 1s ease-in-out infinite'
              }} />
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        
        * {
          scrollbar-width: none;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.95);
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default Navbar;
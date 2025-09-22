import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Notifications, Settings, AccountCircle, Menu } from '@mui/icons-material';

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userRole, setUserRole] = useState("admin");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    console.log("Raw userData from localStorage:", userDataString);
    
    let userData = {};
    try {
      userData = userDataString ? JSON.parse(userDataString) : {};
    } catch (error) {
      console.error("Error parsing userData:", error);
    }
    
    console.log("Parsed userData:", userData);
    
    console.log("Available keys in userData:", Object.keys(userData));
    
    const userName = userData.nama_user || userData.nama || userData.name || 
                    userData.email_user || userData.email || "User";
    
    const userEmail = userData.email_user || userData.email || "";
    
    console.log("Extracted user info:", { userName, userEmail });
    
    setUserName(userName);
    setUserEmail(userEmail);
    
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
      "/superAdmin/laporan-laba": "Analisis",
      "/data-user": "Data User",
      "/admin/data-user": "Data User",
      "/data-layanan": "Data Layanan",
      "/admin/data-layanan": "Data Layanan",
      "/data-penawaran": "Data Penawaran",
      "/admin/data-penawaran": "Data Penawaran",
      "/sales/data-penawaran": "Data Penawaran",
      "/laporan-laba": "Analisis",
      "/admin/laporan-laba": "Analisis",
      "/sales/laporan-laba": "Analisis",
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

  const getRoleDisplayName = (role) => {
    switch(role) {
      case "sales": return "Sales";
      case "admin": return "Admin";
      case "superAdmin": return "Super Admin";
      default: return "User";
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
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
          transition: 'all 0.3s ease',
          fontFamily: "'Open Sans', sans-serif",
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
            letterSpacing: '1px'
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

        {/* Right side - User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 2
        }}>
          {/* User Profile Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.9rem',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4px 0',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.25)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '220px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* Avatar with Gradient Border + Status */}
            <div style={{
              position: 'relative',
              width: '50px',
              height: '45px',
              borderRadius: '50%',
              padding: '3px',
              background: `conic-gradient(${colors.secondary}, ${colors.success}, ${colors.accent2}, ${colors.secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '90%',
                height: '90%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#1e293b,#334155)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                color: 'white',
                boxShadow: '0 0 12px rgba(0,191,202,0.5) inset'
              }}>
                {getInitials(userName)}
              </div>

              {/* Status dot (online) */}
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#3fba8c',
                border: '2px solid #1e293b'
              }} />
            </div>

            {/* User Info */}
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '2px',
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {userName}
              </div>
              <div style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontStyle: 'italic'
              }}>
                {userEmail || getRoleDisplayName(userRole)}
              </div>
            </div>
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
      `}</style>
    </>
  );
};

export default Navbar;
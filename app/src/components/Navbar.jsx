import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from '@mui/icons-material';

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const routeTitles = {
      "/dashboard": "Dashboard",
      "/admin/dashboard": "Dashboard",
      "/sales/dashboard": "Dashboard",
      "/data-user": "DataUser",
      "/admin/data-user": "DataUser",
      "/data-layanan": "DataLayanan",
      "/admin/data-layanan": "DataLayanan",
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

        {/* Right side - Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          {/* Search Bar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search 
              style={{
                position: 'absolute',
                left: '12px',
                color: '#9CA3AF',
                fontSize: '20px',
                zIndex: 1
              }}
            />
            <input
              type="text"
              placeholder="Search"
              style={{
                padding: '8px 12px 8px 40px',
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
        </div>
      </div>
    </>
  );
};

export default Navbar;
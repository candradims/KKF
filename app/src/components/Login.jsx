import React, { useState, useEffect } from 'react';
import logoImage from '../assets/Logo_PLN_Icon_Plus.png';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const style = document.createElement('style');
    style.innerHTML = `
      html, body {
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
      }
      
      @media (min-width: 1024px) {
        h2 {
          font-size: 2.25rem !important;
        }
        input, select {
          font-size: 1rem !important;
        }
      }

      @media (max-width: 768px) {
        .form-row {
          flex-direction: column !important;
          align-items: stretch !important;
        }

        .form-row label {
          width: 100% !important;
          margin-bottom: 0.25rem;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
      document.head.removeChild(link);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.role) {
      setMessage({ type: 'error', text: 'Semua field harus diisi!' });
      return;
    }

    console.log('Login data submitted:', formData);
    setShowModal(true);
    
    if (formData.role === 'sales') {
      console.log('Simulating navigation to /sales/dashboard');
    } else if (formData.role === 'admin') {
      console.log('Simulating navigation to /admin/dashboard');
    }
  };

  const handleForgotPassword = () => {
    navigate('/lupa-password');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E2EAFF',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{
        width: '100%',
        height: '4rem',
        backgroundColor: '#00AEEF',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000
      }} />

      <div style={{ 
        width: '100%',
        maxWidth: '1200px',
        padding: '1rem',
        boxSizing: 'border-box',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      }}>
        {/* Logo & Welcome */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          animation: 'fadeInDown 1s ease-out',
          width: '100%'
        }}>
          <img
            src={logoImage}
            alt="PLN Icon Plus Logo"
            style={{
              height: '6.5rem',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
            }}
          />
          <h2 style={{
            fontSize: '2rem',
            color: '#2D396B',
            fontWeight: '500',
            marginTop: '3.25rem',
            background: 'linear-gradient(90deg, #00AEEF, #2D396B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
          }}>
            Selamat Datang di Sistem PLN Icon Plus
          </h2>
          <p style={{
            color: '#2D396B',
            fontSize: '1.05rem',
            marginTop: '0.5rem',
            fontWeight: '500'
          }}>
            Silakan masuk untuk melanjutkan akses sistem
          </p>
          {showModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}>
              <div style={{
                backgroundColor: '#F9FAFF',
                borderRadius: '1rem',
                padding: '2rem 4rem',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                maxWidth: '350px',
                width: '90%',
                position: 'relative'
              }}>
                <div style={{
                  backgroundColor: '#00AEEF',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#fff" viewBox="0 0 20 20" >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.004 8.004a1 1 0 01-1.414 0L3.293 10.707a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 style={{ color: '#2D396B', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Selamat!</h3>
                <p style={{ color: '#2D396B', marginBottom: '1.5rem' }}>Login Anda Berhasil ...</p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    if (formData.role === 'sales') {
                      navigate('/sales/dashboard');
                    } else if (formData.role === 'admin') {
                      navigate('/admin/dashboard');
                    }
                  }}
                  style={{
                    backgroundColor: '#00AEEF',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.6rem 4rem',
                    color: 'white',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.95rem'
                  }}
                >
                  Oke
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.25rem',
                    color: '#333',
                    cursor: 'pointer'
                  }}
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Box */}
        {message.text && (
          <div
            style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: '1px solid',
              backgroundColor: message.type === 'error' ? '#FEE2E2' : message.type === 'success' ? '#D1FAE5' : '#DBEAFE',
              color: message.type === 'error' ? '#DC2626' : message.type === 'success' ? '#059669' : '#2563EB',
              borderColor: message.type === 'error' ? '#FCA5A5' : message.type === 'success' ? '#6EE7B7' : '#93C5FD',
              maxWidth: '780px',
              width: '100%',
              margin: '0 auto'
            }}
          >
            {message.text}
          </div>
        )}

        {/* Form Container */}
        <div style={{
          backgroundColor: '#E9EDF7',
          borderRadius: '1.85rem',
          boxShadow: '0 4px 6px -1px rgba(45, 57, 107, 0.1), 0 2px 4px -1px rgba(45, 57, 107, 0.06)',
          padding: '2.5rem 3rem',
          border: '2px solid #2D396B',
          width: '100%',
          maxWidth: '780px',
          margin: '0 auto',
          transition: 'all 0.3s ease-in-out',
          boxSizing: 'border-box'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Email */}
            <div className="form-row" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <label htmlFor="email" style={{
                width: '30%',
                minWidth: '120px',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#2D396B',
              }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Masukkan Email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  flex: 1,
                  minWidth: '250px',
                  padding: '0.85rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  backgroundColor: '#F9FAFB',
                  color: '#2D396B',
                  boxSizing: 'border-box',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500'
                }}
                required
              />
            </div>

            {/* Password */}
            <div className="form-row" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <label htmlFor="password" style={{
                width: '30%',
                minWidth: '120px',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#2D396B',
              }}>
                Password
              </label>
              <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Masukkan Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    paddingRight: '2.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    backgroundColor: '#F9FAFB',
                    color: '#2D396B',
                    boxSizing: 'border-box',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '500'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#2D396B',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '500'
                  }}
                >
                {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2D396B" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2D396B" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="form-row" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <label htmlFor="role" style={{
                width: '30%',
                minWidth: '120px',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#2D396B',
              }}>
                Role
              </label>
              <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    paddingRight: '2.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    backgroundColor: '#F9FAFB',
                    color: '#2D396B',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '500'
                  }}
                  required
                >
                  <option value="">Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                </select>
                <span style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2D396B" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Checkbox & Forgot Password */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.5rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  style={{
                    width: '1.1rem',
                    height: '1.1rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #00AEEF',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '500'
                  }}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    e.target.style.backgroundColor = checked ? '#00AEEF' : '#ffffff';
                    e.target.style.backgroundImage = checked
                      ? "url('data:image/svg+xml;utf8,<svg fill=\"white\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8.004 8.004a1 1 0 01-1.414 0L3.293 10.707a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\"/></svg>')"
                      : 'none';
                    e.target.style.backgroundRepeat = 'no-repeat';
                    e.target.style.backgroundPosition = 'center';
                    e.target.style.backgroundSize = '0.8rem';
                  }}
                />
                <label htmlFor="rememberMe" style={{
                  fontSize: '0.9rem',
                  color: '#2D396B',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500'
                }}>
                  Tetap Masuk
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#00AEEF',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '30%',
                padding: '1rem',
                borderRadius: '0.95rem',
                alignSelf: 'center',
                color: '#FCFEFF',
                fontSize: '1rem',
                fontWeight: '500',
                backgroundColor: '#00AEEF',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: '1rem',
                boxShadow: '0 4px 6px -1px rgba(45, 57, 107, 0.1), 0 2px 4px -1px rgba(45, 57, 107, 0.06)',
                fontFamily: 'Poppins, sans-serif'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0088CC';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(45, 57, 107, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#00AEEF';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(45, 57, 107, 0.1), 0 2px 4px -1px rgba(45, 57, 107, 0.06)';
              }}
            >
              LOGIN
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer style={{
          position: 'fixed',
          left: '1rem',
          bottom: '1rem',
          fontSize: '0.85rem',
          color: '#6B7280',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '500'
        }}>
          &copy; {new Date().getFullYear()} PLN Icon Plus. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default App;
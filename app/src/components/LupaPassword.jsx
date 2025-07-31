import React, { useState, useEffect } from 'react';
import logoImage from '../assets/Logo_PLN_Icon_Plus.png';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      @keyframes checkmarkPulse {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
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

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Semua field harus diisi!' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password dan konfirmasi password tidak cocok!' });
      return;
    }

    console.log('Simpan Password:', formData);
    setShowModal(true);
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
      {/* Top Blue Bar */}
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
            Silakan Ubah Password untuk melanjutkan akses sistem
          </p>
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
                Password Baru
              </label>
              <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Masukkan Password Baru"
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
                    cursor: 'pointer',
                    padding: '0.25rem'
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

            {/* Confirm Password */}
            <div className="form-row" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <label htmlFor="confirmPassword" style={{
                width: '30%',
                minWidth: '120px',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#2D396B',
              }}>
                Ulangi Password
              </label>
              <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Ulangi Password Baru"
                  value={formData.confirmPassword}
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
                    cursor: 'pointer',
                    padding: '0.25rem'
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
              SIMPAN
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
            <p style={{ color: '#2D396B', marginBottom: '1.5rem' }}>Password Anda Berhasil Di Perbarui...</p>
            <button
              onClick={() => {
                setShowModal(false);
                  navigate('/login');
              }}
              style={{
                backgroundColor: '#00AEEF',
                border: 'none',
                borderRadius: '12px',
                padding: '0.6rem 4rem',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(0, 174, 239, 0.2)',
                minWidth: '120px'
              }}
            >
              Oke
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 174, 239, 0.1)';
                e.currentTarget.style.color = '#00AEEF';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
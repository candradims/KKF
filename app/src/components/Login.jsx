import React, { useState, useEffect } from 'react';
import logoImage from '../assets/Logo_PLN_Icon_Plus.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      html, body {
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
        overflow-x: hidden;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        min-height: 100vh;
      }
      
      * {
        box-sizing: border-box;
      }

      @media (max-width: 768px) {
        .form-container {
          padding: 1.5rem !important;
          margin: 1rem !important;
          width: 90% !important;
        }

        .login-button {
          width: 100% !important;
        }

        .welcome-title {
          font-size: 1.8rem !important;
        }

        .logo-img {
          height: 90px !important;
        }
      }

      @media (max-width: 480px) {
        .welcome-title {
          font-size: 1.5rem !important;
        }

        .form-container {
          padding: 1.25rem !important;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password || !formData.role) {
      setMessage({ type: 'error', text: 'Semua field harus diisi!' });
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔐 Attempting login with:", { 
        email: formData.email, 
        role: formData.role,
        passwordLength: formData.password.length 
      });
      
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_user: formData.email,
          kata_sandi: formData.password,
          role_user: formData.role
        })
      });

      const result = await response.json();
      console.log("🔐 Login response status:", response.status);
      console.log("🔐 Login response body:", result);

      if (response.ok && result.success) {
        // Simpan data user ke localStorage
        localStorage.setItem('userData', JSON.stringify(result.data));
        localStorage.setItem('userRole', result.data.role_user);
        
        setMessage({ type: "success", text: "Login berhasil!" });
        setShowModal(true);
        setIsLoading(false);
      } else {
        // Handle specific error messages from server
        let errorMessage = "Login gagal";
        
        if (result.message === "Email tidak ditemukan") {
          errorMessage = "Email tidak terdaftar dalam sistem";
        } else if (result.message === "Password salah") {
          errorMessage = "Password yang Anda masukkan salah";
        } else if (result.message === "Akun tidak aktif") {
          errorMessage = "Akun Anda tidak aktif. Hubungi administrator";
        } else if (result.message && result.message.includes("Role tidak sesuai")) {
          errorMessage = "Role yang dipilih tidak sesuai dengan akun Anda";
        } else {
          errorMessage = result.message || "Login gagal";
        }
        
        setMessage({ 
          type: "error", 
          text: errorMessage
        });
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error("❌ Login error:", error);
      setMessage({ 
        type: "error", 
        text: "Terjadi kesalahan koneksi server" 
      });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/lupa-password');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}10 50%, ${colors.success}15 100%)`,
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1rem'
    }}>
      
      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.secondary}20 0%, transparent 70%)`,
        animation: 'float 8s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-5%',
        left: '-5%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
        animation: 'float 6s ease-in-out infinite 1s'
      }} />

      {/* Main Content Container */}
      <div style={{
        width: '100%',
        maxWidth: '450px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        animation: 'fadeIn 1s ease-out'
      }}>
        
        {/* Logo & Welcome */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
          width: '100%'
        }}>
          <div style={{
            marginBottom: '1.5rem',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <img
              src={logoImage}
              alt="PLN Icon Plus Logo"
              className="logo-img"
              style={{
                height: '120px',
                width: 'auto',
                objectFit: 'contain',
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '20px',
                boxShadow: `0 15px 35px rgba(3, 91, 113, 0.2)`,
                border: `2px solid ${colors.primary}20`
              }}
            />
          </div>
          <h2 className="welcome-title" style={{
            fontSize: '2.2rem',
            color: colors.primary,
            fontWeight: '700',
            marginBottom: '0.5rem',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Sistem Manajemen PLN
          </h2>
          <p style={{
            color: colors.primary,
            fontSize: '1rem',
            fontWeight: '400',
            opacity: 0.8
          }}>
            Masuk untuk mengakses dashboard
          </p>
        </div>

        {/* Message Box */}
        {message.text && (
          <div
            style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '500',
              border: '1px solid',
              backgroundColor: message.type === 'error' ? '#FEE2E2' : '#D1FAE5',
              color: message.type === 'error' ? '#DC2626' : '#059669',
              borderColor: message.type === 'error' ? '#FCA5A5' : '#6EE7B7',
              width: '100%',
              animation: 'fadeIn 0.5s ease-out',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {message.type === 'error' ? '⚠️' : '✅'} {message.text}
          </div>
        )}

        {/* Form Container */}
        <div className="form-container" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: `0 20px 40px rgba(3, 91, 113, 0.15)`,
          padding: '2.5rem',
          border: `1px solid ${colors.primary}20`,
          width: '100%'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Email */}
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: colors.primary,
                marginBottom: '0.5rem'
              }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email@pln.co.id"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: `1px solid ${colors.primary}30`,
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  backgroundColor: '#F9FAFB',
                  color: colors.primary,
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.secondary;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${colors.primary}30`;
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: colors.primary,
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    paddingRight: '3rem',
                    border: `1px solid ${colors.primary}30`,
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    backgroundColor: '#F9FAFB',
                    color: colors.primary,
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.secondary;
                    e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${colors.primary}30`;
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: colors.primary,
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.25rem',
                    opacity: 0.6,
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '1'}
                  onMouseOut={(e) => e.target.style.opacity = '0.6'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label htmlFor="role" style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: colors.primary,
                marginBottom: '0.5rem'
              }}>
                Role
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    paddingRight: '3rem',
                    border: `1px solid ${colors.primary}30`,
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    backgroundColor: '#F9FAFB',
                    color: colors.primary,
                    appearance: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.secondary;
                    e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${colors.primary}30`;
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                >
                  <option value="">Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
                <span style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: colors.primary
                }}>
                  ▼
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
                    width: '1.2rem',
                    height: '1.2rem',
                    backgroundColor: '#ffffff',
                    border: `2px solid ${colors.primary}50`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    e.target.style.backgroundColor = checked ? colors.secondary : '#ffffff';
                    e.target.style.borderColor = checked ? colors.secondary : `${colors.primary}50`;
                  }}
                />
                <label htmlFor="rememberMe" style={{
                  fontSize: '0.9rem',
                  color: colors.primary,
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Ingat saya
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: colors.secondary,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = colors.primary;
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = colors.secondary;
                  e.target.style.textDecoration = 'none';
                }}
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '1.5rem',
                boxShadow: `0 4px 15px ${colors.secondary}40`,
                opacity: isLoading ? 0.7 : 1,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 6px 20px ${colors.secondary}60`;
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 4px 15px ${colors.secondary}40`;
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    animation: 'loading 1.5s infinite'
                  }} />
                  <span>Memproses...</span>
                </>
              ) : (
                'MASUK'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '3rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: `${colors.primary}80`,
          fontWeight: '500'
        }}>
          © {new Date().getFullYear()} PLN Icon Plus. All rights reserved.
        </footer>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 91, 113, 0.3)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
            border: '1px solid rgba(0,0,0,0.05)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease'
          }}>
            {/* garis gradiasi */}
             <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.success} 100%)`
            }} />
            {/* Animated Success Icon */}
            <div style={{
              margin: '0 auto 1.5rem',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 10px 20px ${colors.success}40`
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 52 52" 
                width="50" height="50">
                <circle cx="26" cy="26" r="25" fill="none" stroke="white" strokeWidth="2"/>
                <path fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                  d="M16 26l8 8 16-16">
                  <animate attributeName="stroke-dasharray" from="0,50" to="50,0" dur="0.5s" fill="freeze"/>
                </path>
              </svg>
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: '0.5rem'
            }}>
              Login Berhasil!
            </h3>

            {/* Subtext */}
            <p style={{
              color: `${colors.primary}CC`,
              fontSize: '0.95rem',
              marginBottom: '2rem'
            }}>
              Selamat datang kembali <br/>
              Anda akan diarahkan ke dashboard sesuai role Anda.
            </p>

            {/* Button */}
            <button
              onClick={() => {
                setShowModal(false);
                if (formData.role === 'sales') navigate('/sales/dashboard');
                else if (formData.role === 'admin') navigate('/admin/dashboard');
                else if (formData.role === 'superAdmin') navigate('/superAdmin/dashboard');
              }}
              style={{
                padding: '14px 36px',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 6px 16px ${colors.secondary}50`
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 8px 20px ${colors.secondary}60`;
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 6px 16px ${colors.secondary}50`;
              }}
            >
              OKE
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import logoImage from '../assets/Logo_PLN_Icon_Plus.png';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState('');

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
    lightBg: '#f8fafc',
    dark: '#004d59',
    darker: '#00363d'
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(40px) scale(0.95); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
        }
      }

      @keyframes slideInFromLeft {
        from { 
          opacity: 0; 
          transform: translateX(-50px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }

      @keyframes slideInFromRight {
        from { 
          opacity: 0; 
          transform: translateX(50px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }

      @keyframes morphing {
        0% { transform: scale(1) rotate(0deg); border-radius: 50%; }
        25% { transform: scale(1.1) rotate(90deg); border-radius: 20%; }
        50% { transform: scale(0.9) rotate(180deg); border-radius: 50%; }
        75% { transform: scale(1.05) rotate(270deg); border-radius: 30%; }
        100% { transform: scale(1) rotate(360deg); border-radius: 50%; }
      }

      @keyframes floating {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-15px) rotate(1deg); }
        66% { transform: translateY(-5px) rotate(-1deg); }
      }
      
      @keyframes glowing {
        0% { box-shadow: 0 0 20px ${colors.secondary}30; }
        50% { box-shadow: 0 0 30px ${colors.secondary}60, 0 0 40px ${colors.primary}30; }
        100% { box-shadow: 0 0 20px ${colors.secondary}30; }
      }
      
      @keyframes shimmerGold {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
      }

      @keyframes textShine {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      
      input::placeholder {
        font-style: italic;
        color: #94a3b8;
        font-weight: 400;
      }
      
      html, body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', sans-serif;
        overflow-x: hidden;
        background: linear-gradient(135deg, ${colors.darker} 0%, ${colors.dark} 50%, ${colors.primary} 100%);
        min-height: 100vh;
        position: relative;
      }

      * {
        box-sizing: border-box;
      }

      .glass-effect {
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .input-glow:focus {
        box-shadow: 0 0 0 3px ${colors.secondary}30, 0 8px 25px ${colors.secondary}20 !important;
        border-color: ${colors.secondary} !important;
      }

      .button-hover:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 35px ${colors.secondary}40;
      }

      .text-gradient {
        background: linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 50%, ${colors.primary} 100%);
        background-size: 200% 200%;
        animation: textShine 3s ease-in-out infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      @media (max-width: 768px) {
        .form-container {
          padding: 2rem 1.5rem !important;
          margin: 1rem !important;
          width: 95% !important;
        }

        .welcome-title {
          font-size: 2rem !important;
        }

        .logo-container {
          margin-bottom: 2rem !important;
        }
      }

      @media (max-width: 480px) {
        .welcome-title {
          font-size: 1.8rem !important;
        }

        .form-container {
          padding: 1.5rem !important;
        }
      }
        @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.3); opacity: 1; }
      }

      @keyframes flow {
        0% { opacity: 0.5; transform: translateX(0); }
        50% { opacity: 1; transform: translateX(15px); }
        100% { opacity: 0.5; transform: translateX(0); }
      }

      @keyframes flicker {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
        20%, 24%, 55% { opacity: 0.4; }
      }
      
      @keyframes rotateOrb {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
      }

      @keyframes glowMove {
        0% { transform: translateX(-50%); opacity: 0; }
        50% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(50%); opacity: 0; }
      }

      @keyframes zigzag {
        0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
        25% { transform: translateX(-10px) translateY(10px) rotate(-5deg); }
        50% { transform: translateX(10px) translateY(-10px) rotate(5deg); }
        75% { transform: translateX(-5px) translateY(5px) rotate(-3deg); }
      }
    `;
    document.head.appendChild(style);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.head.removeChild(style);
      document.head.removeChild(link);
      window.removeEventListener('mousemove', handleMouseMove);
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

      if (response.ok && result.success) {
        localStorage.setItem('userData', JSON.stringify(result.data));
        localStorage.setItem('userRole', result.data.role_user);
        
        setMessage({ type: "success", text: "Login berhasil!" });
        setShowModal(true);
        setIsLoading(false);
      } else {
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
        
        setMessage({ type: "error", text: errorMessage });
        setIsLoading(false);
      }
      
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi server" });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/lupa-password');
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: `linear-gradient(135deg, ${colors.darker} 0%, ${colors.dark} 50%, ${colors.primary} 100%)`
    }}>
      
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, ${colors.secondary}40 0%, transparent 0%),
          radial-gradient(circle at 80% 20%, ${colors.accent1}30 0%, transparent 0%),
          linear-gradient(180deg, ${colors.accent2} 0%, ${colors.primary} 0%, ${colors.tertiary} 100%)
        `
      }} />

      {/* Floating geometric shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '120px',
        height: '120px',
        background: `linear-gradient(45deg, ${colors.secondary}55, ${colors.accent1}55)`,
        animation: 'morphing 8s ease-in-out infinite',
        filter: 'blur(2px)',
        borderRadius: "20%"
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        width: '90px',
        height: '90px',
        background: `linear-gradient(45deg, ${colors.primary}60, ${colors.tertiary}50)`,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        animation: 'floating 6s ease-in-out infinite 1s',
        boxShadow: `0 0 25px ${colors.primary}40`,
      }} />

      <div style={{
        position: 'absolute',
        top: '30%',
        left: '5%',
        width: '70px',
        height: '70px',
        background: `linear-gradient(45deg, ${colors.accent1}70, ${colors.secondary}60)`,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        animation: 'floating 7s ease-in-out infinite 2s',
        boxShadow: `0 0 20px ${colors.accent1}55`
      }} />

      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundImage: `linear-gradient(90deg, ${colors.primary}15 1px, transparent 1px),
                          linear-gradient(180deg, ${colors.primary}15 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        zIndex: 0
      }} />

      {[
        { top: '20%', left: '30%', color: colors.accent1 },
        { top: '50%', left: '60%', color: colors.secondary },
        { top: '70%', left: '25%', color: colors.accent2 },
        { top: '40%', left: '80%', color: colors.primary },
      ].map((node, idx) => (
        <div key={idx} style={{
          position: 'absolute',
          top: node.top,
          left: node.left,
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: node.color,
          boxShadow: `0 0 20px ${node.color}, 0 0 40px ${node.color}55`,
          animation: `pulse ${3 + idx}s ease-in-out infinite`
        }} />
      ))}

      <div style={{
        position: 'absolute',
        top: '21%',
        left: '31%',
        width: '150px',
        height: '2px',
        background: `linear-gradient(90deg, ${colors.accent1}, ${colors.secondary})`,
        boxShadow: `0 0 10px ${colors.secondary}`,
        animation: 'flow 6s linear infinite'
      }} />

      <div style={{
        position: 'absolute',
        top: '52%',
        left: '26%',
        width: '200px',
        height: '2px',
        background: `linear-gradient(90deg, ${colors.accent2}, ${colors.primary})`,
        boxShadow: `0 0 10px ${colors.accent2}`,
        animation: 'flow 8s linear infinite'
      }} />

      <div style={{
        position: 'absolute',
        top: '30%',
        right: '15%',
        width: '50px',
        height: '50px',
        background: `linear-gradient(135deg, ${colors.accent2}, ${colors.primary})`,
        clipPath: 'polygon(50% 0%, 60% 35%, 40% 35%, 55% 70%, 35% 70%, 50% 100%, 20% 60%, 40% 60%, 30% 30%, 50% 30%)',
        filter: 'drop-shadow(0 0 15px rgba(255,255,0,0.8))',
        animation: 'flicker 2s infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '15%',
        width: '40px',
        height: '40px',
        background: `linear-gradient(135deg, ${colors.accent1}, ${colors.secondary})`,
        clipPath: 'polygon(50% 0%, 60% 35%, 40% 35%, 55% 70%, 35% 70%, 50% 100%, 20% 60%, 40% 60%, 30% 30%, 50% 30%)',
        filter: 'drop-shadow(0 0 12px rgba(255,255,0,0.9))',
        animation: 'flicker 1.8s infinite'
      }} />

      <div style={{
        position: 'absolute',
        top: '65%',
        right: '20%',
        width: '60px',
        height: '60px',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent2})`,
        clipPath: 'polygon(50% 0%, 60% 35%, 40% 35%, 55% 70%, 35% 70%, 50% 100%, 20% 60%, 40% 60%, 30% 30%, 50% 30%)',
        filter: 'drop-shadow(0 0 20px rgba(255,255,0,1))',
        animation: 'zigzag 3s infinite ease-in-out'
      }} />

      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accent2} 20%, transparent 70%)`,
        boxShadow: `0 0 25px ${colors.accent2}aa`,
        animation: 'rotateOrb 10s linear infinite'
      }} />

      <div style={{
        position: 'absolute',
        top: '75%',
        left: '10%',
        width: '250px',
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
        animation: 'glowMove 5s linear infinite'
      }} />

      {/* Interactive cursor glow */}
      <div style={{
        position: 'absolute',
        left: mousePosition.x - 150,
        top: mousePosition.y - 150,
        width: '300px',
        height: '300px',
        background: `radial-gradient(circle, ${colors.secondary}05 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'all 0.3s ease',
        borderRadius: '50%'
      }} />

      {/* Main Content Container */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        animation: 'fadeInUp 1s ease-out'
      }}>
        
        {/* Logo & Welcome Section */}
        <div className="logo-container" style={{
          textAlign: 'center',
          marginBottom: '3rem',
          width: '100%'
        }}>
          <div style={{
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'center',
            animation: 'slideInFromLeft 1s ease-out 0.3s both'
          }}>
            <div style={{
              position: 'relative',
              display: 'inline-block'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
                borderRadius: '16px'
              }} />
              <img
                src={logoImage}
                alt="PLN Icon Plus Logo"
                style={{
                  height: '130px',
                  width: 'auto',
                  objectFit: 'contain',
                  backgroundColor: 'rgba(203, 235, 234, 0.95)',
                  padding: '20px',
                  borderRadius: '16px',
                  boxShadow: `
                    0 6px 20px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 2px 10px rgba(255, 255, 255, 0.3)
                  `,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  zIndex: 2,
                  transition: 'all 0.3s ease'
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
              {/* Animated background rings */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                right: '-15px',
                bottom: '-15px',
                background: `conic-gradient(from 0deg, ${colors.secondary}, ${colors.accent1}, ${colors.primary}, ${colors.secondary})`,
                borderRadius: '28px',
                zIndex: 1,
                filter: 'blur(8px)',
                opacity: 0.6,
                animation: 'floating 4s ease-in-out infinite'
              }} />
            </div>
          </div>
          
         <h1 className="welcome-title" style={{
            fontSize: '3rem',
            fontWeight: '900',
            marginBottom: '0.5rem',
            
            letterSpacing: '-0.03em',
            background: 'linear-gradient(90deg, #00E0FF, #00FFA3, #008bb0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 25px rgba(0, 224, 255, 0.3), 0 2px 15px rgba(0, 255, 163, 0.25)',
            animation: 'glowText 3s infinite alternate ease-in-out, slideInFromRight 1s ease-out 0.5s both'
          }}>
            PLN FinNeta
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.2rem',
            fontWeight: '500',
            margin: 0,
            letterSpacing: '0.5px',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 1s ease-out 0.7s both'
          }}>
            Financial Network Feasibility System
          </p>
        </div>

        {/* Enhanced Message Box */}
        {message.text && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              borderRadius: '16px',
              fontSize: '0.95rem',
              fontWeight: '500',
              border: '1px solid',
              backgroundColor: message.type === 'error' 
                ? 'rgba(239, 68, 68, 0.1)' 
                : 'rgba(34, 197, 94, 0.1)',
              color: message.type === 'error' ? '#f87171' : '#4ade80',
              borderColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
              width: '100%',
              animation: 'fadeInUp 0.5s ease-out',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: message.type === 'error' 
                ? '0 8px 25px rgba(239, 68, 68, 0.15)'
                : '0 8px 25px rgba(34, 197, 94, 0.15)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>
              {message.type === 'error' ? '⚠️' : '✅'}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Enhanced Form Container */}
        <div className="form-container glass-effect" style={{
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
          animation: 'fadeInUp 1s ease-out 0.9s both'
        }}>
          
          {/* Animated gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 'px',
            background: `linear-gradient(90deg, ${colors.secondary}, ${colors.accent1}, ${colors.tertiary}, ${colors.secondary})`,
            backgroundSize: '300% 100%',
            animation: 'shimmerGold 3s ease-in-out infinite'
          }} />

          <form onSubmit={handleSubmit} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2rem', 
            position: 'relative', 
            zIndex: 2 
          }}>

            {/* Enhanced Email Field */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
                letterSpacing: '0.5px'
              }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Masukkan Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className="input-glow"
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.25rem 1.25rem 3.5rem',
                    border: `2px solid ${focusedField === 'email' ? colors.secondary : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '16px',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  required
                />
                <div style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.25rem',
                  color: focusedField === 'email' ? colors.secondary : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease'
                }}>
                  ✉️
                </div>
                {/* Focus indicator */}
                {focusedField === 'email' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50%',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)`,
                    animation: 'shimmerGold 1s ease-in-out infinite'
                  }} />
                )}
              </div>
            </div>

           {/* Enhanced Password Field */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
                letterSpacing: '0.5px'
              }}>
                Kata Sandi
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Masukkan Kata Sandi"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className="input-glow"
                  style={{
                    width: '100%',
                    padding: '1.25rem 4rem 1.25rem 3.5rem',
                    border: `2px solid ${focusedField === 'password' ? colors.secondary : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '16px',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  required
                />
                <div style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.25rem',
                  color: focusedField === 'password' ? colors.secondary : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease'
                }}>
                  🔐
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent', 
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: '0.5rem',
                    borderRadius: '10px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  {showPassword ? <Eye color="white" size={22} /> :  <EyeOff color="white" size={22} />}
                </button>
                {focusedField === 'password' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50%',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)`,
                    animation: 'shimmerGold 1s ease-in-out infinite'
                  }} />
                )}
              </div>
            </div>

            {/* Enhanced Role Dropdown */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="role" style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
                letterSpacing: '0.5px'
              }}>
                Role
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('role')}
                  onBlur={() => setFocusedField('')}
                  className="input-glow"
                  style={{
                    width: '100%',
                    padding: '1.25rem 4rem 1.25rem 3.5rem',
                    border: `2px solid ${focusedField === 'role' ? colors.secondary : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '16px',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    color: formData.role ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    appearance: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  required
                >
                  <option value="" disabled hidden style={{ backgroundColor: colors.dark, color: 'white' }}>
                    Pilih Role 
                  </option>
                  <option value="superAdmin" style={{ backgroundColor: colors.dark, color: 'white' }}>
                    👑 Super Admin
                  </option>
                  <option value="admin" style={{ backgroundColor: colors.dark, color: 'white' }}>
                    👨‍💼 Admin
                  </option>
                  <option value="sales" style={{ backgroundColor: colors.dark, color: 'white' }}>
                    💼 Sales
                  </option>
                </select>
                <div style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.25rem',
                  color: focusedField === 'role' ? colors.secondary : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease'
                }}>
                  👤
                </div>
                <div style={{
                  position: 'absolute',
                  right: '1.95rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'white',
                  fontSize: '1rem'
                }}>
                  ▼
                </div>
                {focusedField === 'role' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50%',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)`,
                    animation: 'shimmerGold 1s ease-in-out infinite'
                  }} />
                )}
              </div>
            </div>

            {/* Enhanced Options Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.5rem'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="checkbox"
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: `2px solid rgba(255, 255, 255, 0.2)`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      appearance: 'none',
                      position: 'relative'
                    }}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      e.target.style.backgroundColor = checked ? colors.secondary : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.borderColor = checked ? colors.secondary : 'rgba(255, 255, 255, 0.2)';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '0.8rem',
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.2s ease'
                  }}>
                    ✓
                  </div>
                </div>
                Ingat Saya
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: colors.accent1,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.backgroundColor = 'rgba(0, 139, 176, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = colors.accent1;
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Lupa Kata Sandi ?
              </button>
            </div>

            {/* Premium Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="button-hover"
              style={{
                width: '100%',
                padding: '1.25rem',
                borderRadius: '16px',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                background: isLoading 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                backgroundSize: '200% 200%',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.4s ease',
                marginTop: '2rem',
                boxShadow: isLoading 
                  ? 'none'
                  : `0 8px 25px ${colors.secondary}30`,
                opacity: isLoading ? 0.6 : 1,
                position: 'relative',
                overflow: 'hidden',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
              onMouseEnter={() => {
                if (!isLoading) {
                  setIsHovered(true);
                }
              }}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
              ) : (
                <>
                  <span>Masuk</span>
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                      animation: 'shimmerGold 1.5s infinite'
                    }} />
                  )}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Enhanced Footer */}
        <footer style={{
          marginTop: '3rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: '500',
          letterSpacing: '0.5px'
        }}>
         © {new Date().getFullYear()} PLN Icon Plus • Financial Network Feasibility System
        </footer>
      </div>

      {/* Premium Success Modal */}
      {showModal && (
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
          zIndex: 1000,
          animation: 'fadeInUp 0.3s ease'
        }}>
          <div className="glass-effect" style={{
            borderRadius: '28px',
            padding: '3rem 2.5rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeInUp 0.4s ease 0.1s both',
            background: '#0d1b2a',
          }}>
            
            {/* Animated top border */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${colors.secondary}, ${colors.accent1}, ${colors.success}, ${colors.secondary})`,
              backgroundSize: '300% 100%',
              animation: 'shimmerGold 2s ease-in-out infinite'
            }} />

            {/* Success Animation */}
            <div style={{
              margin: '0 auto 2rem',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.secondary} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 15px 30px ${colors.success}40`,
              animation: 'glowing 2s ease-in-out infinite'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 52 52" 
                width="55" height="55">
                <circle cx="26" cy="26" r="25" fill="none" stroke="white" strokeWidth="3"/>
                <path fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                  d="M16 26l8 8 16-16">
                  <animate attributeName="stroke-dasharray" from="0,60" to="60,0" dur="0.6s" fill="freeze"/>
                </path>
              </svg>
            </div>

            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              SELAMAT!
            </h3>

            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem',
              marginBottom: '2.5rem',
              lineHeight: '1.6'
            }}>
              Anda berhasil masuk ke sistem. <br/>
              Mengarahkan ke dashboard sesuai peran Anda...
            </p>

            <button
              onClick={() => {
                setShowModal(false);
                if (formData.role === 'sales') navigate('/sales/dashboard');
                else if (formData.role === 'admin') navigate('/admin/dashboard');
                else if (formData.role === 'superAdmin') navigate('/superAdmin/dashboard');
              }}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: 'white',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 8px 20px ${colors.secondary}40`,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = `0 12px 25px ${colors.secondary}50`;
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = `0 8px 20px ${colors.secondary}40`;
              }}
            >
              OKE
            </button>
          </div>
        </div>
      )}

      {/* Additional Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        input:checked + div {
          opacity: 1 !important;
        }

        select option {
          background-color: #1e293b !important;
          color: white !important;
          padding: 0.5rem !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
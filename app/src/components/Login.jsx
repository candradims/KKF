import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo-pln.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.email || !formData.password || !formData.role) {
      alert('Semua field harus diisi!');
      return;
    }

    // Simpan data user ke localStorage (simulasi login)
    const userData = {
      email: formData.email,
      role: formData.role,
      isLoggedIn: true
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Navigasi berdasarkan role
    if (formData.role === 'sales') {
      navigate('/sales/dashboard');
    } else if (formData.role === 'admin') {
      navigate('/admin/dashboard');
    }
    
    console.log('Login data:', formData);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div>
      {/* Header Bar Biru */}
      <div style={{
        width: '100%',
        height: '4rem',
        backgroundColor: '#00AEEF',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000
      }} />
      
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          paddingTop: '5rem',
          backgroundColor: '#E2EAFF'
        }}
      >
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        {/* Header dengan Logo dan Teks */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '1rem' 
          }}>
            <img 
              src={logoImage}
              alt="PLN Logo"
              style={{
                height: '4rem',
                width: '4rem',
                marginRight: '0.75rem',
                objectFit: 'contain'
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ 
                fontSize: '1.875rem', 
                fontWeight: 'bold', 
                color: '#00AEEF',
                margin: 0,
                letterSpacing: '0.05em'
              }}>
                PLN
              </h1>
              <p style={{ 
                color: '#6B7280', 
                fontSize: '1.125rem',
                margin: 0,
                fontWeight: '400'
              }}>Icon Plus</p>
            </div>
          </div>
          <h2 style={{ 
            fontSize: '1.125rem', 
            color: '#374151', 
            fontWeight: '500',
            margin: 0,
            letterSpacing: '0.025em'
          }}>
            SELAMAT DATANG !
          </h2>
        </div>

        {/* Form Login */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '2rem',
          border: '2px solid #00AEEF'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Masukkan Email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F9FAFB'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00AEEF'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Masukkan Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    paddingRight: '2.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F9FAFB'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00AEEF'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
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
                    color: '#6B7280',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: '#F9FAFB',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00AEEF'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                required
              >
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
              </select>
            </div>

            {/* Checkbox dan Forgot Password */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="terms"
                  style={{ 
                    marginRight: '0.5rem',
                    accentColor: '#00AEEF'
                  }}
                />
                <label htmlFor="terms" style={{ 
                  fontSize: '0.875rem', 
                  color: '#6B7280',
                  cursor: 'pointer'
                }}>
                  Terima dan Setujui
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#00AEEF',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  padding: '0.25rem'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Lupa Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '0.375rem',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                backgroundColor: '#00AEEF',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0088CC';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 174, 239, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#00AEEF';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { X, Check, User, Mail, Lock, Shield, Target, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TambahData = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: '',
    targetNr: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  // showPassword === true means the password is hidden (EyeOff shown)
  const [showPassword, setShowPassword] = useState(true);

  // Color palette
  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  // Format number to Rupiah display
  const formatRupiah = (value) => {
    if (!value) return '';
    const numberValue = value.toString().replace(/\D/g, '');
    return numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Remove Rupiah formatting to get plain number
  const unformatRupiah = (value) => {
    return value.replace(/\./g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle Target NR with Rupiah formatting
    if (name === 'targetNr') {
      const plainNumber = unformatRupiah(value);
      setFormData({ 
        ...formData, 
        [name]: plainNumber 
      });
    } else {
      setFormData({ 
        ...formData, 
        [name]: value 
      });
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({ nama: '', email: '', password: '', role: '', targetNr: '' });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        nama_user: formData.nama,
        email_user: formData.email, 
        kata_sandi: formData.password,
        role_user: formData.role,
        ...(formData.role === 'sales' && formData.targetNr && { 
          target_nr: parseInt(formData.targetNr) 
        })
      };
      
      await onSave(dataToSave);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ nama: '', email: '', password: '', role: '', targetNr: '' });
    onClose();
  };

  const inputStyle = (fieldName) => ({
    padding: '16px 16px 16px 48px',
    borderRadius: '12px',
    border: `2px solid ${focusedField === fieldName ? colors.secondary : 'rgba(3, 91, 113, 0.38)'}`,
    fontSize: '14px',
    backgroundColor: focusedField === fieldName ? 'rgba(0, 191, 202, 0.05)' : '#ffffff',
    color: colors.primary,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    boxShadow: focusedField === fieldName 
      ? `0 0 0 3px rgba(0, 191, 202, 0.1)` 
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    fontFamily: "'Open Sans', sans-serif !important"
  });

  const iconContainerStyle = (fieldName) => ({
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: focusedField === fieldName ? colors.secondary : colors.primary,
    transition: 'color 0.3s ease',
    zIndex: 1
  });

  const rightIconContainerStyle = (fieldName) => ({
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: focusedField === fieldName ? colors.secondary : colors.primary,
    transition: 'color 0.3s ease',
    zIndex: 2,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  return (
    <>
      <style>
        {`
          input::placeholder {
            color: ${colors.accent1};
            opacity: 0.6;
            fontFamily: "'Open Sans', sans-serif !important";
          }
          select::placeholder {
            color: ${colors.accent1};
            opacity: 0.6;
            fontFamily: "'Open Sans', sans-serif !important";
          }
          select:invalid {
            color: ${colors.accent1};
            opacity: 0.6;
            fontFamily: "'Open Sans', sans-serif !important";
          }
          select option {
            color: ${colors.primary};
            background-color: #e7f3f5ff;
            fontFamily: "'Open Sans', sans-serif !important";
          }
        `}
      </style>

      <AnimatePresence>
        {isOpen && !showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
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
              padding: '20px'
            }}
          >
              <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                rotate: [0, 0.5, -0.5, 0]
              }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                background: '#e7f3f5ff',
                borderRadius: '32px',
                width: '100%',
                maxWidth: '900px',
                padding: '20px',
                boxShadow: `
                  0 12px 30px rgba(0, 0, 0, 0.12), 
                  0 4px 12px rgba(0, 0, 0, 0.08)`,
                border: '1px solid rgba(255, 255, 255, 0.6)',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              {/* Decorative highlight */}
              <div style={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0))',
                pointerEvents: 'none'
              }} />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(3, 91, 113, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(3, 91, 113, 0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(3, 91, 113, 0.1)'}
              >
                <X size={20} color={colors.primary} />
              </motion.button>

              {/* Header */}
              <motion.div 
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  padding: '40px 32px 20px',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: `0 10px 30px rgba(0, 191, 202, 0.3)`
                }}>
                  <User size={32} color="white" />
                </div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  Tambah Data User
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Lengkapi informasi user baru
                </p>
              </motion.div>

              {/* Form */}
              <motion.form 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                id="form-tambah-data" 
                onSubmit={handleSubmit} 
                style={{
                  background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '24px',
                  margin: '0 32px 32px',
                  border: `1px solid rgba(0, 192, 202, 0.68)`,
                  position: 'relative'
                }}
              >
                {/* Content (scroll handled by outer modal container) */}
                {/* Nama Field */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Nama Lengkap *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('nama')}>
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="nama"
                      placeholder="Masukkan nama lengkap"
                      value={formData.nama}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('nama')}
                      onBlur={() => setFocusedField('')}
                      required
                      style={inputStyle('nama')}
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('email')}>
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="mail@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      required
                      style={inputStyle('email')}
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Kata Sandi *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('password')}>
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'password' : 'text'}
                      name="password"
                      placeholder="Minimal 8 karakter"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      required
                      minLength={8}
                      style={{ ...inputStyle('password'), paddingRight: '48px' }}
                    />
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={showPassword ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi'}
                      onClick={() => setShowPassword(prev => !prev)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(prev => !prev); }}
                      style={rightIconContainerStyle('password')}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </motion.div>

                {/* Role Field */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: formData.role === 'sales' ? '24px' : '32px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Role User *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('role')}>
                      <Shield size={18} />
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('role')}
                      onBlur={() => setFocusedField('')}
                      required 
                      style={{
                        ...inputStyle('role'),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(focusedField === 'role' ? colors.secondary : colors.primary)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                        backgroundSize: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" disabled hidden>Pilih role user</option>
                      <option value="superAdmin">👑 Super Admin</option>
                      <option value="admin">👨‍💼 Admin</option>
                      <option value="sales">💼 Sales</option>
                      <option value="aktivasi">⚡ Aktivasi</option>
                    </select>
                  </div>
                </motion.div>

                {/* Target NR Section */}
                <AnimatePresence>
                  {formData.role === 'sales' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -30 }}
                      animate={{ height: 'auto', opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -30 }}
                      transition={{ 
                        duration: 0.6, 
                        ease: [0.4, 0, 0.2, 1],
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                      style={{
                        marginBottom: '35px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0, x: -20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.2, 
                          duration: 0.5,
                          type: "spring",
                          stiffness: 300
                        }}
                        style={{
                          background: `linear-gradient(135deg, 
                            rgba(0, 191, 202, 0.12) 0%, 
                            rgba(63, 186, 140, 0.08) 50%,
                            rgba(3, 91, 113, 0.04) 100%)`,
                          border: `2px solid rgba(0, 191, 202, 0.4)`,
                          borderRadius: '20px',
                          padding: '28px',
                          position: 'relative',
                          backdropFilter: 'blur(10px)',
                          boxShadow: `
                            0 12px 40px rgba(0, 191, 202, 0.25),
                            inset 0 1px 0 rgba(255, 255, 255, 0.7),
                            inset 0 -1px 0 rgba(3, 91, 113, 0.1)
                          `,
                          overflow: 'hidden'
                        }}
                      >
                        {/* Animated Background Pattern */}
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                          }}
                          style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-50%',
                            width: '200%',
                            height: '200%',
                            background: `radial-gradient(circle, 
                              rgba(0, 191, 202, 0.05) 0%, 
                              transparent 70%)`,
                            pointerEvents: 'none'
                          }}
                        />

                        {/* Floating Particles */}
                        <motion.div
                          animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          style={{
                            position: 'absolute',
                            top: '15px',
                            left: '25px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: colors.secondary,
                            filter: 'blur(1px)'
                          }}
                        />
                        <motion.div
                          animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                          }}
                          style={{
                            position: 'absolute',
                            top: '40px',
                            right: '30px',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: colors.success,
                            filter: 'blur(1px)'
                          }}
                        />

                        {/* Pulsing Border */}
                        <motion.div
                          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.02, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          style={{
                            position: 'absolute',
                            inset: '-3px',
                            borderRadius: '23px',
                            background: `linear-gradient(135deg, 
                              ${colors.secondary} 0%, 
                              ${colors.success} 50%,
                              ${colors.tertiary} 100%)`,
                            opacity: 0.3,
                            zIndex: 1,
                            pointerEvents: 'none',
                            filter: 'blur(2px)'
                          }}
                        />

                        <div style={{ position: 'relative', zIndex: 2 }}>
                          {/* Label */}
                          <motion.label
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              fontSize: '16px',
                              fontWeight: '700',
                              color: colors.primary,
                              marginBottom: '16px',
                              letterSpacing: '0.02em'
                            }}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              style={{
                                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                                borderRadius: '10px',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Target size={18} color="white" />
                            </motion.div>
                            Target NR *
                          </motion.label>

                          {/* Input Container */}
                          <div style={{ position: 'relative' }}>
                            {/* Ikon + Rp */}
                            <div
                              style={{
                                position: 'absolute',
                                left: '18px',
                                top: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '18px',
                                color: focusedField === 'targetNr' ? colors.success : colors.primary,
                                zIndex: 2,
                              }}
                            >
                              <TrendingUp size={20} />
                              <span
                                style={{
                                  fontWeight: '700',
                                  fontSize: '16px',
                                  left: '28px',
                                  color: focusedField === 'targetNr' ? colors.success : '#6B7280',
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                Rp
                              </span>
                            </div>

                            {/* Input Field */}
                            <motion.input
                              type="text"
                              name="targetNr"
                              placeholder="0"
                              value={formatRupiah(formData.targetNr)}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('targetNr')}
                              onBlur={() => setFocusedField('')}
                              required={formData.role === 'sales'}
                              style={{
                                ...inputStyle('targetNr'),
                                paddingLeft: '80px',
                                fontSize: '15px',
                                fontWeight: '600',
                                borderColor: focusedField === 'targetNr' ? colors.success : 'rgba(0, 191, 202, 0.5)',
                                backgroundColor: focusedField === 'targetNr' ? 'rgba(63, 186, 140, 0.08)' : '#ffffff',
                                height: '52px',
                                borderRadius: '12px',
                                paddingTop: '19px',
                                boxSizing: 'border-box'
                              }}
                              whileFocus={{
                                boxShadow: `0 0 0 4px rgba(63, 186, 140, 0.2), 0 12px 30px rgba(0, 191, 202, 0.3)`
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '16px',
                  marginTop: '32px'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCancel}
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                      color: '#ffffff',
                      border: 'none',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxShadow: `0 4px 15px rgba(3, 91, 113, 0.3)`,
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.02em'
                    }}
                  >
                    Batal
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    form="form-tambah-data"
                    disabled={isSubmitting}
                    style={{
                      background: isSubmitting 
                        ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                        : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                      color: '#ffffff',
                      border: 'none',
                      padding: '16px 40px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: `0 4px 20px rgba(0, 191, 202, 0.4)`,
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.02em',
                      opacity: isSubmitting ? 0.8 : 1
                    }}
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
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
              zIndex: 1001,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.4, 0, 0.2, 1],
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '24px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
                style={{
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                  borderRadius: '50%',
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 24px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 20px 40px rgba(63, 186, 140, 0.4)`
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 600, damping: 20 }}
                >
                  <Check style={{ 
                    width: '48px', 
                    height: '48px', 
                    color: 'white',
                    strokeWidth: 3
                  }} />
                </motion.div>
              </motion.div>

              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Berhasil!
              </motion.h3>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{
                  margin: '0 0 32px 0',
                  fontSize: '16px',
                  color: colors.accent1,
                  lineHeight: '1.5',
                  opacity: 0.9
                }}
              >
                Data user baru telah berhasil disimpan ke sistem
              </motion.p>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseSuccessModal}
                style={{
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: `0 8px 25px rgba(63, 186, 140, 0.3)`,
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.02em'
                }}
              >
                Selesai
              </motion.button>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseSuccessModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(3, 91, 113, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <X size={18} color={colors.primary} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TambahData;
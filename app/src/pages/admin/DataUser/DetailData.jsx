import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailData = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    kata_sandi: '',
    role: '',
    targetNr: ''
  });

  // Color palette
  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  useEffect(() => {
    if (initialData) {
      console.log("📋 DetailData - Initial data received:", initialData);
      
      // Convert role to display format
      const convertRoleToDisplay = (dbRole) => {
        switch(dbRole) {
          case 'superAdmin': return 'superAdmin';
          case 'admin': return 'admin';
          case 'sales': return 'sales';
          case 'Super Admin': return 'superAdmin';
          case 'Admin': return 'admin';
          case 'Sales': return 'sales';
          default: return dbRole;
        }
      };

      setFormData({
        nama: initialData.nama || '',
        email: initialData.email || '',
        kata_sandi: initialData.kata_sandi || initialData.password || '',
        role: convertRoleToDisplay(initialData.role) || '',
        targetNr: initialData.target_nr || initialData.targetNr || ''
      });
    }
  }, [initialData]);

  // Format number with dots as thousand separators
  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
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
              padding: '20px',
              fontFamily: "'Open Sans', sans-serif !important"
            }}
          >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotate: [0, 0.5, -0.5, 0]}}
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
                  overflowY: 'auto',
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
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  Detail Data User
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Informasi lengkap user terpilih
                </p>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
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
                {/* Input Nama */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Nama Lengkap</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <User size={18} style={{ marginRight: '12px' }} />
                    {formData.nama}
                  </div>
                </div>

                {/* Input Email */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Email</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <Mail size={18} style={{ marginRight: '12px' }} />
                    {formData.email}
                  </div>
                </div>

                {/* Input Kata Sandi */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Kata Sandi</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <Lock size={18} style={{ marginRight: '12px' }} />
                    {formData.kata_sandi}
                  </div>
                </div>

                {/* Role */}
                <div style={{ marginBottom: formData.role === 'sales' ? '24px' : '32px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Role</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <Shield size={18} style={{ marginRight: '12px' }} />
                    {formData.role === 'superAdmin' && '👑 Super Admin'}
                    {formData.role === 'admin' && '👨‍💼 Admin'}
                    {formData.role === 'sales' && '💼 Sales'}
                    {!['superAdmin', 'admin', 'sales', 'aktivasi'].includes(formData.role) && formData.role}
                  </div>
                </div>

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
                            rotate: {
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear"
                            },
                            scale: {
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
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
                          animate={{
                            y: [0, -10, 0],
                            opacity: [0.3, 0.7, 0.3]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
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
                          animate={{
                            y: [0, -15, 0],
                            opacity: [0.4, 0.8, 0.4]
                          }}
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

                        {/* Pulsing Border Effect */}
                        <motion.div
                          animate={{
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.02, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
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
                          {/* Label with Icon */}
                          <motion.label
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                              display: 'block',
                              fontSize: '16px',
                              fontWeight: '700',
                              color: colors.primary,
                              marginBottom: '16px',
                              letterSpacing: '0.02em',
                              alignItems: 'center',
                              gap: '12px'
                            }}
                          >
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                ease: "easeInOut" 
                              }}
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
                            Target NR
                          </motion.label>
                          
                          {/* Display Container */}
                          <div style={{ position: 'relative' }}>
                            <motion.div 
                              style={{
                                position: 'absolute',
                                left: '18px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: colors.primary,
                                transition: 'all 0.3s ease',
                                zIndex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '1px'
                              }}
                            >
                              <TrendingUp size={20} />
                            </motion.div>
                            
                            <div
                              style={{
                                padding: '16px 16px 16px 52px',
                                borderRadius: '12px',
                                border: '2px solid rgba(0, 191, 202, 0.3)',
                                fontSize: '16px',
                                fontWeight: '700',
                                backgroundColor: '#f8fcfd',
                                color: '#6B7280',
                                width: '100%',
                                height: '52px',
                                display: 'flex',
                                alignItems: 'center',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              Rp {formatNumber(formData.targetNr)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Tombol Batal */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingRight: '65px'
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 36px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: `0 4px 15px rgba(3, 91, 113, 0.3)`
                  }}
                >
                  Batal
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DetailData;

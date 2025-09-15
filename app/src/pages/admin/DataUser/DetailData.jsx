import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailData = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    kata_sandi: '',
    role: '',
  });

  // Color palette
  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
  };

  useEffect(() => {
    if (initialData) {
      console.log("📋 DetailData - Initial data received:", initialData);
      setFormData({
        nama: initialData.nama || '',
        email: initialData.email || '',
        kata_sandi: initialData.kata_sandi || '',
        role: initialData.role || '',
      });
    }
  }, [initialData]);

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
              fontFamily: 'Inter, system-ui, sans-serif'
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
                overflow: 'hidden',
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
              <motion.form
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '40px',
                  margin: '0 32px 32px',
                  border: `1px solid rgba(0, 192, 202, 0.68)`,
                  position: 'relative'
                }}
              >
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
                <div style={{ marginBottom: '24px' }}>
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
                    {formData.role}
                  </div>
                </div>
              </motion.form>

              {/* Tombol Tutup */}
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
                  Tutup
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

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailData = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    email: '',
    kata_sandi: '',
    role: '',
  });

  useEffect(() => {
    if (initialData) {
      console.log("📋 DetailData - Initial data received:", initialData);
      setFormData({
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: [0, -5, 5, -5, 5, -3, 3, 0],
                opacity: 1
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut'
              }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '800px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                padding: '24px',
                paddingBottom: '32px'
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div style={{
                padding: '24px',
                textAlign: 'center'
              }}>
                <h2 style={{
                  fontSize: '26px',
                  fontWeight: '800',
                  color: '#2D3A76',
                  margin: 0
                }}>
                  Detail Data User
                </h2>
              </div>

              {/* Form*/}
              <form style={{
                backgroundColor: '#E9EDF7',
                borderRadius: '20px',
                padding: '32px',
                margin: '0 auto',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                maxWidth: '600px',
                marginBottom: '32px'
              }}>
                {/* Input Email */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <label style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2D396B'
                  }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)',
                      fontSize: '14px',
                      backgroundColor: '#e0e0e0',
                      color: '#2D396B',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Input Kata Sandi */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <label style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2D3A76'
                  }}>Kata Sandi</label>
                  <input
                    type="text"
                    name="kata_sandi"
                    value={formData.kata_sandi || ''}
                    readOnly
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)',
                      fontSize: '14px',
                      backgroundColor: '#e0e0e0',
                      color: '#2D396B',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Pilihan Role */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  alignItems: 'center',
                  marginBottom: '28px'
                }}>
                  <label style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2D3A76'
                  }}>Role</label>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)',
                      fontSize: '14px',
                      backgroundColor: '#e0e0e0',
                      color: '#2D396B'
                    }}
                  >
                    {formData.role}
                  </div>
                </div>
              </form>

              {/* Tombol Tutup */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingRight: '65px'
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    backgroundColor: '#2D3A76',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '50px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DetailData;

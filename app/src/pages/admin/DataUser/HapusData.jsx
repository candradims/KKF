import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HapusData = ({ isOpen, onClose, onDelete, initialData }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        password: '••••••••', // Hide password for security
        role: initialData.role || '',
      });
    }
  }, [initialData]);

  const handleDeleteConfirm = async () => {
    if (initialData && initialData.id) {
      console.log("🗑️ Confirming delete for user:", initialData);
      await onDelete(initialData.id);
      setShowSuccessModal(true);
    } else {
      console.error("❌ No user ID found for deletion");
      alert("Error: Tidak dapat menghapus user - ID tidak ditemukan");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose(); // Tutup modal hapus juga setelah sukses
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
                  Hapus Data User
                </h2>
              </div>

              {/* Icon Peringatan */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" fill="#00AEEF"/>
                  <path d="M12 9V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Pesan Konfirmasi */}
              <p style={{
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: '540',
                color: '#2D3A76',
                marginBottom: '30px'
              }}>
                Apakah Anda Yakin Ingin Menghapus Data Berikut?
              </p>

              {/* Form */}
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
                      color: '#2D396B'
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
                    name="password"
                    value={formData.password}
                    readOnly
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)',
                      fontSize: '14px',
                      backgroundColor: '#e0e0e0',
                      color: '#2D396B'
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

              {/* Tombol Aksi */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '20px',
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
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  style={{
                    backgroundColor: '#00AEEF',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '50px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up Sukses */}
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut"}}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              <div style={{
                backgroundColor: '#00AEEF',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                margin: '0 auto 16px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Check style={{ 
                  width: '30px', 
                  height: '30px', 
                  color: 'white'
                }} />
              </div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333'
              }}>
                Selamat!
              </h3>
              <p style={{
                margin: '0 0 20px 0',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.4'
              }}>
                Data User Berhasil Dihapus
              </p>
              <button
                onClick={handleCloseSuccessModal}
                style={{
                  backgroundColor: '#00AEEF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '80px',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#0088CC';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#00AEEF';
                }}
              >
                Oke
              </button>
              <button
                onClick={handleCloseSuccessModal}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#666',
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HapusData;
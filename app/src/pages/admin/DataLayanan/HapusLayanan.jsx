import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Check, Package, MapPin, Cpu, Server, DollarSign, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HapusLayanan = ({ isOpen, onClose, onDelete, initialData }) => {
  const [formData, setFormData] = useState({
    id: null,
    namaLayanan: "",
    jenisLayanan: "",
    hjt: "",
    satuan: "",
    backbone: "",
    port: "",
    tarif: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Color palette
  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
    danger: '#ef4444',
    dangerLight: '#f87171',
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleDeleteConfirm = async () => {
    try {
      console.log("🗑️ Deleting layanan:", formData);
      setIsDeleting(true);
      
      // Call the onDelete function passed from parent with the ID
      if (onDelete && formData.id) {
        await onDelete(formData.id);
        // Only show success modal if no error occurred
        setShowSuccessModal(true);
      } else {
        throw new Error("ID layanan tidak ditemukan");
      }
    } catch (error) {
      console.error("❌ Error deleting layanan:", error);
      alert("Gagal menghapus layanan: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose(); 
  };
  
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numericValue) && numericValue !== null) {
      return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numericValue);
    }
    return value;
  };

  const inputStyle = {
    padding: '16px 16px 16px 48px',
    borderRadius: '12px',
    border: `2px solid rgba(3, 91, 113, 0.38)`,
    fontSize: '14px',
    backgroundColor: '#f0f4f5',
    color: colors.primary,
    width: '100%',
    outline: 'none',
    cursor: 'not-allowed'
  };

  const iconContainerStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.primary,
    zIndex: 1
  };

  return (
    <>
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
              padding: '20px',
              fontFamily: "'Open Sans', sans-serif !important"
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
                maxHeight: '90vh',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
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

              {/* Main Content Container */}
              <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '20px'
              }}>

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
                    background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: `0 10px 30px rgba(239, 68, 68, 0.3)`
                  }}>
                    <AlertTriangle size={32} color="white" />
                  </div>
                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}>
                    Hapus Layanan
                  </h2>
                  <p style={{
                    color: colors.danger,
                    fontSize: '16px',
                    margin: '8px 0 0',
                    opacity: 0.8,
                    fontWeight: '600'
                  }}>
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </motion.div>

                {/* Warning Message */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    margin: '0 32px 24px',
                    border: `1px solid rgba(239, 68, 68, 0.3)`,
                    textAlign: 'center'
                  }}
                >
                  <p style={{
                    color: colors.danger,
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    Apakah Anda yakin ingin menghapus data layanan berikut?
                  </p>
                </motion.div>

                {/* Form */}
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{
                    background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                    borderRadius: '20px',
                    padding: '40px',
                    margin: '0 32px 32px',
                    border: `1px solid rgba(0, 192, 202, 0.68)`,
                    position: 'relative'
                  }}
                >
                  {/* Nama Layanan Field */}
                  <motion.div 
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
                      Nama Layanan
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={iconContainerStyle}>
                        <Package size={18} />
                      </div>
                      <input
                        type="text"
                        name="namaLayanan"
                        value={formData.namaLayanan || '-'}
                        readOnly
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>

                  {/* Jenis Layanan Field */}
                  <motion.div 
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
                      Jenis Layanan
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={iconContainerStyle}>
                        <Tag size={18} />
                      </div>
                      <input
                        type="text"
                        name="jenisLayanan"
                        value={formData.jenisLayanan || '-'}
                        readOnly
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>

                  {/* HJT Field */}
                  <motion.div 
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
                      HJT
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={iconContainerStyle}>
                        <MapPin size={18} />
                      </div>
                      <input
                        type="text"
                        name="hjt"
                        value={formData.hjt || '-'}
                        readOnly
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>

                  {/* Satuan Field */}
                  <motion.div 
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
                      Satuan
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={iconContainerStyle}>
                        <Cpu size={18} />
                      </div>
                      <input
                        type="text"
                        name="satuan"
                        value={formData.satuan || '-'}
                        readOnly
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>

                  {/* Backbone Field */}
                  <motion.div 
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
                      Backbone
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={iconContainerStyle}>
                        <Server size={18} />
                      </div>
                      <input
                        type="text"
                        name="backbone"
                        value={formData.backbone || '-'}
                        readOnly
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>

                  {/* Port Field */}
                  <motion.div 
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
                      Port
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={iconContainerStyle}>
                        <Cpu size={18} />
                      </div>
                      <input
                        type="text"
                        name="port"
                        value={formData.port || '-'}
                        readOnly
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>

                  {/* Tarif Field */}
                  <motion.div 
                    style={{
                      marginBottom: '32px',
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
                      Tarif
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={iconContainerStyle}>
                        <DollarSign size={18} />
                      </div>
                      <input
                        type="text"
                        name="tarif"
                        value={formatCurrency(formData.tarif)}
                        readOnly
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '16px',
                    marginTop: '32px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(0, 192, 202, 0.1)'
                  }}>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={onClose}
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
                      type="button"
                      onClick={handleDeleteConfirm}
                      disabled={isDeleting}
                      style={{
                        background: isDeleting 
                          ? `linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)`
                          : `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                        color: '#ffffff',
                        border: 'none',
                        padding: '16px 40px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        boxShadow: isDeleting 
                          ? 'none' 
                          : `0 4px 20px rgba(239, 68, 68, 0.4)`,
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.02em',
                        opacity: isDeleting ? 0.8 : 1
                      }}
                    >
                      {isDeleting ? 'Menghapus...' : 'Hapus Data'}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
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
              zIndex: 1000,
              padding: '20px',
              fontFamily: "'Open Sans', sans-serif !important"
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
                Data layanan berhasil dihapus dari sistem
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

export default HapusLayanan;

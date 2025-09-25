import React, { useState, useEffect } from 'react';
import { X, Package, MapPin, Ruler, Server, Cpu, DollarSign, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailLayanan = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    id: null,
    namaLayanan: "",
    jenisLayanan: "",
    hjt: "",
    satuan: "",
    backbone: "",
    port: "",
    tarifAkses: "",
    tarif: "",
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
      setFormData(initialData);
    }
  }, [initialData]);
  
  const formatCurrency = (value) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numericValue) && numericValue !== null) {
      return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(numericValue);
    }
    return value;
  };

  return (
    <>
      <style>
        {`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 191, 202, 0.3) transparent;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 191, 202, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 191, 202, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 191, 202, 0.5);
          }
        `}
      </style>
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

              {/* Scrollable Container */}
              <div className="custom-scrollbar" style={{
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
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: `0 10px 30px rgba(0, 191, 202, 0.3)`
                }}>
                  <Package size={32} color="white" />
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
                  Detail Layanan
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Informasi lengkap layanan terpilih
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
                  padding: '40px',
                  margin: '0 32px 32px',
                  border: `1px solid rgba(0, 192, 202, 0.68)`,
                  position: 'relative'
                }}
              >
                {/* Field: Nama Layanan */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Nama Layanan</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <Package size={18} style={{ marginRight: '12px' }} />
                    {formData.namaLayanan}
                  </div>
                </div>

                {/* Field: Jenis Layanan */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Jenis Layanan</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <Tag size={18} style={{ marginRight: '12px' }} />
                    {formData.jenisLayanan || '-'}
                  </div>
                </div>

                {/* Field: HJT */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>HJT</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <MapPin size={18} style={{ marginRight: '12px' }} />
                    {formData.hjt}
                  </div>
                </div>

                {/* Field: Satuan */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Satuan</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <Ruler size={18} style={{ marginRight: '12px' }} />
                    {formData.satuan}
                  </div>
                </div>

                {/* Field: Backbone */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Backbone</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <Server size={18} style={{ marginRight: '12px' }} />
                    {formData.backbone}
                  </div>
                </div>

                {/* Field: Port */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Port</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <Cpu size={18} style={{ marginRight: '12px' }} />
                    {formData.port}
                  </div>
                </div>

                {/* Field: Tarif Akses */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Tarif Akses</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <DollarSign size={18} style={{ marginRight: '12px' }} />
                    {formatCurrency(formData.tarifAkses)}
                  </div>
                </div>

                {/* Field: Tarif */}
                <div style={{ marginBottom: '0' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'block'
                  }}>Tarif</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(3, 91, 113, 0.3)',
                    backgroundColor: '#f0f4f5',
                    color: colors.primary
                  }}>
                    <DollarSign size={18} style={{ marginRight: '12px' }} />
                    {formatCurrency(formData.tarif)}
                  </div>
                </div>
              </motion.div>
              </div> {/* End of scrollable container */}

              {/* Tombol Tutup */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '20px',
                paddingTop: '0'
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

export default DetailLayanan;
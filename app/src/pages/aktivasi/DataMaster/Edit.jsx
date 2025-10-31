import React, { useState, useEffect } from 'react';
import { X, Check, Package, Ruler, DollarSign, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Edit = ({ isOpen, onClose, onUpdate, initialData, satuanOptions = [], pemasanganOptions = [] }) => {
  const [formData, setFormData] = useState({
    service: '',
    satuan: '',
    hargaSatuan: '',
    pemasangan: '' 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [focusedField, setFocusedField] = useState('');

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

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        service: initialData.service || '',
        satuan: initialData.satuan || '',
        hargaSatuan: initialData.harga_satuan || initialData.hargaSatuan || '',
        pemasangan: initialData.pemasangan || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle Harga Satuan with Rupiah formatting
    if (name === 'hargaSatuan') {
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
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any data has changed
    if (!hasChanges()) {
      alert('Tidak ada perubahan data untuk disimpan');
      return;
    }
    
    if (!formData.service || !formData.satuan || !formData.hargaSatuan || !formData.pemasangan) {
      alert('Service, Satuan, Pemasangan, dan Harga Satuan wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToUpdate = {
        service: formData.service,
        satuan: formData.satuan,
        harga_satuan: parseInt(formData.hargaSatuan) || 0,
        pemasangan: formData.pemasangan
      };
      
      await onUpdate(dataToUpdate);
      setShowSuccessModal(true);
    } catch (err) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = () => {
    if (!initialData) return false;
    
    const initialHargaSatuan = initialData.harga_satuan || initialData.hargaSatuan || '';
    const initialPemasangan = initialData.pemasangan || '';
    
    return (
      formData.service !== initialData.service ||
      formData.satuan !== initialData.satuan ||
      formData.hargaSatuan !== initialHargaSatuan.toString() ||
      formData.pemasangan !== initialPemasangan
    );
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

  const selectStyle = (fieldName) => ({
    ...inputStyle(fieldName),
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(focusedField === fieldName ? colors.secondary : colors.primary)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '20px',
    cursor: 'pointer',
    paddingRight: '48px'
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

  return (
    <>
      <style>
        {`
          input::placeholder {
            color: ${colors.accent1};
            opacity: 0.6;
            font-family: 'Open Sans', sans-serif !important;
          }
          select::placeholder {
            color: ${colors.accent1};
            opacity: 0.6;
            font-family: 'Open Sans', sans-serif !important;
          }
          select:invalid {
            color: ${colors.accent1};
            opacity: 0.6;
            font-family: 'Open Sans', sans-serif !important;
          }
          select option {
            color: ${colors.primary};
            background-color: #e7f3f5ff;
            font-family: 'Open Sans', sans-serif !important;
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
                maxWidth: '700px',
                padding: '20px',
                boxShadow: `
                  0 12px 30px rgba(0, 0, 0, 0.12), 
                  0 4px 12px rgba(0, 0, 0, 0.08)`,
                border: '1px solid rgba(255, 255, 255, 0.6)',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto',
                fontFamily: "'Open Sans', sans-serif !important"
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
                  letterSpacing: '-0.02em',
                  fontFamily: "'Open Sans', sans-serif !important"
                }}>
                  Edit Data Service
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8,
                  fontFamily: "'Open Sans', sans-serif !important"
                }}>
                  Perbarui informasi service
                </p>
              </motion.div>

              {/* Form */}
              <motion.form 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                id="form-edit-data" 
                onSubmit={handleSubmit} 
                style={{
                  background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '24px',
                  margin: '0 32px 32px',
                  border: `1px solid rgba(0, 192, 202, 0.68)`,
                  position: 'relative',
                  fontFamily: "'Open Sans', sans-serif !important"
                }}
              >
                {/* Service Field */}
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
                    letterSpacing: '0.02em',
                    fontFamily: "'Open Sans', sans-serif !important"
                  }}>
                    Nama Service
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('service')}>
                      <Package size={18} />
                    </div>
                    <input
                      type="text"
                      name="service"
                      placeholder="Masukkan nama service"
                      value={formData.service}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('service')}
                      onBlur={() => setFocusedField('')}
                      required
                      style={inputStyle('service')}
                    />
                  </div>
                </motion.div>

                {/* Satuan Field */}
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
                    letterSpacing: '0.02em',
                    fontFamily: "'Open Sans', sans-serif !important"
                  }}>
                    Satuan
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('satuan')}>
                      <Ruler size={18} />
                    </div>
                    <select
                      name="satuan"
                      value={formData.satuan}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('satuan')}
                      onBlur={() => setFocusedField('')}
                      required
                      style={selectStyle('satuan')}
                    >
                      <option value="" disabled>Pilih satuan</option>
                      {satuanOptions.map((satuan, index) => (
                        <option key={index} value={satuan}>
                          {satuan}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {/* Pemasangan Field */}
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
                    letterSpacing: '0.02em',
                    fontFamily: "'Open Sans', sans-serif !important"
                  }}>
                    Pemasangan
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('pemasangan')}>
                      <Wrench size={18} />
                    </div>
                    <select
                      name="pemasangan"
                      value={formData.pemasangan}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('pemasangan')}
                      onBlur={() => setFocusedField('')}
                      required
                      style={selectStyle('pemasangan')}
                    >
                      <option value="" disabled>Pilih jenis pemasangan</option>
                      {pemasanganOptions.map((pemasangan, index) => (
                        <option key={index} value={pemasangan}>
                          {pemasangan}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {/* Harga Satuan Field */}
                <motion.div 
                  whileHover={{ y: -2 }}
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
                    letterSpacing: '0.02em',
                    fontFamily: "'Open Sans', sans-serif !important"
                  }}>
                    Harga Satuan
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('hargaSatuan')}>
                      <DollarSign size={18} />
                    </div>
                    <input
                      type="text"
                      name="hargaSatuan"
                      placeholder="0"
                      value={formatRupiah(formData.hargaSatuan)}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('hargaSatuan')}
                      onBlur={() => setFocusedField('')}
                      required
                      style={{
                        ...inputStyle('hargaSatuan'),
                        paddingLeft: '48px',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}
                    />
                  </div>
                </motion.div>

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
                      letterSpacing: '0.02em',
                      fontFamily: "'Open Sans', sans-serif !important"
                    }}
                  >
                    Batal
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    form="form-edit-data"
                    disabled={isSubmitting || !hasChanges()}
                    style={{
                      background: isSubmitting || !hasChanges() 
                        ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                        : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                      color: '#ffffff',
                      border: 'none',
                      padding: '16px 40px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: isSubmitting || !hasChanges() ? 'not-allowed' : 'pointer',
                      boxShadow: `0 4px 20px rgba(0, 191, 202, 0.4)`,
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.02em',
                      opacity: isSubmitting || !hasChanges() ? 0.6 : 1,
                      fontFamily: "'Open Sans', sans-serif !important"
                    }}
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontFamily: "'Open Sans', sans-serif !important"
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
                  backgroundClip: 'text',
                  fontFamily: "'Open Sans', sans-serif !important"
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
                  opacity: 0.9,
                  fontFamily: "'Open Sans', sans-serif !important"
                }}
              >
                Data service berhasil diperbarui
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
                  letterSpacing: '0.02em',
                  fontFamily: "'Open Sans', sans-serif !important"
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

export default Edit;
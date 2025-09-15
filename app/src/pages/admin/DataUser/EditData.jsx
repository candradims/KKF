import React, { useState, useEffect } from 'react';
import { X, Check, User, Mail, Lock, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditData = ({ isOpen, onClose, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  // Load initial data
  useEffect(() => {
    if (initialData) {
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
        password: '',
        role: convertRoleToDisplay(initialData.role) || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !formData.role) {
      alert('Nama, Email, dan Role wajib diisi');
      return;
    }
    if (formData.password && formData.password.length < 8) {
      alert('Password minimal 8 karakter');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToUpdate = {
        nama: formData.nama,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password.trim() !== '') {
        dataToUpdate.password = formData.password;
      }
      await onUpdate(dataToUpdate);
      setShowSuccessModal(true);
    } catch (err) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
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
    outline: 'none'
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
        }
        select:invalid {
          color: ${colors.accent1};
          opacity: 0.6;
        }
        select option {
          color: ${colors.primary};
          background-color: #e7f3f5ff;
        }
      `}
    </style>

    {/* Modal utama */}
    <AnimatePresence>
      {isOpen && !showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(3, 91, 113, 0.3)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: '#e7f3f5ff',
              borderRadius: '32px',
              width: '100%',
              maxWidth: '900px',
              padding: '20px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
              position: 'relative'
            }}
          >
            {/* Tombol Close */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '20px', right: '20px',
                backgroundColor: 'rgba(3, 91, 113, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} color={colors.primary} />
            </motion.button>

            {/* Header */}
            <motion.div 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ padding: '40px 32px 20px', textAlign: 'center' }}
            >
              <div style={{
                width: '80px', height: '80px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <User size={32} color="white" />
              </div>
              <h2 style={{
                fontSize: '32px', fontWeight: '700',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Edit Data User
              </h2>
              <p style={{ color: colors.accent1, fontSize: '16px', margin: '8px 0 0' }}>
                Perbarui informasi user
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              style={{
                background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                borderRadius: '20px',
                padding: '40px',
                margin: '0 32px 32px',
                border: `1px solid rgba(0, 192, 202, 0.68)`,
              }}
            >
              {/* Nama */}
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <label style={{ fontWeight: 600, fontSize: 14, color: colors.primary }}>Nama Lengkap *</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconContainerStyle('nama')}>
                    <User size={18}/>
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
              </div>

              {/* Email */}
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <label style={{ fontWeight: 600, fontSize: 14, color: colors.primary }}>Email *</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconContainerStyle('email')}>
                    <Mail size={18}/>
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
              </div>

              {/* Password */}
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <label style={{ fontWeight: 600, fontSize: 14, color: colors.primary }}>Kata Sandi (Opsional)</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconContainerStyle('password')}>
                    <Lock size={18}/>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    style={inputStyle('password')}
                  />
                </div>
              </div>

              {/* Role */}
              <div style={{ marginBottom: '32px', position: 'relative' }}>
                <label style={{ fontWeight: 600, fontSize: 14, color: colors.primary }}>Role *</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconContainerStyle('role')}>
                    <Shield size={18}/>
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
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='${encodeURIComponent(focusedField === 'role' ? colors.secondary : colors.primary)}' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
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
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                    color: '#fff',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting
                      ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                      : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                    color: '#fff',
                    border: 'none',
                    padding: '14px 36px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Update Data'}
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
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, rgba(63, 186, 140, 0.8) 0%, rgba(0, 191, 202, 0.6) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              maxWidth: '400px',
              width: '100%',
              position: 'relative'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                background: `linear-gradient(135deg, ${colors.success} 0%, #4ade80 100%)`,
                borderRadius: '50%',
                width: '100px', height: '100px',
                margin: '0 auto 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Check size={48} color="white" strokeWidth={3}/>
            </motion.div>
            <h3 style={{
              fontSize: '24px', fontWeight: 700,
              background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Berhasil!
            </h3>
            <p style={{ marginBottom: '24px', color: colors.accent1 }}>
              Data user berhasil diperbarui
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCloseSuccessModal}
              style={{
                background: `linear-gradient(135deg, ${colors.success} 0%, #4ade80 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 28px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Selesai
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default EditData;

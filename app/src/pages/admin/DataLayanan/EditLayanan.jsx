import React, { useState, useEffect } from 'react';
import { X, Check, Package, MapPin, Cpu, Server, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditLayanan = ({ isOpen, onClose, onSave, initialData }) => {
  console.log('🔄 EditLayanan render:', { isOpen, initialData });

  // Color palette 
  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  // Add custom scrollbar styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 12px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #94a3b8;
        border-radius: 10px;
        border: 2px solid #f1f5f9;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:active {
        background: #475569;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  const [layananOptions, setLayananOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [hjtOptions, setHjtOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    namaLayanan: '',
    hjt: '',
    satuan: '',
    backbone: '',
    port: '',
    tarifAkses: '',
    tarif: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dynamic options from database
  useEffect(() => {
    const fetchOptionsFromDatabase = async () => {
      if (!isOpen) return;
      setIsLoadingOptions(true);
      
      try {
        console.log("🔍 Fetching options from database");
        
        const response = await fetch('http://localhost:3000/api/layanan/public');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        const data = Array.isArray(result) ? result : result.data || [];
        
        // Ambil unique nama_layanan, satuan, dan wilayah_hjt dari database
        const uniqueLayanan = [...new Set(data.map(item => item.nama_layanan).filter(Boolean))];
        const rawSatuan = [...new Set(data.map(item => item.satuan).filter(Boolean))];
        const uniqueHjt = [...new Set(data.map(item => item.wilayah_hjt).filter(Boolean))];
        
        // Normalize dan filter satuan untuk hanya Mbps dan units
        const normalizedSatuan = rawSatuan
          .map(satuan => satuan.toLowerCase())
          .filter(satuan => satuan === 'mbps' || satuan === 'units')
          .map(satuan => satuan === 'mbps' ? 'Mbps' : 'units');
        
        // Remove duplicates and sort
        const uniqueSatuan = [...new Set(normalizedSatuan)].sort();
        
        setLayananOptions(uniqueLayanan.sort());
        setSatuanOptions(uniqueSatuan.length > 0 ? uniqueSatuan : ["Mbps", "units"]);
        setHjtOptions(uniqueHjt.sort());
        
        console.log("✅ Options loaded:", { 
          layanan: uniqueLayanan.length, 
          satuan: uniqueSatuan.length,
          hjt: uniqueHjt.length 
        });
      } catch (error) {
        console.error("❌ Gagal mengambil data options:", error);
        // Fallback ke data default jika gagal
        setLayananOptions([
          "IP VPN (1 sd 10 Mbps)",
          "IP VPN (11 sd 50 Mbps)",
          "IP VPN (51 sd 100 Mbps)",
          "IP VPN (101 sd 500 Mbps)",
          "IP VPN (501 sd 1000 Mbps)",
          "IP VPN (>1 Gbps)",
          "MPLS",
          "Internet Dedicated",
          "DIA (Dedicated Internet Access)",
          "CoLo (Colocation)",
          "Cloud Service",
          "Dark Fiber"
        ]);
        setSatuanOptions(["Mbps", "units"]);
        setHjtOptions([
          "Jakarta",
          "Sumatra",
          "Kalimantan",
          "Sulawesi",
          "Papua"
        ]);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptionsFromDatabase();
  }, [isOpen]);

  // Initialize form with initial data
  useEffect(() => {
    if (initialData && isOpen) {
      console.log('EditLayanan initialData:', initialData);
      setFormData({
        namaLayanan: initialData.namaLayanan || '',
        hjt: initialData.hjt || '',
        satuan: initialData.satuan || '',
        backbone: initialData.backbone || '',
        port: initialData.port || '',
        tarifAkses: initialData.tarifAkses || '',
        tarif: initialData.tarif || ''
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.namaLayanan) {
      alert('Nama layanan harus diisi!');
      setIsSubmitting(false);
      return;
    }
    if (!formData.hjt) {
      alert('HJT harus dipilih!');
      setIsSubmitting(false);
      return;
    }
    if (!formData.satuan) {
      alert('Satuan harus diisi!');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("📝 EditLayanan: Starting save process with data:", formData);
      
      const dataToSave = {
        ...initialData,
        namaLayanan: formData.namaLayanan,
        hjt: formData.hjt,
        satuan: formData.satuan,
        backbone: formData.backbone,
        port: formData.port,
        tarifAkses: formData.tarifAkses,
        tarif: formData.tarif
      };

      console.log("📤 EditLayanan: Calling onSave with:", dataToSave);
      await onSave(dataToSave);
      console.log("✅ EditLayanan: onSave completed successfully");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error('❌ EditLayanan: Error updating data:', error);
      alert('Terjadi kesalahan saat mengupdate data: ' + error.message);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Early return dengan pesan loading jika belum ada data
  if (isOpen && !initialData) {
    console.log('⚠️ No initialData provided');
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, color: 'white', fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // Input style function
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

  // Icon container style
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
        {isOpen && !showSuccess && (
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
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
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
                  Edit Layanan
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Perbarui informasi layanan
                </p>
              </motion.div>

              {/* Form */}
              <motion.form 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                id="form-edit-layanan" 
                onSubmit={handleSubmit} 
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
                    Nama Layanan *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('namaLayanan')}>
                      <Package size={18} />
                    </div>
                    <select
                      name="namaLayanan"
                      value={formData.namaLayanan}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('namaLayanan')}
                      onBlur={() => setFocusedField('')}
                      required
                      style={{
                        ...inputStyle('namaLayanan'),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(focusedField === 'namaLayanan' ? colors.secondary : colors.primary)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                        backgroundSize: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" disabled hidden>
                        {isLoadingOptions ? "Memuat layanan..." : "Pilih layanan"}
                      </option>
                      {layananOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {/* HJT Field */}
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
                    HJT *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('hjt')}>
                      <MapPin size={18} />
                    </div>
                    <select
                      name="hjt"
                      value={formData.hjt}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('hjt')}
                      onBlur={() => setFocusedField('')}
                      required
                      style={{
                        ...inputStyle('hjt'),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(focusedField === 'hjt' ? colors.secondary : colors.primary)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                        backgroundSize: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" disabled hidden>
                        {isLoadingOptions ? "Memuat HJT..." : "Pilih HJT"}
                      </option>
                      {hjtOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
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
                    letterSpacing: '0.02em'
                  }}>
                    Satuan *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('satuan')}>
                      <Cpu size={18} />
                    </div>
                    <select
                      name="satuan"
                      value={formData.satuan}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('satuan')}
                      onBlur={() => setFocusedField('')}
                      required
                      style={{
                        ...inputStyle('satuan'),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(focusedField === 'satuan' ? colors.secondary : colors.primary)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                        backgroundSize: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" disabled hidden>
                        {isLoadingOptions ? "Memuat satuan..." : "Pilih satuan"}
                      </option>
                      {satuanOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {/* Backbone Field */}
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
                    Backbone
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('backbone')}>
                      <Server size={18} />
                    </div>
                    <input
                      type="text"
                      name="backbone"
                      value={formData.backbone}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('backbone')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Masukkan backbone"
                      style={inputStyle('backbone')}
                    />
                  </div>
                </motion.div>

                {/* Port Field */}
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
                    Port
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('port')}>
                      <Cpu size={18} />
                    </div>
                    <input
                      type="number"
                      name="port"
                      value={formData.port}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('port')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Masukkan port"
                      min="0"
                      style={inputStyle('port')}
                    />
                  </div>
                </motion.div>

                {/* Tarif Akses Field */}
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
                    Tarif Akses
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('tarifAkses')}>
                      <DollarSign size={18} />
                    </div>
                    <input
                      type="number"
                      name="tarifAkses"
                      value={formData.tarifAkses}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('tarifAkses')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Masukkan tarif akses"
                      min="0"
                      step="0.01"
                      style={inputStyle('tarifAkses')}
                    />
                  </div>
                </motion.div>

                {/* Tarif Field */}
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
                    letterSpacing: '0.02em'
                  }}>
                    Tarif
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('tarif')}>
                      <DollarSign size={18} />
                    </div>
                    <input
                      type="number"
                      name="tarif"
                      value={formData.tarif}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('tarif')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Masukkan tarif"
                      min="0"
                      step="0.01"
                      style={inputStyle('tarif')}
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
                      letterSpacing: '0.02em'
                    }}
                  >
                    Batal
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    form="form-edit-layanan"
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
        {showSuccess && (
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
              zIndex: 2000
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
                Data layanan berhasil diperbarui
              </motion.p>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccess(false)}
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
                onClick={() => setShowSuccess(false)}
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

export default EditLayanan;

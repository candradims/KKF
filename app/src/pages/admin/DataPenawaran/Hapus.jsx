import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Check, User, FileText, BarChart3, Settings, Package, DollarSign, Calculator, ClipboardList, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserData, getAuthHeaders } from '../../../utils/api';

const Hapus = ({ isOpen, onClose, onConfirm, deleteData }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pengeluaranData, setPengeluaranData] = useState([]);
  const [loadingPengeluaran, setLoadingPengeluaran] = useState(false);
  const [layananData, setLayananData] = useState([]);
  const [loadingLayanan, setLoadingLayanan] = useState(false);
  const [formData, setFormData] = useState({
    sales: '',
    tanggal: '',
    pelanggan: '',
    lokasiPelanggan: '', 
    nomorKontrak: '',
    kontrakTahunKe: '',
    referensiHJT: '',
    durasiKontrak: '',
    discount: '',
    piliLayanan: '',
    namaLayanan: '',
    keterangan: '',
    kapasitas: '',
    qty: '',
    aksesExisting: '',
    marginPercent: ''
  });

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

  // Pre-fill form with existing data when deleting
  useEffect(() => {
    if (deleteData) {
      const tanggalFromDB = deleteData.rawData?.tanggal_dibuat || deleteData.tanggal;
      const formattedTanggal = tanggalFromDB ? new Date(tanggalFromDB).toISOString().split('T')[0] : '';
      setFormData({
        sales: deleteData.rawData?.sales || deleteData.sales || deleteData.namaSales || '',
        tanggal: formattedTanggal,
        pelanggan: deleteData.namaPelanggan || deleteData.pelanggan || '',
        lokasiPelanggan: deleteData.rawData?.lokasi_pelanggan || deleteData.lokasiPelanggan || '', 
        nomorKontrak: deleteData.nomorKontrak || '',
        kontrakTahunKe: deleteData.kontrakKe || deleteData.kontrakTahunKe || '',
        referensiHJT: deleteData.referensi || deleteData.referensiHJT || '',
        durasiKontrak: deleteData.durasi || deleteData.durasiKontrak || '',
        discount: deleteData.discount || '',
        piliLayanan: deleteData.piliLayanan || '',
        namaLayanan: deleteData.namaLayanan || deleteData.piliLayanan || '',
        keterangan: deleteData.keterangan || '',
        kapasitas: deleteData.kapasitas || '',
        qty: deleteData.qty || '',
        aksesExisting: deleteData.aksesExisting || '',
        marginPercent: deleteData.marginPercent || deleteData.margin || ''
      });

      // Load pengeluaran data and layanan data
      loadPengeluaranData();
      loadLayananData();
    }
  }, [deleteData]);

  const loadPengeluaranData = async () => {
    if (!deleteData?.id_penawaran) return;

    setLoadingPengeluaran(true);
    try {
      const userData = getUserData();
      if (!userData) {
        console.log('❌ No user data for loading pengeluaran');
        setPengeluaranData([]);
        return;
      }

      console.log('📋 Loading pengeluaran data for penawaran ID:', deleteData.id_penawaran);

      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:3000/api/pengeluaran/penawaran/${deleteData.id_penawaran}`, {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          console.log('✅ Pengeluaran data loaded:', result.data);
          setPengeluaranData(result.data);
        } else {
          console.log('📝 No pengeluaran data found');
          setPengeluaranData([]);
        }
      } else {
        console.error('❌ Failed to load pengeluaran data');
        setPengeluaranData([]);
      }
    } catch (error) {
      console.error('❌ Error loading pengeluaran data:', error);
      setPengeluaranData([]);
    } finally {
      setLoadingPengeluaran(false);
    }
  };

  const loadLayananData = async () => {
    console.log('📋 Loading layanan data from deleteData:', deleteData);
    
    setLoadingLayanan(true);
    
    try {
      const needsFullData = !deleteData?.rawData?.data_penawaran_layanan || 
                           deleteData.rawData.data_penawaran_layanan.length === 0;
      
      if (needsFullData && (deleteData?.id || deleteData?.id_penawaran)) {
        console.log('🔄 Hapus: Loading full penawaran data from API...');
        await loadFullPenawaranData(deleteData.id || deleteData.id_penawaran);
      } else if (deleteData?.rawData?.data_penawaran_layanan && deleteData.rawData.data_penawaran_layanan.length > 0) {
        console.log('✅ Found layanan data in rawData:', deleteData.rawData.data_penawaran_layanan);
        setLayananData(deleteData.rawData.data_penawaran_layanan);
      } else {
        console.log('📝 No layanan data found');
        setLayananData([]);
      }
    } catch (error) {
      console.error('❌ Error loading layanan data:', error);
      setLayananData([]);
    } finally {
      setLoadingLayanan(false);
    }
  };

  const loadFullPenawaranData = async (penawaranId) => {
    try {
      console.log("🔄 Hapus: Loading full data for ID:", penawaranId);
      
      const userData = getUserData();
      if (!userData) {
        throw new Error('No user data found');
      }
      
      const response = await fetch(`http://localhost:3000/api/penawaran/${penawaranId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userData.id_user.toString(),
          'X-User-Role': userData.role_user,
          'X-User-Email': userData.email_user
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("✅ Hapus: Full penawaran data loaded:", result.data);
      
      if (result.success && result.data && result.data.data_penawaran_layanan) {
        console.log("✅ Hapus: Setting layanan data:", result.data.data_penawaran_layanan);
        setLayananData(result.data.data_penawaran_layanan);
        
        if (result.data.lokasi_pelanggan) {
          setFormData(prev => ({
            ...prev,
            lokasiPelanggan: result.data.lokasi_pelanggan
          }));
        }
      } else {
        console.log("📝 Hapus: No layanan data in API response");
        setLayananData([]);
      }
    } catch (error) {
      console.error("❌ Hapus: Error loading full penawaran data:", error);
      setLayananData([]);
    }
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    
    try {
      const userData = getUserData();
      if (!userData) {
        console.log('❌ No user data for deletion');
        setIsDeleting(false);
        alert('Data autentikasi tidak ditemukan. Silakan login kembali.');
        return;
      }
      
      if (deleteData?.id_penawaran) {
        console.log('🗑️ Checking for pengeluaran data for penawaran ID:', deleteData.id_penawaran);
        
        try {
          const headers = getAuthHeaders();
          
          const pengeluaranResponse = await fetch(`http://localhost:3000/api/pengeluaran/penawaran/${deleteData.id_penawaran}`, {
            method: 'GET',
            headers: headers,
          });

          if (pengeluaranResponse.ok) {
            const pengeluaranData = await pengeluaranResponse.json();
            if (pengeluaranData.data && pengeluaranData.data.length > 0) {
              console.log('🗑️ Found pengeluaran data to delete:', pengeluaranData.data);
              
              for (const pengeluaran of pengeluaranData.data) {
                console.log('🗑️ Deleting pengeluaran ID:', pengeluaran.id_pengeluaran);
                
                const deletePengeluaranResponse = await fetch(`http://localhost:3000/api/pengeluaran/${pengeluaran.id_pengeluaran}`, {
                  method: 'DELETE',
                  headers: headers,
                });

                if (!deletePengeluaranResponse.ok) {
                  console.error('❌ Failed to delete pengeluaran:', pengeluaran.id_pengeluaran);
                }
              }
            }
          }
        } catch (pengeluaranError) {
          console.log('⚠️ Error checking/deleting pengeluaran (continuing with penawaran deletion):', pengeluaranError);
        }
      }
      
      onConfirm(deleteData);
      
      setShowSuccessModal(true);
      setIsDeleting(false);
    } catch (error) {
      console.error('❌ Error during deletion:', error);
      setIsDeleting(false);
      alert('Terjadi kesalahan saat menghapus data');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setPengeluaranData([]);
    setLayananData([]);
    setFormData({
      sales: '',
      tanggal: '',
      pelanggan: '',
      lokasiPelanggan: '',
      nomorKontrak: '',
      kontrakTahunKe: '',
      referensiHJT: '',
      durasiKontrak: '',
      discount: '',
      piliLayanan: '',
      namaLayanan: '',
      keterangan: '',
      kapasitas: '',
      qty: '',
      aksesExisting: '',
      marginPercent: ''
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Input style function
  const inputStyle = {
    padding: '16px 16px 16px 48px',
    borderRadius: '12px',
    border: `2px solid rgba(3, 91, 113, 0.38)`,
    fontSize: '14px',
    backgroundColor: '#f0f4f5',
    color: colors.primary,
    width: '100%',
    outline: 'none',
    cursor: 'not-allowed',
    fontFamily: "'Open Sans', sans-serif !important"
  };

  const iconContainerStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.primary,
    zIndex: 1
  };

  if (!isOpen && !showSuccessModal) return null;

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
                padding: '20px',
                boxShadow: `
                  0 12px 30px rgba(0, 0, 0, 0.12), 
                  0 4px 12px rgba(0, 0, 0, 0.08)`,
                border: '1px solid rgba(255, 255, 255, 0.6)',
                position: 'relative',
                overflow: 'hidden',
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
                  Hapus Data Penawaran
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
                  Apakah Anda yakin ingin menghapus data penawaran berikut?
                </p>
                <p style={{
                  color: colors.danger,
                  fontSize: '14px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Data penawaran dan semua data terkait akan terhapus permanen!
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
                {/* Sales Field */}
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
                    Sales
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle}>
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="sales"
                      value={formData.sales}
                      readOnly
                      style={inputStyle}
                    />
                  </div>
                </motion.div>

                {/* Tanggal */}
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
                    Tanggal
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle}>
                      <ClipboardList size={18} />
                    </div>
                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      readOnly
                      style={inputStyle}
                    />
                  </div>
                </motion.div>

                {/* Pelanggan */}
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
                    Nama Pelanggan
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle}>
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="pelanggan"
                      value={formData.pelanggan}
                      readOnly
                      style={inputStyle}
                    />
                  </div>
                </motion.div>

                {/* Lokasi Pelanggan */}
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
                    Lokasi Pelanggan
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle}>
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      name="lokasiPelanggan"
                      value={formData.lokasiPelanggan}
                      readOnly
                      style={inputStyle}
                    />
                  </div>
                </motion.div>

                {/* Nomor Kontrak */}
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
                    Nomor Kontrak / BAKB
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle}>
                      <FileText size={18} />
                    </div>
                    <input
                      type="text"
                      name="nomorKontrak"
                      value={formData.nomorKontrak}
                      readOnly
                      style={inputStyle}
                    />
                  </div>
                </motion.div>

                {/* Kontrak Tahun Ke */}
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
                    Kontrak Tahun ke-
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle}>
                      <BarChart3 size={18} />
                    </div>
                    <input
                      type="text"
                      name="kontrakTahunKe"
                      value={formData.kontrakTahunKe}
                      readOnly
                      style={inputStyle}
                    />
                  </div>
                </motion.div>

                {/* Referensi HJT */}
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
                    Referensi HJT
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle}>
                      <Settings size={18} />
                    </div>
                    <div
                      style={{
                        ...inputStyle,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '48px'
                      }}
                    >
                      {formData.referensiHJT}
                    </div>
                  </div>
                </motion.div>

                {/* Durasi Kontrak */}
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
                    Durasi Kontrak (in thn)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle}>
                      <BarChart3 size={18} />
                    </div>
                    <div
                      style={{
                        ...inputStyle,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '48px'
                      }}
                    >
                      {formData.durasiKontrak}
                    </div>
                  </div>
                </motion.div>

                {/* Discount */}
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
                    Discount
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle}>
                      <DollarSign size={18} />
                    </div>
                    <div
                      style={{
                        ...inputStyle,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '48px'
                      }}
                    >
                      {formData.discount}
                    </div>
                  </div>
                </motion.div>

                {/* Multiple Layanan Items Section */}
                <div style={{ marginBottom: "32px" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      backgroundColor: "rgba(0, 191, 202, 0.08)",
                      borderRadius: "20px",
                      padding: "28px",
                      marginBottom: "68px",
                      border: `2px solid rgba(0, 192, 202, 0.25)`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Decorative corner accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '120px',
                      height: '120px',
                      background: `linear-gradient(135deg, ${colors.secondary}20 0%, ${colors.tertiary}20 100%)`,
                      borderBottomLeftRadius: '100%',
                      zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Header Section dengan icon - CENTERED */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '28px',
                        paddingBottom: '16px',
                        borderBottom: `3px solid ${colors.secondary}30`,
                        textAlign: 'center'
                      }}>
                        {/* Icon Container */}
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 6px 20px rgba(239, 68, 68, 0.4)`,
                          marginBottom: '16px'
                        }}>
                          <Package size={28} color="white" />
                        </div>
                        
                        {/* Text Content */}
                        <div>
                          <h4 style={{
                            margin: 0,
                            fontSize: '22px',
                            fontWeight: '700',
                            background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '8px'
                          }}>
                            Data Layanan yang akan Dihapus
                          </h4>
                          <p style={{
                            margin: 0,
                            fontSize: '15px',
                            color: colors.danger,
                            opacity: 0.8,
                            lineHeight: '1.4'
                          }}>
                            {layananData.length} layanan akan terhapus permanen
                          </p>
                        </div>
                      </div>
                      
                      {/* Multiple Layanan Items */}
                      <div style={{
                        display: 'grid',
                        gap: '20px',
                        marginBottom: '28px'
                      }}>
                        {loadingLayanan ? (
                          <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: colors.danger
                          }}>
                            Memuat data layanan...
                          </div>
                        ) : layananData.length > 0 ? (
                          layananData.map((item, index) => (
                            <motion.div 
                              key={item.id_penawaran_layanan || index} 
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -20, scale: 0.95 }}
                              transition={{ 
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                              }}
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(189, 231, 225, 0.6) 100%)',
                                border: `2px solid ${colors.secondary}20`,
                                borderRadius: '18px',
                                padding: '24px',
                                position: 'relative',
                                backdropFilter: 'blur(10px)',
                                boxShadow: `
                                  0 4px 20px rgba(0, 0, 0, 0.08),
                                  0 2px 8px rgba(0, 0, 0, 0.04)
                                `,
                                overflow: 'hidden'
                              }}
                            >
                              {/* Background Pattern */}
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '80px',
                                height: '80px',
                                background: `radial-gradient(circle, ${colors.danger}08 0%, transparent 70%)`,
                                zIndex: 0
                              }} />

                              <div style={{ position: 'relative', zIndex: 1 }}>
                                {/* Header dengan nomor item dan status hapus */}
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '24px',
                                  paddingBottom: '16px',
                                  borderBottom: `2px solid ${colors.danger}15`
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '10px',
                                      background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      fontSize: '14px',
                                      fontWeight: '700'
                                    }}>
                                      {index + 1}
                                    </div>
                                    <span style={{
                                      fontSize: '16px',
                                      fontWeight: '700',
                                      color: colors.danger
                                    }}>
                                      Layanan
                                    </span>
                                  </div>
                                  
                                  <div style={{
                                    background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '8px 16px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                                  }}>
                                    <AlertTriangle size={14} />
                                    Akan Dihapus
                                  </div>
                                </div>

                                {/* Grid Layout untuk Data Layanan */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: '1fr 1fr',
                                  gap: '20px',
                                  marginBottom: '20px'
                                }}>
                                  {/* Nama Layanan */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      📦 Nama Layanan
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      {item.nama_layanan || '-'}
                                    </div>
                                  </div>

                                  {/* Detail Layanan */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      🔧 Detail Layanan
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      {item.detail_layanan || '-'}
                                    </div>
                                  </div>

                                  {/* Kapasitas */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      📊 Kapasitas
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      {item.kapasitas || '-'}
                                    </div>
                                  </div>

                                  {/* QTY */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      🔢 QTY
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      {item.qty || '-'}
                                    </div>
                                  </div>

                                  {/* Akses Existing */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      🔌 Akses Existing
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      {item.akses_existing ? (item.akses_existing.charAt(0).toUpperCase() + item.akses_existing.slice(1)) : '-'}
                                    </div>
                                  </div>

                                  {/* Margin % */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      💰 Margin %
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      {item.margin_percent ? `${item.margin_percent}%` : '-'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: colors.danger,
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            borderRadius: '12px',
                            border: `1px solid rgba(239, 68, 68, 0.2)`
                          }}>
                            Tidak ada data layanan ditemukan
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Pengeluaran Lain-lain Section*/}
                {pengeluaranData.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      backgroundColor: "rgba(0, 191, 202, 0.08)",
                      borderRadius: "20px",
                      padding: "28px",
                      marginBottom: "28px",
                      border: `2px solid rgba(0, 192, 202, 0.25)`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Decorative corner accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '120px',
                      height: '120px',
                      background: `linear-gradient(135deg, ${colors.secondary}20 0%, ${colors.tertiary}20 100%)`,
                      borderBottomLeftRadius: '100%',
                      zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Header Section dengan icon */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '28px',
                        paddingBottom: '16px',
                        borderBottom: `3px solid ${colors.secondary}30`,
                        textAlign: 'center'
                      }}>
                        {/* Icon Container */}
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 6px 20px rgba(239, 68, 68, 0.4)`,
                          marginBottom: '16px'
                        }}>
                          <Calculator size={28} color="white" />
                        </div>
                        
                        {/* Text Content */}
                        <div>
                          <h4 style={{
                            margin: 0,
                            fontSize: '22px',
                            fontWeight: '700',
                            background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '8px'
                          }}>
                            Pengeluaran Lain-lain yang akan Dihapus
                          </h4>
                          <p style={{
                            margin: 0,
                            fontSize: '15px',
                            color: colors.danger,
                            opacity: 0.8,
                            lineHeight: '1.4'
                          }}>
                            {pengeluaranData.length} item pengeluaran akan terhapus permanen
                          </p>
                        </div>

                        {/* Total Display */}
                        {pengeluaranData.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                              background: `linear-gradient(135deg, ${colors.success}15 0%, ${colors.secondary}15 100%)`,
                              border: `2px solid ${colors.danger}30`,
                              borderRadius: '16px',
                              padding: '16px 24px',
                              textAlign: 'center',
                              minWidth: '200px',
                              marginTop: '16px'
                            }}
                          >
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: colors.success,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '6px'
                            }}>
                              Total Pengeluaran
                            </div>
                            <div style={{
                              fontSize: '22px',
                              fontWeight: '700',
                              color: colors.danger,
                              background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>
                              Rp {pengeluaranData.reduce((total, item) => total + (item.total_harga || 0), 0).toLocaleString('id-ID')}
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Multiple Pengeluaran Items */}
                      <div style={{
                        display: 'grid',
                        gap: '20px',
                        marginBottom: '28px'
                      }}>
                        {loadingPengeluaran ? (
                          <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: colors.danger
                          }}>
                            Memuat data pengeluaran...
                          </div>
                        ) : (
                          pengeluaranData.map((item, index) => (
                            <motion.div 
                              key={item.id_pengeluaran || index} 
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -20, scale: 0.95 }}
                              transition={{ 
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                              }}
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(189, 231, 225, 0.6) 100%)',
                                border: `2px solid ${colors.secondary}20`,
                                borderRadius: '18px',
                                padding: '24px',
                                position: 'relative',
                                backdropFilter: 'blur(10px)',
                                boxShadow: `
                                  0 4px 20px rgba(0, 0, 0, 0.08),
                                  0 2px 8px rgba(0, 0, 0, 0.04)
                                `,
                                overflow: 'hidden'
                              }}
                            >
                              {/* Background Pattern */}
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '80px',
                                height: '80px',
                                background: `radial-gradient(circle, ${colors.secondary}08 0%, transparent 70%)`,
                                zIndex: 0
                              }} />

                              <div style={{ position: 'relative', zIndex: 1 }}>
                                {/* Header dengan nomor item dan tombol hapus */}
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '24px',
                                  paddingBottom: '16px',
                                  borderBottom: `2px solid ${colors.danger}15`
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '10px',
                                      background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      fontSize: '14px',
                                      fontWeight: '700'
                                    }}>
                                      {index + 1}
                                    </div>
                                    <span style={{
                                      fontSize: '16px',
                                      fontWeight: '700',
                                      color: colors.danger
                                    }}>
                                      Item Pengeluaran
                                    </span>
                                  </div>
                                  
                                  <div style={{
                                    background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.dangerLight} 100%)`,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '8px 16px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                                  }}>
                                    <AlertTriangle size={14} />
                                    Akan Dihapus
                                  </div>
                                </div>

                                {/* Grid Layout untuk Data Pengeluaran */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: '1fr 1fr',
                                  gap: '20px',
                                  marginBottom: '20px'
                                }}>
                                  {/* Item */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      📦 Item
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      {item.item || '-'}
                                    </div>
                                  </div>

                                  {/* Keterangan */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      📝 Keterangan
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      {item.keterangan || '-'}
                                    </div>
                                  </div>

                                  {/* Harga Satuan */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      💰 Harga Satuan
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      Rp {(item.harga_satuan || 0).toLocaleString('id-ID')}
                                    </div>
                                  </div>

                                  {/* Jumlah */}
                                  <div style={{ position: 'relative' }}>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: colors.primary,
                                      marginBottom: '8px',
                                      letterSpacing: '0.02em'
                                    }}>
                                      🔢 Jumlah
                                    </label>
                                    <div style={{
                                      padding: '14px 16px',
                                      border: `2px solid rgba(3, 91, 113, 0.38)`,
                                      borderRadius: '12px',
                                      fontSize: '14px',
                                      backgroundColor: '#f8f9fa',
                                      color: colors.primary,
                                      width: '100%'
                                    }}>
                                      {item.jumlah || 0}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Display calculated total untuk item ini */}
                                {item.harga_satuan && item.jumlah && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                      padding: '16px 20px',
                                      background: `linear-gradient(135deg, ${colors.success}08 0%, ${colors.secondary}08 100%)`,
                                      border: `2px solid ${colors.danger}30`,
                                      borderRadius: '14px',
                                      fontSize: '15px',
                                      color: colors.success,
                                      textAlign: 'center',
                                      fontWeight: '700',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '8px'
                                    }}
                                  >
                                    <Calculator size={16} />
                                    <span>Total Item:</span>
                                    <span style={{ 
                                      fontSize: '16px',
                                       background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                      backgroundClip: 'text'
                                    }}>
                                      Rp {(parseFloat(item.harga_satuan || 0) * parseInt(item.jumlah || 0)).toLocaleString('id-ID')}
                                    </span>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

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
                    type="button"
                    onClick={handleConfirm}
                    disabled={isDeleting}
                    style={{
                      background: isDeleting 
                        ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                        : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                      color: '#ffffff',
                      border: 'none',
                      padding: '16px 40px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      boxShadow: `0 4px 20px rgba(0, 191, 202, 0.4)`,
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.02em',
                      opacity: isDeleting ? 0.8 : 1
                    }}
                  >
                    {isDeleting ? 'Menghapus...' : 'Hapus Data'}
                  </motion.button>
                </div>
              </motion.div>
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
                Data penawaran berhasil dihapus dari sistem
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

export default Hapus;

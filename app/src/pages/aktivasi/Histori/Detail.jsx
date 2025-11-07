import React, { useState, useEffect } from 'react';
import { X, Package, MapPin, Calendar, User, Building, DollarSign, Check, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserData, getAuthHeaders } from '../../../utils/api';
import Edit from './Edit';

const DetailPenawaran = ({ isOpen, onClose, detailData }) => {
  const [tabelPerhitungan, setTabelPerhitungan] = useState([]);
  const [fullDetailData, setFullDetailData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPemasangan, setSelectedPemasangan] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState(null);

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  // Fetch full detail data
  const loadFullDetailData = async () => {
    if (!detailData?.id_penawaran) return;
    
    try {
      console.log("🔍 Loading full detail data for penawaran:", detailData.id_penawaran);
      
      const response = await fetch(`http://localhost:3000/api/penawaran/${detailData.id_penawaran}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': getUserData().id_user.toString(),
          'X-User-Role': getUserData().role_user,
          'X-User-Email': getUserData().email_user
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        console.log("✅ Full detail data loaded:", result.data);
        setFullDetailData(result.data);
        
        // Load penawaran layanan data for table
        if (result.data.data_penawaran_layanan && result.data.data_penawaran_layanan.length > 0) {
        const layananWithTarifAkses = result.data.data_penawaran_layanan.filter(item => 
          item.tarif_akses && item.tarif_akses > 0
        );
        
        const layananTableData = layananWithTarifAkses.map((item, index) => {
          return {
            id: item.id_penawaran_layanan || index + 1,
            jenisLayanan: item.nama_layanan || item.data_layanan?.nama_layanan || '-',
            keterangan: item.detail_layanan || '-',
            namaPtl: item.nama_ptl || '-',
            tarifAkses: item.tarif_akses || '-',
            jenisPemasangan: item.jenis_pemasangan || '-'
          };
          });
          setTabelPerhitungan(layananTableData);
          console.log("✅ Table data loaded:", layananTableData);
        } else {
          setTabelPerhitungan([]);
        }
      }
    } catch (error) {
      console.error("❌ Error loading full detail data:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFullDetailData();
    }
  }, [detailData?.id_penawaran, isOpen]);

  const handleEditClick = (rowId) => {
    const layanan = tabelPerhitungan.find(item => item.id === rowId);
    setSelectedLayanan(layanan);
    setShowSuccessModal(true);
  };

  const handlePemasanganSelect = (pemasanganType) => {
    setSelectedPemasangan(pemasanganType);
    setShowSuccessModal(false);
    setShowEditModal(true);
  };

  const handleSaveEdit = (savedData) => {
    console.log("Data berhasil disimpan:", savedData);
    loadFullDetailData();
    setShowEditModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedPemasangan('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setShowSuccessModal(false);
      setShowEditModal(false);
      setSelectedPemasangan('');
      setSelectedLayanan(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === '-') return '-';
    const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d]/g, '')) : amount;
    return `Rp ${formatNumber(numericAmount)}`;
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showEditModal && (
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
                maxWidth: '1000px',
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
                  <Package size={32} color="white" />
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
                  Detail Penawaran
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Informasi lengkap penawaran terpilih
                </p>
              </motion.div>

              {/* Form Data Utama */}
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
                {/* Grid untuk data utama */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px'
                }}>
                  {/* Tanggal */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.primary,
                      marginBottom: '8px',
                      display: 'block'
                    }}>Tanggal</label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 16px',
                      borderRadius: '12px',
                      border: '2px solid rgba(3, 91, 113, 0.3)',
                      backgroundColor: '#f8fcfd',
                      color: colors.primary,
                      fontSize: '14px',
                      minHeight: '52px'
                    }}>
                      <Calendar size={18} style={{ marginRight: '12px', color: colors.primary }} />
                      {detailData?.tanggal || '-'}
                    </div>
                  </div>

                  {/* Sales */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.primary,
                      marginBottom: '8px',
                      display: 'block'
                    }}>Sales</label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 16px',
                      borderRadius: '12px',
                      border: '2px solid rgba(3, 91, 113, 0.3)',
                      backgroundColor: '#f8fcfd',
                      color: colors.primary,
                      fontSize: '14px',
                      minHeight: '52px'
                    }}>
                      <User size={18} style={{ marginRight: '12px', color: colors.primary }} />
                      {detailData?.rawData?.data_user?.nama_user || detailData?.namaSales || detailData?.sales || 'Data sales tidak tersedia'}
                    </div>
                  </div>

                  {/* Nama Pelanggan */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.primary,
                      marginBottom: '8px',
                      display: 'block'
                    }}>Nama Pelanggan</label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 16px',
                      borderRadius: '12px',
                      border: '2px solid rgba(3, 91, 113, 0.3)',
                      backgroundColor: '#f8fcfd',
                      color: colors.primary,
                      fontSize: '14px',
                      minHeight: '52px'
                    }}>
                      <Building size={18} style={{ marginRight: '12px', color: colors.primary }} />
                      {detailData?.namaPelanggan || '-'}
                    </div>
                  </div>

                  {/* Lokasi Pelanggan */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.primary,
                      marginBottom: '8px',
                      display: 'block'
                    }}>Lokasi Pelanggan</label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 16px',
                      borderRadius: '12px',
                      border: '2px solid rgba(3, 91, 113, 0.3)',
                      backgroundColor: '#f8fcfd',
                      color: colors.primary,
                      fontSize: '14px',
                      minHeight: '52px'
                    }}>
                      <MapPin size={18} style={{ marginRight: '12px', color: colors.primary }} />
                      {detailData?.lokasi_pelanggan || fullDetailData?.lokasi_pelanggan }
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Detail Layanan */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{
                  background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '24px',
                  margin: '0 32px 32px',
                  border: `1px solid rgba(0, 192, 202, 0.68)`,
                  position: 'relative'
                }}
              >
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Package size={24} />
                  Detail Layanan
                </h3>

                {tabelPerhitungan.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ 
                      width: '100%', 
                      borderCollapse: 'collapse',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <thead>
                        <tr style={{ 
                          backgroundColor: colors.primary,
                          color: 'white'
                        }}>
                          <th style={{ 
                            padding: '16px 12px', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            textAlign: 'left'
                          }}>
                            Jenis Layanan
                          </th>
                          <th style={{ 
                            padding: '16px 12px', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            textAlign: 'left'
                          }}>
                            Keterangan
                          </th>
                          <th style={{ 
                            padding: '16px 12px', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            textAlign: 'left'
                          }}>
                            Nama PTL
                          </th>
                          <th style={{ 
                            padding: '16px 12px', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            textAlign: 'right'
                          }}>
                            Tarif Akses
                          </th>
                          <th style={{ 
                            padding: '16px 12px', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            textAlign: 'center'
                          }}>
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabelPerhitungan.map((row, index) => (
                          <tr 
                            key={row.id}
                            style={{ 
                              backgroundColor: index % 2 === 0 ? '#f8fcfd' : '#f0f9fa',
                              borderBottom: `1px solid rgba(3, 91, 113, 0.1)`
                            }}
                          >
                            <td style={{ 
                              padding: '16px 12px', 
                              fontSize: '14px',
                              color: colors.primary
                            }}>
                              {row.jenisLayanan}
                            </td>
                            <td style={{ 
                              padding: '16px 12px', 
                              fontSize: '14px',
                              color: colors.primary
                            }}>
                              {row.keterangan}
                            </td>
                            <td style={{ 
                              padding: '16px 12px', 
                              fontSize: '14px',
                              color: colors.primary
                            }}>
                              {row.namaPtl}
                            </td>
                            <td style={{ 
                              padding: '16px 12px', 
                              fontSize: '14px',
                              color: colors.primary,
                              textAlign: 'right',
                              fontWeight: '600'
                            }}>
                              {row.tarifAkses && row.tarifAkses !== 'Rp -' ? formatCurrency(row.tarifAkses) : '-'}
                            </td>
                            <td style={{ 
                              padding: '16px 12px', 
                              textAlign: 'center'
                            }}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  boxShadow: `0 2px 8px rgba(0, 191, 202, 0.3)`
                                }}
                                onClick={() => handleEditClick(row.id)}
                              >
                                Edit
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: colors.primary,
                    fontSize: '16px',
                    opacity: 0.7
                  }}>
                    Tidak ada data layanan
                  </div>
                )}
              </motion.div>

              {/* Tombol Tutup */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingRight: '32px',
                marginBottom: '20px'
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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

      {/* Modal untuk Pemasangan */}
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
              zIndex: 1001,
              padding: '20px'
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
                maxWidth: '500px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Icon */}
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
                  <Wrench style={{ 
                    width: '48px', 
                    height: '48px', 
                    color: 'white',
                    strokeWidth: 2
                  }} />
                </motion.div>
              </motion.div>

              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Pilih Jenis Pemasangan
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
                Silakan pilih jenis pemasangan untuk layanan ini
              </motion.p>

              {/* Pilihan Pemasangan */}
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                marginBottom: '3px'
              }}>
                {/* Konvensional */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePemasanganSelect('Konvensional')}
                  style={{
                    background: selectedPemasangan === 'Konvensional' 
                      ? `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`
                      : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: `0 8px 25px rgba(0, 191, 202, 0.3)`,
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.02em',
                    minWidth: '140px'
                  }}
                >
                  Konvensional
                </motion.button>

                {/* FFTH */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePemasanganSelect('FFTH')}
                  style={{
                    background: selectedPemasangan === 'FFTH' 
                      ? `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`
                      : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: `0 8px 25px rgba(0, 191, 202, 0.3)`,
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.02em',
                    minWidth: '140px'
                  }}
                >
                  FFTH
                </motion.button>
              </div>

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

      {/* Modal Edit */}
      <Edit
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        penawaranData={detailData}
        layananData={selectedLayanan}
        selectedPemasangan={selectedPemasangan}
        onSave={handleSaveEdit}
        fullDetailData={fullDetailData}
      />
    </>
  );
};

export default DetailPenawaran;

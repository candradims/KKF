import React, { useState, useEffect } from 'react';
import { X, Package, MapPin, Building, User, DollarSign, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserData, getAuthHeaders } from '../../../utils/api';

const Edit = ({ 
  isOpen, 
  onClose, 
  penawaranData, 
  layananData, 
  selectedPemasangan,
  onSave,
  fullDetailData 
}) => {
  const [formData, setFormData] = useState({
    nama_ptl: '',
    services: []
  });
  const [masterServices, setMasterServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [existingTotalRAB, setExistingTotalRAB] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  const hasValidServices = () => {
    return formData.services.some(service => service.qty > 0);
  };

  const canSubmit = () => {
    return hasValidServices() && !isSubmitting;
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        setCurrentUser(userData);
        
        if (userData && userData.nama_user) {
          setFormData(prev => ({
            ...prev,
            nama_ptl: userData.nama_user
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  const getLokasiPelanggan = () => {
    if (penawaranData?.lokasiPelanggan && penawaranData.lokasiPelanggan !== '-') {
      return penawaranData.lokasiPelanggan;
    }
    
    if (fullDetailData?.lokasi_pelanggan) {
      return fullDetailData.lokasi_pelanggan;
    }
    
    if (penawaranData?.rawData?.lokasi_pelanggan) {
      return penawaranData.rawData.lokasi_pelanggan;
    }
    
    return '-';
  };

  const getExistingLayananData = () => {
    if (!layananData || !fullDetailData?.data_penawaran_layanan) return null;
    
    const existingLayanan = fullDetailData.data_penawaran_layanan.find(
      item => item.id_penawaran_layanan === layananData.id
    );
    
    return existingLayanan;
  };

  const loadMasterServices = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading master services untuk pemasangan:", selectedPemasangan);
      
      const response = await fetch(`http://localhost:3000/api/master-aktivasi?jenis_pemasangan=${selectedPemasangan}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Master services loaded:", result);
      
      if (result.success && result.data) {
        setMasterServices(result.data);
        
        const existingLayanan = getExistingLayananData();
        console.log("📋 Existing layanan data:", existingLayanan);
        
        const initialServices = result.data.map(service => ({
          id_master_aktivasi: service.id_master_aktivasi,
          service: service.nama_service || service.service,
          satuan: service.satuan,
          harga_satuan: service.harga_satuan || service.harga,
          qty: 0,
          total: 0
        }));
        
        if (existingLayanan) {
          setFormData(prev => ({
            ...prev,
            services: initialServices,
            nama_ptl: existingLayanan.nama_ptl || currentUser?.nama_user || ''
          }));
          setExistingTotalRAB(existingLayanan.tarif_akses || 0);
        } else {
          setFormData(prev => ({
            ...prev,
            services: initialServices,
            nama_ptl: currentUser?.nama_user || ''
          }));
          setExistingTotalRAB(0);
        }
      } else {
        console.warn("⚠️ Tidak ada data service untuk pemasangan:", selectedPemasangan);
        setMasterServices([]);
        setFormData(prev => ({ 
          ...prev, 
          services: [],
          nama_ptl: currentUser?.nama_user || ''
        }));
        setExistingTotalRAB(0);
      }
    } catch (error) {
      console.error('❌ Error loading master services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && selectedPemasangan) {
      loadMasterServices();
    }
  }, [isOpen, selectedPemasangan, layananData, currentUser]);

  const handleQtyChange = (index, newQty) => {
    const updatedServices = [...formData.services];
    const service = updatedServices[index];
    const qtyValue = newQty === '' ? 0 : Math.max(0, parseInt(newQty) || 0);
    
    service.qty = qtyValue;
    service.total = service.harga_satuan * qtyValue;
    
    setFormData(prev => ({
      ...prev,
      services: updatedServices
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalRAB = () => {
    return formData.services.reduce((total, service) => total + service.total, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi sebelum submit
    if (!hasValidServices()) {
      alert('Harap isi minimal satu service dengan QTY lebih dari 0');
      return;
    }
    
    if (!canSubmit()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Aktivasi sets Total RAB which will be saved as tarif_akses
      const dataToSave = {
        tarif_akses: calculateTotalRAB(), // This is the Total RAB
        nama_ptl: formData.nama_ptl,
        jenis_pemasangan: selectedPemasangan,
        selected_services: formData.services.filter(service => service.qty > 0)
      };

      console.log("💾 Aktivasi saving Total RAB to tarif_akses:", dataToSave);
      console.log("🔑 ID Penawaran Layanan:", layananData?.id);

      // Use new endpoint: PUT /api/penawaran/layanan/:id/tarif-akses
      const response = await fetch(
        `http://localhost:3000/api/penawaran/layanan/${layananData?.id}/tarif-akses`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(dataToSave)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Save response:", result);
      
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        throw new Error(result.message || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('❌ Error saving data:', error);
      alert(`Gagal menyimpan Total RAB: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkAllLayananHaveTarifAkses = async (idPenawaran) => {
    try {
      console.log("🔍 Checking if all layanan have tarif_akses for penawaran:", idPenawaran);
      
      const response = await fetch(`http://localhost:3000/api/penawaran/${idPenawaran}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const penawaranData = result.data;
        const layananList = penawaranData.data_penawaran_layanan || [];
        
        console.log("📋 Layanan list:", layananList.map(l => ({
          id: l.id_penawaran_layanan,
          nama: l.nama_layanan,
          tarif_akses: l.tarif_akses,
          hasTarifAkses: l.tarif_akses && l.tarif_akses > 0
        })));
        
        const allHaveTarifAkses = layananList.every(layanan => 
          layanan.tarif_akses && layanan.tarif_akses > 0
        );
        
        console.log(`✅ All layanan have tarif_akses: ${allHaveTarifAkses}`);
        return allHaveTarifAkses;
      }
      
      return false;
    } catch (error) {
      console.error("❌ Error checking layanan tarif_akses:", error);
      return false;
    }
  };

  const handleCloseSuccessModal = async () => {
    try {
      const idPenawaran = penawaranData?.id_penawaran || penawaranData?.id;
      const allLayananHaveTarifAkses = await checkAllLayananHaveTarifAkses(idPenawaran);
      
      console.log(`🎯 Navigation decision - All have tarif_akses: ${allLayananHaveTarifAkses}`);
      
      if (onSave) {
        onSave({
          success: true,
          totalRAB: calculateTotalRAB(),
          jenisPemasangan: selectedPemasangan,
          shouldNavigateToIndex: allLayananHaveTarifAkses
        });
      }
      
    } catch (error) {
      console.error("❌ Error in handleCloseSuccessModal:", error);
      if (onSave) {
        onSave({
          success: true,
          totalRAB: calculateTotalRAB(),
          jenisPemasangan: selectedPemasangan,
          shouldNavigateToIndex: false
        });
      }
    }
  };


  const handleCancel = () => {
    setFormData({
      nama_ptl: currentUser?.nama_user || '',
      services: []
    });
    setExistingTotalRAB(0);
    onClose();
  };

  if (!isOpen) return null;

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const lokasiPelanggan = getLokasiPelanggan();
  const currentTotalRAB = calculateTotalRAB();
  const hasExistingData = existingTotalRAB > 0;

  return (
    <>
      <style>
        {`
          input::placeholder {
            color: ${colors.accent1};
            opacity: 0.6;
            fontFamily: "'Open Sans', sans-serif !important";
          }
          select::placeholder {
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
              zIndex: 1002,
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
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative'
              }}
            >
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
                  {hasExistingData ? 'Edit' : 'Tambah'} Tarif Akses - {selectedPemasangan}
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Lengkapi data layanan dan pilih service yang diperlukan
                </p>
              </motion.div>

              {/* Form */}
              <motion.form 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                onSubmit={handleSubmit} 
                style={{
                  background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '24px',
                  margin: '0 32px 32px',
                  border: `1px solid rgba(0, 192, 202, 0.68)`,
                  position: 'relative'
                }}
              >
                {/* Data Pelanggan */}
                <div style={{
                  background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: `1px solid ${colors.secondary}30`
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: colors.primary,
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <User size={20} />
                    Data Pelanggan
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: colors.primary,
                        marginBottom: '8px',
                        display: 'block'
                      }}>Nama Pelanggan</label>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.primary}30`,
                        backgroundColor: '#f8fcfd',
                        color: colors.primary,
                        fontSize: '14px'
                      }}>
                        {penawaranData?.namaPelanggan || '-'}
                      </div>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: colors.primary,
                        marginBottom: '8px',
                        display: 'block'
                      }}>Lokasi Pelanggan</label>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.primary}30`,
                        backgroundColor: '#f8fcfd',
                        color: colors.primary,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <MapPin size={16} color={colors.primary} />
                        {lokasiPelanggan}
                      </div>
                    </div>
                  </div>

                  {/* Nama PTL dan Total RAB */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: hasExistingData ? '1fr 1fr' : '1fr', 
                    gap: '16px',
                    marginTop: '16px'
                  }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: colors.primary,
                        marginBottom: '8px',
                        display: 'block'
                      }}>Nama PTL</label>
                      <input
                        type="text"
                        name="nama_ptl"
                        value={formData.nama_ptl}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: `1px solid ${colors.primary}30`,
                          fontSize: '14px',
                          backgroundColor: '#f0f9fa',
                          color: colors.primary,
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontFamily: "'Open Sans', sans-serif",
                          cursor: 'not-allowed',
                          opacity: 0.8
                        }}
                      />
                    </div>

                    {/* Kolom Total RAB Sebelumnya */}
                    {hasExistingData && (
                      <div>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: colors.primary,
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <DollarSign size={16} />
                          Total RAB Sebelumnya
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: `2px solid ${colors.success}40`,
                          backgroundColor: `${colors.success}15`,
                          color: colors.success,
                          fontSize: '16px',
                          fontWeight: '600',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}>
                          <DollarSign size={18} color={colors.success} />
                          {formatCurrency(existingTotalRAB)}
                        </div>
                        <p style={{
                          fontSize: '12px',
                          color: colors.accent1,
                          margin: '4px 0 0 0',
                          textAlign: 'center',
                          fontStyle: 'italic'
                        }}>
                          Total RAB yang telah disimpan sebelumnya
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Daftar Service */}
                <div style={{
                  background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: `1px solid ${colors.secondary}30`
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: colors.primary,
                    margin: '0 0 20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Package size={20} />
                    Daftar Service {selectedPemasangan}
                  </h3>

                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: colors.primary }}>
                      Memuat data service...
                    </div>
                  ) : formData.services.length > 0 ? (
                    <div style={{ overflowX: 'auto', padding: '0 10px' }}>
                      <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        fontSize: '11px'
                      }}>
                        <thead>
                          <tr style={{ 
                            backgroundColor: colors.primary,
                            color: 'white'
                          }}>
                            <th style={{ 
                              padding: '8px 35px',
                              fontWeight: '600',
                              textAlign: 'left',
                              width: '40%'
                            }}>
                              Service
                            </th>
                            <th style={{ 
                              padding: '8px 6px', 
                              fontWeight: '600',
                              textAlign: 'left',
                              width: '10%'
                            }}>
                              Satuan
                            </th>
                            <th style={{ 
                              padding: '8px 6px', 
                              fontWeight: '600',
                              textAlign: 'right',
                              width: '15%'
                            }}>
                              Harga Satuan
                            </th>
                            <th style={{ 
                              padding: '8px 6px', 
                              fontWeight: '600',
                              textAlign: 'center',
                              width: '15%'
                            }}>
                              QTY
                            </th>
                            <th style={{ 
                              padding: '8px 35px',
                              fontWeight: '600',
                              textAlign: 'right',
                              width: '20%'
                            }}>
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.services.map((service, index) => (
                            <tr 
                              key={service.id_master_aktivasi}
                              style={{ 
                                backgroundColor: index % 2 === 0 ? '#f8fcfd' : '#f0f9fa',
                                borderBottom: `1px solid ${colors.primary}10`
                              }}
                            >
                              <td style={{ 
                                padding: '8px 35px',
                                color: colors.primary,
                                wordWrap: 'break-word'
                              }}>
                                {service.service}
                              </td>
                              <td style={{ 
                                padding: '8px 6px', 
                                color: colors.primary
                              }}>
                                {service.satuan}
                              </td>
                              <td style={{ 
                                padding: '8px 6px', 
                                color: colors.primary,
                                textAlign: 'right',
                                fontWeight: '600'
                              }}>
                                {formatCurrency(service.harga_satuan)}
                              </td>
                              <td style={{ 
                                padding: '8px 6px', 
                                textAlign: 'center'
                              }}>
                                <input
                                  type="number"
                                  min="0"
                                  value={service.qty === 0 ? '' : service.qty}
                                  onChange={(e) => handleQtyChange(index, e.target.value)}
                                  placeholder="0"
                                  style={{
                                    width: '60px',
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    border: `1px solid ${colors.primary}30`,
                                    fontSize: '11px',
                                    textAlign: 'center',
                                    backgroundColor: '#ffffff',
                                    color: colors.primary,
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    fontFamily: "'Open Sans', sans-serif"
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = colors.secondary}
                                  onBlur={(e) => e.target.style.borderColor = `${colors.primary}30`}
                                />
                              </td>
                              <td style={{ 
                                padding: '8px 35px',
                                color: colors.primary,
                                textAlign: 'right',
                                fontWeight: '600'
                              }}>
                                {formatCurrency(service.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: colors.primary,
                      opacity: 0.7
                    }}>
                      Tidak ada data service untuk {selectedPemasangan}
                    </div>
                  )}
                </div>

                {/* Total RAB Baru */}
                <div style={{
                  background: `linear-gradient(135deg, ${colors.success}15 0%, ${colors.secondary}15 100%)`,
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: `2px solid ${colors.success}30`,
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: colors.primary
                    }}>
                      Total RAB:
                    </span>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: colors.success,
                      background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {formatCurrency(currentTotalRAB)}
                    </span>
                  </div>
                  
                  {/* Pesan validasi */}
                  {!hasValidServices() && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontSize: '14px',
                        color: '#e53e3e',
                        margin: '8px 0 0 0',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                       ⚠️ {hasExistingData 
                        ? 'Jika ingin mengubah Total RAB maka, Harap isi minimal satu service dengan QTY lebih dari 0'
                        : 'Harap isi minimal satu service dengan QTY lebih dari 0'
                      }
                    </motion.p>
                  )}
                </div>

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
                    whileHover={canSubmit() ? { scale: 1.02, y: -2 } : {}}
                    whileTap={canSubmit() ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={!canSubmit()}
                    style={{
                      background: !canSubmit() 
                        ? `linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)`
                        : isSubmitting 
                        ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                        : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                      color: '#ffffff',
                      border: 'none',
                      padding: '16px 40px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: canSubmit() ? 'pointer' : 'not-allowed',
                      boxShadow: canSubmit() 
                        ? `0 4px 20px rgba(0, 191, 202, 0.4)`
                        : 'none',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.02em',
                      opacity: canSubmit() ? 1 : 0.6
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
              zIndex: 1003,
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
                {hasExistingData ? 'Berhasil!' : 'Berhasil!'}
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
                {hasExistingData 
                  ? `Data layanan telah berhasil diperbarui. Total RAB: ${formatCurrency(currentTotalRAB)}`
                  : `Data layanan telah berhasil disimpan. Total RAB: ${formatCurrency(currentTotalRAB)}`
                }
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

export default Edit;
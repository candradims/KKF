import React, { useState, useEffect } from 'react';
import { X, Plus, Calculator, Check } from 'lucide-react';
import { getUserData, getAuthHeaders } from '../../../utils/api';

const Hapus = ({ isOpen, onClose, onConfirm, deleteData }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pengeluaranData, setPengeluaranData] = useState([]);
  const [loadingPengeluaran, setLoadingPengeluaran] = useState(false);
  const [formData, setFormData] = useState({
    sales: '',
    tanggal: '',
    pelanggan: '',
    nomorKontrak: '',
    kontrakTahunKe: '',
    referensiHJT: '',
    durasiKontrak: '',
    discount: '',
    piliLayanan: '',
    keterangan: '',
    kapasitas: '',
    qty: '',
    aksesExisting: '',
    hargaFinalSebelumPPN: ''
  });

  // Pre-fill form with existing data when deleting
  useEffect(() => {
    if (deleteData) {
      setFormData({
        sales: deleteData.sales || '',
        tanggal: deleteData.tanggal || '',
        pelanggan: deleteData.namaPelanggan || deleteData.pelanggan || '',
        nomorKontrak: deleteData.nomorKontrak || '',
        kontrakTahunKe: deleteData.kontrakKe || deleteData.kontrakTahunKe || '',
        referensiHJT: deleteData.referensi || deleteData.referensiHJT || '',
        durasiKontrak: deleteData.durasi || deleteData.durasiKontrak || '',
        discount: deleteData.discount || '',
        piliLayanan: deleteData.piliLayanan || '',
        keterangan: deleteData.keterangan || '',
        kapasitas: deleteData.kapasitas || '',
        qty: deleteData.qty || '',
        aksesExisting: deleteData.aksesExisting || '',
        hargaFinalSebelumPPN: deleteData.hargaFinalSebelumPPN || ''
      });

      // Load pengeluaran data
      loadPengeluaranData();
    }
  }, [deleteData]);

  const loadPengeluaranData = async () => {
    if (!deleteData?.id_penawaran) return;

    setLoadingPengeluaran(true);
    try {
      // Get auth data using utility function
      const userData = getUserData();
      if (!userData) {
        console.log('❌ No user data for loading pengeluaran');
        setPengeluaranData([]);
        return;
      }

      console.log('📋 Loading pengeluaran data for penawaran ID:', deleteData.id_penawaran);

      // Get auth headers using utility function
      const headers = getAuthHeaders();
      console.log('📋 Using headers:', headers);

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

  const handleConfirm = async () => {
    setIsDeleting(true);
    
    try {
      // First check if there's associated pengeluaran data
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
              
              // Delete each pengeluaran record
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
      
      // Now delete the penawaran (this calls the parent's onConfirm)
      onConfirm(deleteData);
      
      // Immediately transition to success modal
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
    setFormData({
      sales: '',
      tanggal: '',
      pelanggan: '',
      nomorKontrak: '',
      kontrakTahunKe: '',
      referensiHJT: '',
      durasiKontrak: '',
      discount: '',
      piliLayanan: '',
      keterangan: '',
      kapasitas: '',
      qty: '',
      aksesExisting: '',
      hargaFinalSebelumPPN: ''
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen && !showSuccessModal) return null;

  return (
    <div>
      {/* Main Modal */}
      {isOpen && !showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
          transition: 'opacity 0.2s ease-in-out'
        }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        width: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        transform: isDeleting ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.2s ease-in-out'
      }}>
        {/* Close Button */}
        <button
          onClick={handleCancel}
          disabled={isDeleting}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            padding: '4px',
            color: '#374151',
            zIndex: 10,
            opacity: isDeleting ? 0.5 : 1
          }}
        >
          <X style={{ width: '24px', height: '24px' }} />
        </button>

        {/* Header */}
        <div style={{
          padding: '30px 30px 20px 30px',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '600',
            color: '#DC2626'
          }}>
            Hapus Data Penawaran
          </h2>
        </div>

        {/* Warning Message */}
        <div style={{
          padding: '0 30px',
          marginBottom: '20px'
        }}>
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <p style={{
              margin: 0,
              color: '#991B1B',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ⚠️ Apakah Anda yakin ingin menghapus data penawaran berikut?
            </p>
            <p style={{
              margin: '8px 0 0 0',
              color: '#7F1D1D',
              fontSize: '12px'
            }}>
              Data penawaran dan semua pengeluaran terkait akan terhapus permanen!
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '0 30px 30px 30px' }}>
          {/* Sales Field (Top Right) */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginBottom: '20px' 
          }}>
            <div style={{ width: '200px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Sales*
              </label>
              <input
                type="text"
                name="sales"
                value={formData.sales}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#F9FAFB',
                  boxSizing: 'border-box',
                  color: '#6B7280'
                }}
              />
            </div>
          </div>

          {/* Main Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Tanggal */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Tanggal*
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#F9FAFB',
                  boxSizing: 'border-box',
                  color: '#6B7280'
                }}
              />
            </div>

            {/* Pelanggan */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Pelanggan*
              </label>
              <input
                type="text"
                name="pelanggan"
                value={formData.pelanggan}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#F9FAFB',
                  boxSizing: 'border-box',
                  color: '#6B7280'
                }}
              />
            </div>

            {/* Nomor Kontrak / BAKB */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Nomor Kontrak / BAKB*
              </label>
              <input
                type="text"
                name="nomorKontrak"
                value={formData.nomorKontrak}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#F9FAFB',
                  boxSizing: 'border-box',
                  color: '#6B7280'
                }}
              />
            </div>

            {/* Kontrak Tahun Ke */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Kontrak Tahun ke-*
              </label>
              <input
                type="text"
                name="kontrakTahunKe"
                value={formData.kontrakTahunKe}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#F9FAFB',
                  boxSizing: 'border-box',
                  color: '#6B7280'
                }}
              />
            </div>

            {/* Referensi HJT */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Referensi HJT*
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  name="referensiHJT"
                  value={formData.referensiHJT}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#F9FAFB',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    color: '#6B7280'
                  }}
                >
                  <option value="">Pilih HJT</option>
                  <option value="sumatera">Sumatera</option>
                  <option value="kalimantan">Kalimantan</option>
                  <option value="jawa-bali">Jawa-Bali</option>
                  <option value="intim">Intim</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: '12px',
                  color: '#9CA3AF'
                }}>▼</div>
              </div>
            </div>

            {/* Discount */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Discount*
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  name="discount"
                  value={formData.discount}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#F9FAFB',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    color: '#6B7280'
                  }}
                >
                  <option value="">Pilih Discount</option>
                  <option value="0%">0%</option>
                  <option value="MB Niaga">MB Niaga</option>
                  <option value="GM SBU">GM SBU</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: '12px',
                  color: '#9CA3AF'
                }}>▼</div>
              </div>
            </div>

            {/* Durasi Kontrak */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Durasi Kontrak (in thn)*
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  name="durasiKontrak"
                  value={formData.durasiKontrak}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#F9FAFB',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    color: '#6B7280'
                  }}
                >
                  <option value="">Durasi Kontrak</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: '12px',
                  color: '#9CA3AF'
                }}>▼</div>
              </div>
            </div>

            {/* Add Button (Disabled) */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                disabled
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#E5E7EB',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9CA3AF',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <Plus style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Second Section with Light Blue Background */}
            <div style={{
              backgroundColor: '#F0F9FF',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {/* Pilih Layanan */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Pilih Layanan*
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="piliLayanan"
                    value={formData.piliLayanan}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                      appearance: 'none',
                      color: '#6B7280'
                    }}
                  >
                    <option value="">Pilih Layanan</option>
                    <option value="IP VPN">IP VPN</option>
                    <option value="Metronet">Metronet</option>
                    <option value="Inet Corp">Inet Corp</option>
                    <option value="IP Transit">IP Transit</option>
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    fontSize: '12px',
                    color: '#9CA3AF'
                  }}>▼</div>
                </div>
              </div>

              {/* Detail Layanan */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Detail Layanan*
                </label>
                <input
                  type="text"
                  name="keterangan"
                  value={formData.keterangan}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    color: '#6B7280'
                  }}
                />
              </div>

              {/* Kapasitas */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Kapasitas*
                </label>
                <input
                  type="text"
                  name="kapasitas"
                  value={formData.kapasitas}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    color: '#6B7280'
                  }}
                />
              </div>

              {/* Qty */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Qty*
                </label>
                <input
                  type="text"
                  name="qty"
                  value={formData.qty}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    color: '#6B7280'
                  }}
                />
              </div>

              {/* Akses Existing */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Akses Existing*
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="aksesExisting"
                    value={formData.aksesExisting}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                      appearance: 'none',
                      color: '#6B7280'
                    }}
                  >
                    <option value="">Pilih akses</option>
                    <option value="ya">Ya</option>
                    <option value="tidak">Tidak</option>
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    fontSize: '12px',
                    color: '#9CA3AF'
                  }}>▼</div>
                </div>
              </div>

              {/* Harga Final (Sebelum PPN) */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Harga Final (Sebelum PPN)*
                </label>
                <input
                  type="text"
                  name="hargaFinalSebelumPPN"
                  value={formData.hargaFinalSebelumPPN}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    color: '#6B7280'
                  }}
                />
              </div>
            </div>

            {/* Pengeluaran Lain-lain History Section */}
            {pengeluaranData.length > 0 && (
              <div style={{
                backgroundColor: '#e3f2fd',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #bbdefb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1565C0'
                  }}>
                    📋 History Pengeluaran Lain-lain
                  </h4>
                  <span style={{
                    fontSize: '11px',
                    color: '#DC2626',
                    fontStyle: 'italic',
                    fontWeight: '500'
                  }}>
                    ⚠️ {pengeluaranData.length} item akan terhapus
                  </span>
                </div>
                
                {loadingPengeluaran ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#1565C0',
                    fontSize: '14px'
                  }}>
                    Memuat data pengeluaran...
                  </div>
                ) : (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {pengeluaranData.map((item, index) => (
                      <div key={item.id_pengeluaran || index} style={{
                        backgroundColor: 'white',
                        border: '1px solid #bbdefb',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: index < pengeluaranData.length - 1 ? '12px' : '0'
                      }}>
                        {/* Item */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '12px',
                          minHeight: '32px'
                        }}>
                          <label style={{
                            width: '140px',
                            fontSize: '12px',
                            color: '#333',
                            fontWeight: '500',
                            flexShrink: 0
                          }}>
                            Item*
                          </label>
                          <div style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: '#f9f9f9',
                            color: '#666'
                          }}>
                            {item.item || '-'}
                          </div>
                        </div>

                        {/* Keterangan */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '12px',
                          minHeight: '32px'
                        }}>
                          <label style={{
                            width: '140px',
                            fontSize: '12px',
                            color: '#333',
                            fontWeight: '500',
                            flexShrink: 0
                          }}>
                            Keterangan*
                          </label>
                          <div style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: '#f9f9f9',
                            color: '#666'
                          }}>
                            {item.keterangan || 'Tidak ada keterangan'}
                          </div>
                        </div>

                        {/* Hasrat */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '12px',
                          minHeight: '32px'
                        }}>
                          <label style={{
                            width: '140px',
                            fontSize: '12px',
                            color: '#333',
                            fontWeight: '500',
                            flexShrink: 0
                          }}>
                            Hasrat*
                          </label>
                          <div style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: '#f9f9f9',
                            color: '#666'
                          }}>
                            Rp {(item.harga_satuan || 0).toLocaleString('id-ID')}
                          </div>
                        </div>

                        {/* Jumlah */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '12px',
                          minHeight: '32px'
                        }}>
                          <label style={{
                            width: '140px',
                            fontSize: '12px',
                            color: '#333',
                            fontWeight: '500',
                            flexShrink: 0
                          }}>
                            Jumlah*
                          </label>
                          <div style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: '#f9f9f9',
                            color: '#666'
                          }}>
                            {item.jumlah || 0}
                          </div>
                        </div>
                        
                        {/* Display total */}
                        <div style={{
                          padding: '8px 12px',
                          backgroundColor: '#ffebee',
                          border: '1px solid #ef9a9a',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: '#c62828'
                        }}>
                          <strong>Total: Rp {(item.total_harga || 0).toLocaleString('id-ID')}</strong>
                        </div>
                      </div>
                    ))}
                    
                    {/* Total Keseluruhan */}
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: '#ffcdd2',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '600',
                      border: '2px solid #ef5350'
                    }}>
                      <span style={{ color: '#c62828', fontSize: '14px' }}>
                        Total Keseluruhan Pengeluaran yang akan Dihapus:
                      </span>
                      <span style={{ color: '#b71c1c', fontSize: '16px' }}>
                        Rp {pengeluaranData.reduce((total, item) => total + (item.total_harga || 0), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '20px'
            }}>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isDeleting}
                style={{
                  padding: '12px 24px',
                  backgroundColor: isDeleting ? '#ccc' : '#6B7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  minWidth: '100px',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  if (!isDeleting) e.target.style.backgroundColor = '#5B6470';
                }}
                onMouseOut={(e) => {
                  if (!isDeleting) e.target.style.backgroundColor = '#6B7280';
                }}
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                style={{
                  padding: '12px 24px',
                  backgroundColor: isDeleting ? '#ccc' : '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  minWidth: '100px',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  if (!isDeleting) e.target.style.backgroundColor = '#B91C1C';
                }}
                onMouseOut={(e) => {
                  if (!isDeleting) e.target.style.backgroundColor = '#DC2626';
                }}
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
        )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            maxWidth: '300px',
            width: '90%',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#00AEEF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
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
              Data Penawaran Berhasil Dihapus
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
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            transform: translateY(20px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
      `}
      </style>
    </div>
  );
};

export default Hapus;

import React, { useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

const Tambah = ({ isOpen, onClose, onSave }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    pelanggan: '',
    tanggal: '',
    pelangganField: '',
    nomorKontrak: '',
    kontrakKe: '',
    referensiHjt: '',
    discount: '',
    durasiKontrak: '',
    targetIrr: '',
    oneTimeBooking: '',
    oneTimeStart: '',
    item: '',
    keterangan: '',
    harga: '',
    jumlah: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    onSave(formData);
    
    // Immediately transition to success modal
    setShowSuccessModal(true);
    setIsSaving(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setFormData({
      pelanggan: '',
      tanggal: '',
      pelangganField: '',
      nomorKontrak: '',
      kontrakKe: '',
      referensiHjt: '',
      discount: '',
      durasiKontrak: '',
      targetIrr: '',
      oneTimeBooking: '',
      oneTimeStart: '',
      item: '',
      keterangan: '',
      harga: '',
      jumlah: ''
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      pelanggan: '',
      tanggal: '',
      pelangganField: '',
      nomorKontrak: '',
      kontrakKe: '',
      referensiHjt: '',
      discount: '',
      durasiKontrak: '',
      targetIrr: '',
      oneTimeBooking: '',
      oneTimeStart: '',
      item: '',
      keterangan: '',
      harga: '',
      jumlah: ''
    });
    onClose();
  };

  if (!isOpen && !showSuccessModal) return null;

  return (
    <div>
      {/* Main Add Modal */}
      {isOpen && !showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          transition: 'opacity 0.2s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e0e0e0',
            transform: isSaving ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.2s ease-in-out'
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0',
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                margin: 0
              }}>
                Tambah Data Pengeluaran
              </h2>
              <button
                onClick={onClose}
                disabled={isSaving}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  color: '#666',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  opacity: isSaving ? 0.5 : 1
                }}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: '20px' }}>
              {/* Form fields - single column layout */}
              <div style={{ marginBottom: '20px' }}>
                {/* Pelanggan */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Pelanggan*
                  </label>
                  <select
                    name="pelanggan"
                    value={formData.pelanggan}
                    onChange={handleChange}
                    disabled={isSaving}
                    required
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">Pilih nama Pelanggan</option>
                    <option value="audrey">Audrey</option>
                    <option value="riki">Riki</option>
                    <option value="hasian">Hasian</option>
                    <option value="hisyam">Hisyam</option>
                  </select>
                </div>

                {/* Tanggal */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="dd/mm/yyyy"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      color: '#999',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Nomor Kontrak / BAKB */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Nomor kontrak / BAKB
                  </label>
                  <input
                    type="text"
                    name="nomorKontrak"
                    value={formData.nomorKontrak}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="Nomor kontrak"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Kontrak Tahun ke- */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Kontrak Tahun ke-
                  </label>
                  <input
                    type="text"
                    name="kontrakKe"
                    value={formData.kontrakKe}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="Kontrak tahun ke berapa"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Referensi HJT */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Referensi HJT
                  </label>
                  <select
                    name="referensiHjt"
                    value={formData.referensiHjt}
                    onChange={handleChange}
                    disabled={isSaving}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 8px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      cursor: isSaving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">HJT</option>
                    <option value="JAWA-BALI">JAWA-BALI</option>
                    <option value="SUMATRA">SUMATRA</option>
                    <option value="JABODETABEK">JABODETABEK</option>
                    <option value="INTIM">INTIM</option>
                  </select>
                </div>

                {/* Discount */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Discount
                  </label>
                  <select
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    disabled={isSaving}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 8px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      cursor: isSaving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">Discount</option>
                    <option value="0">0</option>
                    <option value="MB Niaga">MB Niaga</option>
                    <option value="GM SBU">GM SBU</option>
                  </select>
                </div>

                {/* Durasi kontrak (in thn) */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Durasi kontrak (in thn)
                  </label>
                  <select
                    name="durasiKontrak"
                    value={formData.durasiKontrak}
                    onChange={handleChange}
                    disabled={isSaving}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 8px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      cursor: isSaving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">Durasi kontrak (in thn)</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                {/* Target IRR */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Target IRR
                  </label>
                  <input
                    type="text"
                    name="targetIrr"
                    value={formData.targetIrr}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="Target IRR"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Disc thdp Backbone */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Disc thdp Backbone
                  </label>
                  <input
                    type="text"
                    name="oneTimeBooking"
                    value={formData.oneTimeBooking}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="0.00%"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Disc thdp Port Max 60% */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Disc thdp Port Max 60%
                  </label>
                  <input
                    type="text"
                    name="oneTimeStart"
                    value={formData.oneTimeStart}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="0.00%"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>
              </div>

              {/* Section dengan background biru muda */}
              <div style={{
                backgroundColor: '#e3f2fd',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #bbdefb'
              }}>
                {/* Item */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
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
                  <input
                    type="text"
                    name="item"
                    value={formData.item}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="Masukkan Item"
                    required
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Keterangan */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
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
                  <input
                    type="text"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="Masukkan keterangan"
                    required
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Harga */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  minHeight: '40px'
                }}>
                  <label style={{
                    width: '140px',
                    fontSize: '12px',
                    color: '#333',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    Harga*
                  </label>
                  <input
                    type="text"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="Masukkan harga satuan"
                    required
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Jumlah */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  minHeight: '40px'
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
                  <input
                    type="text"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="Masukkan Jumlah"
                    required
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: isSaving ? '#f5f5f5' : 'white',
                      cursor: isSaving ? 'not-allowed' : 'text'
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                paddingTop: '16px',
                borderTop: '1px solid #e0e0e0'
              }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  style={{
                    padding: '8px 20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: isSaving ? '#ccc' : '#2196F3',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    minWidth: '70px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (!isSaving) e.target.style.backgroundColor = '#1976D2';
                  }}
                  onMouseOut={(e) => {
                    if (!isSaving) e.target.style.backgroundColor = '#2196F3';
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  style={{
                    padding: '8px 20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: isSaving ? '#ccc' : '#00BCD4',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    minWidth: '70px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (!isSaving) e.target.style.backgroundColor = '#0097A7';
                  }}
                  onMouseOut={(e) => {
                    if (!isSaving) e.target.style.backgroundColor = '#00BCD4';
                  }}
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
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
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            maxWidth: '300px',
            width: '90%',
            animation: 'slideUp 0.3s ease-out'
          }}>
            {/* Success Icon */}
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

            {/* Success Message */}
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 8px 0'
            }}>
              Selamat!
            </h3>
            
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '0 0 20px 0',
              lineHeight: '1.4'
            }}>
              Data Pengeluaran Berhasil Disimpan
            </p>

            {/* OK Button */}
            <button
              onClick={handleSuccessClose}
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
                transition: 'all 0.2s'
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

export default Tambah;
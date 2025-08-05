import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

const Edit = ({ isOpen, onClose, onSave, editData }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
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

  // Pre-fill form with edit data
  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        tanggal: editData.tanggal || '',
        pelangganField: editData.namaPelanggan || '',
        nomorKontrak: editData.nomorKontrak || '',
        kontrakKe: editData.kontrakKe || '',
        referensiHjt: editData.referensi || '',
        discount: editData.discount || '',
        durasiKontrak: editData.durasi || '',
        targetIrr: editData.targetIRR || '',
        oneTimeBooking: '',
        oneTimeStart: '',
        item: '',
        keterangan: '',
        harga: '',
        jumlah: ''
      });
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
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
    // Show success popup instead of closing immediately
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close the edit modal after success popup
  };

  const handleCancel = () => {
    setFormData({
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
    setShowSuccessModal(false); // Reset success modal state
    onClose();
  };

  if (!isOpen && !showSuccessModal) return null;

  return (
    <div>
      {/* Main Edit Modal */}
      {isOpen && (
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
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e0e0e0'
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: '#e3f2fd',
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
                color: '#1976d2',
                margin: 0
              }}>
                Edit Data Pengeluaran
              </h2>
              <button
                onClick={handleCancel}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
              <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <div style={{ marginBottom: '20px' }}>
                  
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
                      Tanggal *
                    </label>
                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                  </div>

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
                      Pelanggan *
                    </label>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <select
                        name="pelangganField"
                        value={formData.pelangganField}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '8px 32px 8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: 'white',
                          appearance: 'none'
                        }}
                      >
                        <option value="">Pilih Pelanggan</option>
                        <option value="PT. ABC">PT. ABC</option>
                        <option value="PT. DEF">PT. DEF</option>
                        <option value="PT. GHI">PT. GHI</option>
                      </select>
                      <ChevronDown style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: '#666',
                        pointerEvents: 'none'
                      }} />
                    </div>
                  </div>

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
                      Nomor kontrak / BAKB *
                    </label>
                    <input
                      type="text"
                      name="nomorKontrak"
                      value={formData.nomorKontrak}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                  </div>

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
                      Kontrak Tahun ke- *
                    </label>
                    <input
                      type="number"
                      name="kontrakKe"
                      value={formData.kontrakKe}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                  </div>

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
                      Referensi HJT *
                    </label>
                    <input
                      type="text"
                      name="referensiHjt"
                      value={formData.referensiHjt}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                  </div>

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
                      Discount *
                    </label>
                    <input
                      type="text"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                  </div>

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
                      Durasi kontrak (in thn) *
                    </label>
                    <input
                      type="number"
                      name="durasiKontrak"
                      value={formData.durasiKontrak}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                  </div>

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
                      Target IRR *
                    </label>
                    <input
                      type="text"
                      name="targetIrr"
                      value={formData.targetIrr}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                  </div>

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
                      value="0.00%"  
                      readOnly
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: '#f9f9f9',
                        color: '#666'
                      }}
                    />
                  </div>

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
                      value="0.00%"
                      readOnly
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: '#f9f9f9',
                        color: '#666'
                      }}
                    />
                  </div>

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
                      One time booking
                    </label>
                    <input
                      type="text"
                      name="oneTimeBooking"
                      value={formData.oneTimeBooking}
                      onChange={handleChange}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                  </div>

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
                      One time start
                    </label>
                    <input
                      type="text"
                      name="oneTimeStart"
                      value={formData.oneTimeStart}
                      onChange={handleChange}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>

                {/* Blue section for additional fields */}
                <div style={{
                  backgroundColor: '#e3f2fd',
                  borderRadius: '6px',
                  padding: '16px',
                  marginBottom: '20px',
                  border: '1px solid #bbdefb'
                }}>
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
                      Item
                    </label>
                    <input
                      type="text"
                      name="item"
                      value={formData.item}
                      onChange={handleChange}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: 'white'
                      }}
                    />
                  </div>

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
                      Keterangan
                    </label>
                    <input
                      type="text"
                      name="keterangan"
                      value={formData.keterangan}
                      onChange={handleChange}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: 'white'
                      }}
                    />
                  </div>

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
                      Harga
                    </label>
                    <input
                      type="text"
                      name="harga"
                      value={formData.harga}
                      onChange={handleChange}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: 'white'
                      }}
                    />
                  </div>

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
                      Jumlah
                    </label>
                    <input
                      type="text"
                      name="jumlah"
                      value={formData.jumlah}
                      onChange={handleChange}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: 'white'
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e0e0e0'
                }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      padding: '8px 20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'white',
                      backgroundColor: '#2196F3',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      minWidth: '70px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                      padding: '8px 20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'white',
                      backgroundColor: '#00BCD4',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      minWidth: '70px'
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </form>
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
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            maxWidth: '300px',
            width: '90%'
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
              Data Pengeluaran Berhasil Diperbarui
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
                minWidth: '80px'
              }}
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
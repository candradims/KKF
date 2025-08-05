import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const Hapus = ({ isOpen, onClose, onConfirm, deleteData }) => {
  
  const handleConfirm = () => {
    onConfirm(deleteData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
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
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle style={{ width: '24px', height: '24px', color: '#1976d2' }} />
            Hapus Data Penawaran
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
          {/* Question */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              color: '#333',
              fontWeight: '500'
            }}>
              Apakah Anda Yakin Ingin Menghapus Data Berikut?
            </p>
          </div>

          {/* Data Fields */}
          {deleteData && (
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
                  Tanggal
                </label>
                <input
                  type="text"
                  value={deleteData.tanggal || ''}
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
                  Pelanggan
                </label>
                <input
                  type="text"
                  value={deleteData.namaPelanggan || ''}
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
                  Nomor kontrak / BAKB
                </label>
                <input
                  type="text"
                  value={deleteData.nomorKontrak || ''}
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
                  Kontrak Tahun ke-
                </label>
                <input
                  type="text"
                  value={deleteData.kontrakKe || ''}
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
                  Referensi HJT
                </label>
                <input
                  type="text"
                  value={deleteData.referensi || ''}
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
                  Discount
                </label>
                <input
                  type="text"
                  value={deleteData.discount || ''}
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
                  Durasi kontrak (in thn)
                </label>
                <input
                  type="text"
                  value={deleteData.durasi || ''}
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
                  Target IRR
                </label>
                <input
                  type="text"
                  value={deleteData.targetIRR || ''}
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

              {/* Blue section for additional fields */}
              <div style={{
                backgroundColor: '#e3f2fd',
                borderRadius: '6px',
                padding: '16px',
                marginTop: '16px',
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
                    value=""
                    readOnly
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: 'white',
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
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value=""
                    readOnly
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: 'white',
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
                    Harga
                  </label>
                  <input
                    type="text"
                    value=""
                    readOnly
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: 'white',
                      color: '#666'
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
                    value=""
                    readOnly
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: 'white',
                      color: '#666'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #e0e0e0'
          }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '10px 24px',
                fontSize: '12px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2196F3',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '80px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#1976D2';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#2196F3';
              }}
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '10px 24px',
                fontSize: '12px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#00BCD4',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '80px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0097A7';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#00BCD4';
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hapus;
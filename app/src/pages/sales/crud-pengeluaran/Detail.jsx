import React from 'react';
import { X } from 'lucide-react';

const Detail = ({ isOpen, onClose, detailData }) => {
  
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
            Detail Data Penawaran
          </h2>
          <button
            onClick={onClose}
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
                Pelanggan
              </label>
              <input
                type="text"
                value={detailData?.namaPelanggan || ''}
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
                type="text"
                value={detailData?.tanggal || ''}
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
                value={detailData?.nomorKontrak || ''}
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
                value={detailData?.kontrakKe || ''}
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
              <input
                type="text"
                value={detailData?.referensi || ''}
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
              <input
                type="text"
                value={detailData?.discount || ''}
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
              <input
                type="text"
                value={detailData?.durasi || ''}
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
                value={detailData?.targetIRR || ''}
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

          {/* Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;

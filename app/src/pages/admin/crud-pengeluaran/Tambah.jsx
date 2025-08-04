import React, { useState } from 'react';
import { X } from 'lucide-react';

const Tambah = ({ isOpen, onClose, onSave }) => {
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
    onSave(formData);
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
            Tambah Data Pengeluaran
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
                required
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none',
                  backgroundColor: 'white'
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
                placeholder="dd/mm/yyyy"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none',
                  color: '#999'
                }}
              />
            </div>

            {/* Pekerjaan Field */}
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
                Pekerjaan
              </label>
              <input
                type="text"
                name="pelangganField"
                value={formData.pelangganField}
                onChange={handleChange}
                placeholder="Pekerjaan"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
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
                placeholder="Nomor kontrak"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
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
                placeholder="Kontrak tahun ke berapa"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
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
                name="referensiHjt"
                value={formData.referensiHjt}
                onChange={handleChange}
                placeholder="HJT"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
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
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="Discount"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
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
                name="durasiKontrak"
                value={formData.durasiKontrak}
                onChange={handleChange}
                placeholder="Durasi kontrak (in thn)"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
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
                name="targetIrr"
                value={formData.targetIrr}
                onChange={handleChange}
                placeholder="Target IRR"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>

            {/* One Time Booking */}
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
                One Time Booking
              </label>
              <input
                type="text"
                name="oneTimeBooking"
                value={formData.oneTimeBooking}
                onChange={handleChange}
                placeholder="0.00%"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>

            {/* One Time Start From 50% */}
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
                One Time Start From 50%
              </label>
              <input
                type="text"
                name="oneTimeStart"
                value={formData.oneTimeStart}
                onChange={handleChange}
                placeholder="0.00%"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
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
                placeholder="Masukkan Item"
                required
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none',
                  backgroundColor: 'white'
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
                placeholder="Masukkan keterangan"
                required
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none',
                  backgroundColor: 'white'
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
                placeholder="Masukkan harga satuan"
                required
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none',
                  backgroundColor: 'white'
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
                placeholder="Masukkan Jumlah"
                required
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none',
                  backgroundColor: 'white'
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
        </div>
      </div>
    </div>
  );
};

export default Tambah;
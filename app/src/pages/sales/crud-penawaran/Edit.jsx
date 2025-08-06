import React, { useState, useEffect } from 'react';
import { X, Plus, Calculator } from 'lucide-react';

const Edit = ({ isOpen, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    sales: '',
    tanggal: '',
    pelanggan: '',
    nomorKontrak: '',
    kontrakTahunKe: '',
    referensiHJT: '',
    discount: '',
    durasiKontrak: '',
    targetIRR: '',
    discBackbone: '0,00%',
    discPort: '0,00%',
    piliLayanan: '',
    keterangan: '',
    kapasitas: '',
    qty: '',
    aksesExisting: '',
    hargaFinalSebelumPPN: ''
  });

  // Pre-fill form with existing data when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        sales: editData.sales || '',
        tanggal: editData.tanggal || '',
        pelanggan: editData.namaPelanggan || editData.pelanggan || '',
        nomorKontrak: editData.nomorKontrak || '',
        kontrakTahunKe: editData.kontrakKe || editData.kontrakTahunKe || '',
        referensiHJT: editData.referensi || editData.referensiHJT || '',
        discount: editData.discount || '',
        durasiKontrak: editData.durasi || editData.durasiKontrak || '',
        targetIRR: editData.targetIRR || '',
        discBackbone: editData.discBackbone || '0,00%',
        discPort: editData.discPort || '0,00%',
        piliLayanan: editData.piliLayanan || '',
        keterangan: editData.keterangan || '',
        kapasitas: editData.kapasitas || '',
        qty: editData.qty || '',
        aksesExisting: editData.aksesExisting || '',
        hargaFinalSebelumPPN: editData.hargaFinalSebelumPPN || ''
      });
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...editData, ...formData });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      sales: '',
      tanggal: '',
      pelanggan: '',
      nomorKontrak: '',
      kontrakTahunKe: '',
      referensiHJT: '',
      discount: '',
      durasiKontrak: '',
      targetIRR: '',
      discBackbone: '0,00%',
      discPort: '0,00%',
      piliLayanan: '',
      keterangan: '',
      kapasitas: '',
      qty: '',
      aksesExisting: '',
      hargaFinalSebelumPPN: ''
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
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        width: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#374151',
            zIndex: 10
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
            color: '#2C5282'
          }}>
            Edit Data Penawaran
          </h2>
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
                onChange={handleInputChange}
                placeholder="Masukkan Nama"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #B0BEC5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
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
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #B0BEC5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
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
                onChange={handleInputChange}
                placeholder="Masukkan nama Pelanggan"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #B0BEC5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
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
                onChange={handleInputChange}
                placeholder="Masukkan nomor kontrak"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #B0BEC5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
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
                onChange={handleInputChange}
                placeholder="Masukkan kontrak tahun ke berapa"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #B0BEC5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
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
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #B0BEC5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    appearance: 'none'
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
                  color: '#666'
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
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #B0BEC5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    appearance: 'none'
                  }}
                >
                  <option value="">Discount</option>
                  <option value="0">0</option>
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
                  color: '#666'
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
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #B0BEC5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    appearance: 'none'
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
                  color: '#666'
                }}>▼</div>
              </div>
            </div>

            {/* Target IRR */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Target IRR*
              </label>
              <input
                type="text"
                name="targetIRR"
                value={formData.targetIRR}
                onChange={handleInputChange}
                placeholder="Masukkan target IRR"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #B0BEC5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Disc thdp Backbone */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Disc thdp Backbone*
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="discBackbone"
                  value={formData.discBackbone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    border: '2px solid #B0BEC5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#666'
                  }}
                >
                  <Calculator style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>

            {/* Disc thdp Port */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Disc thdp Port (max 60%)*
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="discPort"
                  value={formData.discPort}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    border: '2px solid #B0BEC5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#666'
                  }}
                >
                  <Calculator style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>

            {/* Add Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#00BFFF',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
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
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #B0BEC5',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                      appearance: 'none'
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
                    color: '#666'
                  }}>▼</div>
                </div>
              </div>

              {/* Keterangan */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Keterangan*
                </label>
                <input
                  type="text"
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  placeholder="Masukkan keterangan"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #B0BEC5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
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
                  onChange={handleInputChange}
                  placeholder="Masukkan kapasitas"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #B0BEC5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
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
                  onChange={handleInputChange}
                  placeholder="Masukkan qty"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #B0BEC5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
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
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #B0BEC5',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                      appearance: 'none'
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
                    color: '#666'
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
                  onChange={handleInputChange}
                  placeholder="Masukkan harga final sebelum ppn"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #B0BEC5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

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
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6B9BD2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  minWidth: '100px'
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#00BFFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  minWidth: '100px'
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;

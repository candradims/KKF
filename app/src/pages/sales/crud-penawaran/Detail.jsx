import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const DetailPenawaran = ({ isOpen, onClose, detailData }) => {
  const [tabelPerhitungan, setTabelPerhitungan] = useState([
    {
      id: 1,
      jenisLayanan: '6 KVA (100 Ampere)',
      keterangan: 'Sumatera',
      kapasitas: 100,
      satuan: 'Mega',
      qty: 2,
      backbone: '-',
      port: '-',
      tarifAkses: '-',
      aksesExisting: '-',
      tarif: '-',
      akhirTahun: '-',
      akhirTahun2: '-',
      hargaDasar: '11.000.000',
      hargaFinal: '22.500.000'
    }
  ]);

  const [pengeluaranLain, setPengeluaranLain] = useState([
    { 
      id: 1, 
      item: 'Biaya Instalasi', 
      keterangan: 'Pemasangan kabel fiber optik', 
      hasrat: '1', 
      jumlah: '2', 
      total: '5.000.000' 
    },
    { 
      id: 2, 
      item: 'Biaya Maintenance', 
      keterangan: 'Pemeliharaan rutin perangkat', 
      hasrat: '12', 
      jumlah: '1', 
      total: '2.400.000' 
    },
    { 
      id: 3, 
      item: 'Biaya Training', 
      keterangan: 'Pelatihan operator', 
      hasrat: '1', 
      jumlah: '3', 
      total: '1.500.000' 
    },
    { 
      id: 4, 
      item: 'Biaya Dokumentasi', 
      keterangan: 'Pembuatan manual dan dokumentasi', 
      hasrat: '1', 
      jumlah: '1', 
      total: '800.000' 
    }
  ]);

  const totals = {
    totalBulan: '11.500.000',
    totalBulan2: '22.500.000',
    grandTotal12Bulan: '50.700.000',
    grandTotal12Bulan2: '95.500.000',
    discount: '-',
    totalPengeluaranLain: '9.700.000',
    grandTotalDisc: '41.000.000',
    grandTotalDisc2: '85.800.000',
    profitDariHJT: '20.400.000',
    marginDariHJT: '49.76%'
  };

  if (!isOpen) return null;

  const addTabelRow = () => {
    const newRow = {
      id: tabelPerhitungan.length + 1,
      jenisLayanan: '',
      keterangan: '',
      kapasitas: '',
      satuan: '',
      qty: '',
      backbone: '',
      port: '',
      tarifAkses: '',
      aksesExisting: '',
      tarif: '',
      akhirTahun: '',
      akhirTahun2: '',
      hargaDasar: '',
      hargaFinal: ''
    };
    setTabelPerhitungan([...tabelPerhitungan, newRow]);
  };

  const addPengeluaranRow = () => {
    const newRow = {
      id: pengeluaranLain.length + 1,
      item: '',
      keterangan: '',
      hasrat: '',
      jumlah: '',
      total: ''
    };
    setPengeluaranLain([...pengeluaranLain, newRow]);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '95%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8F9FA'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1F2937',
            margin: 0
          }}>
            Detail Data Penawaran
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6B7280',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Sales Field - Top Right */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Sales*</span>
              <input
                type="text"
                value="Sales Team"
                style={{
                  width: '200px',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {/* Left Column - Empty for spacing */}
            <div></div>

            {/* Right Column - Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '200px',
                  textAlign: 'left'
                }}>
                  Tanggal
                </label>
                <input
                  type="text"
                  value={detailData?.tanggal || '23/07/2025'}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '200px',
                  textAlign: 'left'
                }}>
                  Pelanggan
                </label>
                <input
                  type="text"
                  value={detailData?.namaPelanggan || 'Nama Pelanggan'}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '200px',
                  textAlign: 'left'
                }}>
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value="Pekerjaan"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '200px',
                  textAlign: 'left'
                }}>
                  Nomor Kontrak / BAKBB
                </label>
                <input
                  type="text"
                  value={detailData?.nomorKontrak || 'Nomor kontrak'}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '200px',
                  textAlign: 'left'
                }}>
                  Kontrak Tahun ke-
                </label>
                <input
                  type="text"
                  value={detailData?.kontrakKe || 'Kontrak tahun ke berapa'}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '200px',
                  textAlign: 'left'
                }}>
                  Referensi HJT
                </label>
                <input
                  type="text"
                  value={detailData?.referensi || 'HJT'}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '200px',
                  textAlign: 'left'
                }}>
                  Discount
                </label>
                <input
                  type="text"
                  value={detailData?.discount || '0%'}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '200px',
                  textAlign: 'left'
                }}>
                  Durasi Kontrak (n thn)
                </label>
                <input
                  type="text"
                  value={detailData?.durasi || 'Durasi kontrak (n thn)'}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '200px',
                  textAlign: 'left'
                }}>
                  Status
                </label>
                <input
                  type="text"
                  value={detailData?.status || 'Status'}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB',
                    fontWeight: '500',
                    color: detailData?.status === 'Disetujui' ? '#065F46' : 
                           detailData?.status === 'Menunggu' ? '#92400E' : 
                           detailData?.status === 'Ditolak' ? '#991B1B' : '#374151'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tabel Perhitungan */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px'
            }}>
              A. Tabel Perhitungan
            </h3>
            
            <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F3F4F6' }}>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Detail Layanan
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Detail Layanan
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Kapasitas
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Satuan
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      QTY
                    </th>
                    <th colSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Harga Sewa per Bulan
                    </th>
                    <th colSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Tarif Akses
                    </th>
                    <th colSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Tarif
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Harga Dasar
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Harga Final
                    </th>
                  </tr>
                  <tr style={{ backgroundColor: '#F3F4F6' }}>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Backbone</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Port</th>
                    <th style={  { padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Tarif Akses</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Akses Existing</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Tarif</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Akhir Tahun</th>
                  </tr>
                </thead>
                <tbody>
                  {tabelPerhitungan.map((row, index) => (
                    <tr key={row.id}>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.jenisLayanan}
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.keterangan}
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.kapasitas}
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.satuan}
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.qty}
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.backbone}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.port}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.tarifAkses}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.aksesExisting}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.tarif}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.akhirTahun}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>{row.hargaDasar}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>{row.hargaFinal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                backgroundColor: '#F9FAFB'
              }}>
                <table style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid #E5E7EB' }}>
                        Total / Bulan
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.totalBulan}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.totalBulan2}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid #E5E7EB' }}>
                        Grand Total 12 Bulan
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.grandTotal12Bulan}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.grandTotal12Bulan2}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid #E5E7EB' }}>
                        Discount
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.discount}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid #E5E7EB' }}>
                        Total Pengeluaran Lain-lain
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.totalPengeluaranLain}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid #E5E7EB' }}>
                        Grand Total - Disc / Lain2
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.grandTotalDisc}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.grandTotalDisc2}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid #E5E7EB' }}>
                        Profit dari HJT (excl.PPN)
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.profitDariHJT}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: '600' }}>
                        Margin dari HJT
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.marginDariHJT}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderLeft: '1px solid #E5E7EB' }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pengeluaran Lain-Lain */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '16px'
            }}>
              B. Pengeluaran Lain-Lain
            </h3>
            
            <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F3F4F6' }}>
                    <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Item ↓
                    </th>
                    <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Detail Layanan ↓
                    </th>
                    <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Hasrat ↓
                    </th>
                    <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Jumlah ↓
                    </th>
                    <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Total (RP) ↓
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pengeluaranLain.map((row, index) => (
                    <tr key={row.id}>
                      <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.item}
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.keterangan}
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>
                        {row.hasrat}
                      </td>
                      <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>
                        {row.jumlah}
                      </td>
                      <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>
                        {row.total}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#F3F4F6', fontWeight: '600' }}>
                    <td colSpan="4" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>
                      <strong>Total Pengeluaran Lain-lain:</strong>
                    </td>
                    <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>
                      <strong>9.700.000</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid #E5E7EB'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Tutup
            </button>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#00AEEF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
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

export default DetailPenawaran; 
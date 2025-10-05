import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { pengeluaranAPI, getUserData, getAuthHeaders } from '../../../utils/api';

// Helper function untuk konversi diskon
const convertDiscountToPercentage = (discount) => {
  // Handle null, undefined, atau empty values
  if (!discount) {
    return '0%';
  }
  
  // Convert to string if not already
  const discountStr = String(discount);
  
  if (discountStr === 'MB Niaga') {
    return '10%';
  } else if (discountStr === 'GM SBU') {
    return '20%';
  }
  
  // Pastikan selalu ada tanda % jika berupa angka
  if (discountStr && !discountStr.includes('%') && !isNaN(discountStr)) {
    return discountStr + '%';
  }
  
  return discountStr || '0%';
};

const DetailPenawaran = ({ isOpen, onClose, detailData, refreshTrigger }) => {
  const [tabelPerhitungan, setTabelPerhitungan] = useState([]);

  const [pengeluaranLain, setPengeluaranLain] = useState([]);
  const [fullDetailData, setFullDetailData] = useState(null);

  // Fetch full detail data including catatan
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
          const layananTableData = result.data.data_penawaran_layanan.map((item, index) => {
            // Get Harga Dasar from database (already calculated and saved)
            const hargaDasarValue = parseFloat(item.harga_dasar_icon) || 0;
            console.log(`� Harga Dasar from database for ${item.nama_layanan}:`, hargaDasarValue);

            return {
              id: item.id_penawaran_layanan || index + 1,
              jenisLayanan: item.nama_layanan || item.data_layanan?.nama_layanan || '-',
              keterangan: item.detail_layanan || '-',
              kapasitas: item.kapasitas || '-',
              satuan: item.satuan || '-',
              qty: item.qty || '-',
              backbone: item.backbone || '-',
              port: item.port || '-',
              tarifAkses: item.tarif_akses || '-',
              aksesExisting: item.akses_existing || '-',
              tarifBaru: item.tarif || '-', // Kolom tarif baru setelah Akses Existing
              tarifAksesNTahun: (item.akses_existing === 'ya' || !item.tarif_akses_terbaru) ? '-' : `Rp ${parseInt(item.tarif_akses_terbaru).toLocaleString('id-ID')}`, // Kolom tarif akses (n tahun) dengan diskon, null jika akses existing = ya
              akhirTahun: item.tarif_terbaru ? `Rp ${parseInt(item.tarif_terbaru).toLocaleString('id-ID')}` : '-', // Tarif (n tahun) dengan diskon
              hargaDasar: hargaDasarValue > 0 ? `Rp ${hargaDasarValue.toLocaleString('id-ID')}` : '-',
              hargaFinal: (() => {
                const hargaFinalValue = parseFloat(item.harga_final_sebelum_ppn) || 0;
                console.log(`💰 Harga Final from database for ${item.nama_layanan}:`, hargaFinalValue);
                return hargaFinalValue > 0 ? `Rp ${hargaFinalValue.toLocaleString('id-ID')}` : '-';
              })(), // Display calculated harga final from database
              marginPercent: item.margin_percent || '-' // Margin per layanan item
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
  const [loadingPengeluaran, setLoadingPengeluaran] = useState(false);
  const [errorPengeluaran, setErrorPengeluaran] = useState(null);

  // Function to load pengeluaran data (extracted for reusability)
  const loadPengeluaranData = async () => {
    // Check for id_penawaran in detailData or rawData
    const penawaranId = detailData?.id_penawaran || detailData?.id || detailData?.rawData?.id_penawaran;
    
    console.log('🔍 Looking for penawaran ID in:', {
      'detailData?.id_penawaran': detailData?.id_penawaran,
      'detailData?.id': detailData?.id,
      'detailData?.rawData?.id_penawaran': detailData?.rawData?.id_penawaran,
      'final penawaranId': penawaranId
    });
    
    if (!penawaranId) {
      console.log('❌ No penawaran ID found in detailData:', detailData);
      setErrorPengeluaran('ID Penawaran tidak ditemukan');
      return;
    }
    
    try {
      setLoadingPengeluaran(true);
      setErrorPengeluaran(null);
      console.log('Loading pengeluaran for penawaran ID:', penawaranId);
      console.log('DetailData structure:', detailData);
      
      // Get auth data using utility function
      const userData = getUserData();
      if (!userData) {
        setErrorPengeluaran('Data autentikasi tidak ditemukan. Silakan login kembali.');
        return;
      }
      
      console.log('User data:', userData);
      
      // Get auth headers using utility function
      let headers;
      try {
        headers = getAuthHeaders();
        console.log('Auth headers:', headers);
      } catch (authError) {
        console.error('Error getting auth headers:', authError);
        setErrorPengeluaran('Gagal mendapatkan data autentikasi. Silakan login kembali.');
        return;
      }
      
      // Using the existing API endpoint for pengeluaran by penawaran ID
      const url = `http://localhost:3000/api/pengeluaran/penawaran/${penawaranId}`;
      console.log('📡 Making request to:', url);
      console.log('📡 With headers:', headers);
      
      const response = await fetch(url, {
        headers: headers
      });
      
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Response result:', result);
        if (result.success) {
          const formattedData = result.data.map(item => ({
            id: item.id_pengeluaran,
            item: item.item,
            keterangan: item.keterangan,
            hasrat: item.harga_satuan?.toString() || '0',
            jumlah: item.jumlah?.toString() || '0',
            total: (item.total_harga || 0).toLocaleString('id-ID')
          }));
          setPengeluaranLain(formattedData);
          console.log('Pengeluaran data loaded:', formattedData);
          setErrorPengeluaran(null);
        } else {
          setErrorPengeluaran(result.message || 'Gagal memuat data pengeluaran');
        }
      } else {
        const errorResult = await response.text();
        console.error('Failed to load pengeluaran data. Status:', response.status, 'Response:', errorResult);
        
        // Try to parse error response as JSON
        let errorMessage = `Gagal memuat data (Status: ${response.status})`;
        try {
          const errorJson = JSON.parse(errorResult);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          }
        } catch (parseError) {
          // If not JSON, use the text response
          if (errorResult) {
            errorMessage = `${errorMessage} - ${errorResult}`;
          }
        }
        
        setErrorPengeluaran(errorMessage);
      }
    } catch (error) {
      console.error('Error loading pengeluaran data:', error);
      setErrorPengeluaran('Terjadi kesalahan saat memuat data pengeluaran');
    } finally {
      setLoadingPengeluaran(false);
    }
  };

  // Load data pengeluaran lain-lain berdasarkan id_penawaran
  useEffect(() => {
    if (isOpen && detailData) {
      loadPengeluaranData();
      loadFullDetailData(); // Load full detail data when component opens
    } else if (!isOpen) {
      // Clear data when modal closes to ensure fresh data on next open
      setPengeluaranLain([]);
    }
  }, [isOpen, detailData]);

  // Refresh data when refreshTrigger changes
  useEffect(() => {
    if (isOpen && detailData && refreshTrigger) {
      console.log('🔄 Refresh triggered from parent component, refreshTrigger:', refreshTrigger);
      loadPengeluaranData();
    }
  }, [refreshTrigger]);

  const [pengeluaranLainBackup] = useState([
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

  // Calculate totals dynamically
  const calculateTotalPengeluaranLain = () => {
    return pengeluaranLain.reduce((total, item) => {
      const itemTotal = parseFloat(item.total.replace(/[^\d]/g, '') || 0);
      return total + itemTotal;
    }, 0);
  };

  const totals = {
    totalBulan: '11.500.000',
    totalBulan2: '22.500.000',
    grandTotal12Bulan: '50.700.000',
    grandTotal12Bulan2: '95.500.000',
    discount: '-',
    totalPengeluaranLain: `Rp ${calculateTotalPengeluaranLain().toLocaleString('id-ID')}`,
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
      tarifBaru: '', // Kolom tarif baru
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
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
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
                value={detailData?.rawData?.sales || detailData?.sales || detailData?.namaSales || '-'}
                style={{
                  width: '200px',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#F9FAFB'
                }}
                readOnly
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
                  value={convertDiscountToPercentage(detailData?.discount)}
                  readOnly
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
                  Durasi Kontrak (in thn)
                </label>
                <input
                  type="text"
                  value={detailData?.durasi || 'Durasi kontrak (in thn)'}
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
              
              {((fullDetailData?.catatan || detailData?.catatan) || (fullDetailData?.status === 'Ditolak' || detailData?.status === 'Ditolak')) && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    minWidth: '200px',
                    textAlign: 'left'
                  }}>
                    Catatan
                  </label>
                  <textarea
                    value={fullDetailData?.catatan || detailData?.catatan || 'Tidak ada catatan'}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#F9FAFB',
                      color: '#374151',
                      resize: 'none',
                      minHeight: '60px'
                    }}
                  />
                </div>
              )}
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
                      Nama Layanan
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
                    <th colSpan="7" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Harga Sewa per Bulan
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Harga Dasar
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Harga Final
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Margin %
                    </th>
                  </tr>
                  <tr style={{ backgroundColor: '#F3F4F6' }}>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Backbone</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Port</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Tarif Akses</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Akses Existing</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Tarif</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Tarif Akses (n tahun)</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '10px', fontWeight: '600' }}>Tarif (n tahun)</th>
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
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.tarifBaru}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.tarifAksesNTahun}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.akhirTahun}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>{row.hargaDasar}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>{row.hargaFinal}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>
                        {row.marginPercent ? `${row.marginPercent}%` : '-'}
                      </td>
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
                  {loadingPengeluaran ? (
                    <tr>
                      <td colSpan="5" style={{ 
                        padding: '20px', 
                        textAlign: 'center', 
                        fontSize: '14px', 
                        color: '#666' 
                      }}>
                        Memuat data pengeluaran...
                      </td>
                    </tr>
                  ) : errorPengeluaran ? (
                    <tr>
                      <td colSpan="5" style={{ 
                        padding: '20px', 
                        textAlign: 'center', 
                        fontSize: '14px', 
                        color: '#DC2626' 
                      }}>
                        Error: {errorPengeluaran}
                        <br />
                        <button 
                          onClick={loadPengeluaranData}
                          style={{
                            marginTop: '8px',
                            padding: '4px 12px',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Coba Lagi
                        </button>
                      </td>
                    </tr>
                  ) : pengeluaranLain.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ 
                        padding: '20px', 
                        textAlign: 'center', 
                        fontSize: '14px', 
                        color: '#666' 
                      }}>
                        Tidak ada data pengeluaran lain-lain
                      </td>
                    </tr>
                  ) : (
                    pengeluaranLain.map((row, index) => (
                      <tr key={row.id}>
                        <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                          {row.item}
                        </td>
                        <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                          {row.keterangan}
                        </td>
                        <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>
                          {parseFloat(row.hasrat || 0).toLocaleString('id-ID')}
                        </td>
                        <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>
                          {row.jumlah}
                        </td>
                        <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>
                          Rp {row.total}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr style={{ backgroundColor: '#F3F4F6', fontWeight: '600' }}>
                    <td colSpan="4" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>
                      <strong>Total Pengeluaran Lain-lain:</strong>
                    </td>
                    <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>
                      <strong>Rp {pengeluaranLain.reduce((total, item) => total + parseFloat(item.total.replace(/[^\d]/g, '') || 0), 0).toLocaleString('id-ID')}</strong>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPenawaran; 
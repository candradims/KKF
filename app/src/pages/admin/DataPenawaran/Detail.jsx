import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { getUserData, getAuthHeaders } from '../../../utils/api';

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

const DetailPenawaran = ({ isOpen, onClose, detailData }) => {
  const [tabelPerhitungan, setTabelPerhitungan] = useState([]);

  const [pengeluaranLain, setPengeluaranLain] = useState([]);
  const [fullDetailData, setFullDetailData] = useState(null);
  const [hasilPenawaranData, setHasilPenawaranData] = useState(null);

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
              backbone: item.backbone || '-', // Data dari database
              port: item.port || '-', // Data dari database
              tarifAkses: item.tarif_akses || '-', // Data dari database
              aksesExisting: item.akses_existing || '-',
              tarifBaru: item.tarif || '-', // Data tarif dari database
              tarifAksesNTahun: (item.akses_existing === 'ya' || !item.tarif_akses_terbaru) ? '-' : `Rp ${parseInt(item.tarif_akses_terbaru).toLocaleString('id-ID')}`, // Kolom tarif akses (n tahun) dengan diskon, null jika akses existing = ya
              tarif: item.tarif_n_tahun || '-', // Data tarif (n tahun) dari database
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

  // Calculate totals dynamically
  const calculateTotalPengeluaranLain = () => {
    return pengeluaranLain.reduce((total, item) => {
      const itemTotal = parseFloat((item.total_harga || 0));
      return total + itemTotal;
    }, 0);
  };

  // Function to load hasil penawaran data
  const loadHasilPenawaranData = async () => {
    const penawaranId = detailData?.id_penawaran || detailData?.id || detailData?.rawData?.id_penawaran;
    
    if (!penawaranId) {
      console.log('❌ No penawaran ID found for hasil penawaran');
      return;
    }
    
    try {
      console.log('📊 Loading hasil penawaran for ID:', penawaranId);
      
      const userData = getUserData();
      if (!userData) {
        console.error('❌ No user data found for hasil penawaran');
        return;
      }
      
      const headers = getAuthHeaders();
      
      // Try to get existing hasil penawaran first
      let response = await fetch(`http://localhost:3000/api/penawaran/${penawaranId}/hasil`, {
        method: 'GET',
        headers: headers
      });
      
      // If no existing hasil found, calculate it
      let needsRecalculation = false;
      if (!response.ok && response.status === 404) {
        console.log('🔢 No existing hasil found, calculating...');
        needsRecalculation = true;
      } else if (response.ok) {
        // Check if existing data has discount calculated
        const tempResult = await response.json();
        if (tempResult.success && tempResult.data) {
          setHasilPenawaranData(tempResult.data);
          // Force recalculation if discount is missing or 0
          if (!tempResult.data.discount || tempResult.data.discount === 0) {
            console.log('🔢 Discount missing or 0, forcing recalculation...');
            needsRecalculation = true;
          }
        }
      }
      
      if (needsRecalculation) {
        response = await fetch(`http://localhost:3000/api/penawaran/${penawaranId}/calculate`, {
          method: 'POST',
          headers: headers
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Hasil penawaran recalculated and loaded:', result);
          if (result.success && result.data) {
            setHasilPenawaranData(result.data);
          }
        } else {
          console.error('❌ Failed to recalculate hasil penawaran:', response.status);
        }
      }

    } catch (error) {
      console.error('❌ Error loading hasil penawaran:', error);
    }
  };

  // Calculate totals dynamically from real data
  const calculateTotals = () => {
    // Ensure tabelPerhitungan is available and is an array
    if (!tabelPerhitungan || !Array.isArray(tabelPerhitungan)) {
      console.log('⚠️ tabelPerhitungan not available yet, using fallback values');
      return {
        totalBulan: '0',
        totalBulan2: '0',
        grandTotal12Bulan: '0',
        grandTotal12Bulan2: '0',
        discount: '-',
        totalPengeluaranLain: `Rp ${calculateTotalPengeluaranLain().toLocaleString('id-ID')}`,
        grandTotalDisc: '0',
        grandTotalDisc2: '0',
        profitDariHJT: '0',
        marginDariHJT: '0.00%'
      };
    }

    // Calculate Total/Bulan from tabelPerhitungan data
    const totalHargaDasar = tabelPerhitungan.reduce((total, item) => {
      // Remove "Rp" and other non-digit characters, then parse
      const hargaDasarStr = item.hargaDasar || '';
      const hargaDasarValue = parseFloat(hargaDasarStr.replace(/[^\d]/g, '') || 0);
      return total + hargaDasarValue;
    }, 0);
    
    const totalHargaFinal = tabelPerhitungan.reduce((total, item) => {
      // Remove "Rp" and other non-digit characters, then parse
      const hargaFinalStr = item.hargaFinal || '';
      const hargaFinalValue = parseFloat(hargaFinalStr.replace(/[^\d]/g, '') || 0);
      return total + hargaFinalValue;
    }, 0);
    
    // Use hasil penawaran data if available, otherwise use calculated values
    const totalBulanHargaDasar = hasilPenawaranData?.total_per_bulan_harga_dasar_icon || totalHargaDasar;
    const totalBulanHargaFinal = hasilPenawaranData?.total_per_bulan_harga_final_sebelum_ppn || totalHargaFinal;
    
    // Use Grand Total 12 Bulan from database if available, otherwise calculate as fallback
    const grandTotal12BulanHargaDasar = hasilPenawaranData?.grand_total_12_bulan_harga_dasar_icon || (totalBulanHargaDasar * 12);
    const grandTotal12BulanHargaFinal = hasilPenawaranData?.grand_total_12_bulan_harga_final_sebelum_ppn || (totalBulanHargaFinal * 12);
    
    console.log('📊 Admin - Grand Total 12 Bulan values:', {
      fromDatabase: {
        hargaDasar: hasilPenawaranData?.grand_total_12_bulan_harga_dasar_icon,
        hargaFinal: hasilPenawaranData?.grand_total_12_bulan_harga_final_sebelum_ppn
      },
      calculated: {
        hargaDasar: totalBulanHargaDasar * 12,
        hargaFinal: totalBulanHargaFinal * 12
      },
      used: {
        grandTotal12BulanHargaDasar,
        grandTotal12BulanHargaFinal
      }
    });
    
    // Use discount amount from database if available, otherwise calculate
    const discountPercent = parseFloat(detailData?.discount || 0);
    const discountAmountFromDB = hasilPenawaranData?.discount;
    const discountAmount = discountAmountFromDB || (grandTotal12BulanHargaDasar * discountPercent) / 100;
    
    console.log('[Admin Detail] Discount calculation:');
    console.log('  - Discount percent:', discountPercent);
    console.log('  - Grand Total 12 Bulan Harga Dasar:', grandTotal12BulanHargaDasar);
    console.log('  - Discount from database:', discountAmountFromDB);
    console.log('  - Final discount amount:', discountAmount);
    
    // Calculate total pengeluaran
    const totalPengeluaranLain = calculateTotalPengeluaranLain();
    
    // Calculate grand total after discount and pengeluaran
    const grandTotalDiscHargaDasar = grandTotal12BulanHargaDasar - discountAmount - totalPengeluaranLain;
    const grandTotalDiscHargaFinal = grandTotal12BulanHargaFinal - discountAmount - totalPengeluaranLain;
    
    // Calculate profit and margin
    const profitDariHJT = grandTotalDiscHargaFinal - grandTotalDiscHargaDasar;
    const marginDariHJT = grandTotalDiscHargaDasar > 0 ? (profitDariHJT / grandTotalDiscHargaDasar) * 100 : 0;
    
    return {
      totalBulan: totalBulanHargaDasar.toLocaleString('id-ID'),
      totalBulan2: totalBulanHargaFinal.toLocaleString('id-ID'),
      grandTotal12Bulan: grandTotal12BulanHargaDasar.toLocaleString('id-ID'),
      grandTotal12Bulan2: grandTotal12BulanHargaFinal.toLocaleString('id-ID'),
      discount: discountPercent > 0 ? `${discountPercent}%` : '-',
      discountAmount: discountAmount > 0 ? `Rp ${discountAmount.toLocaleString('id-ID')}` : '-',
      totalPengeluaranLain: `Rp ${totalPengeluaranLain.toLocaleString('id-ID')}`,
      grandTotalDisc: grandTotalDiscHargaDasar.toLocaleString('id-ID'),
      grandTotalDisc2: grandTotalDiscHargaFinal.toLocaleString('id-ID'),
      profitDariHJT: profitDariHJT.toLocaleString('id-ID'),
      marginDariHJT: `${marginDariHJT.toFixed(2)}%`
    };
  };
  
  const totals = calculateTotals();

  const loadPengeluaranData = async () => {
    if (!detailData?.id) return;
    
    console.log("🔍 Admin Detail - detailData received:", detailData);
    console.log("🔍 Admin Detail - rawData:", detailData?.rawData);
    console.log("🔍 Admin Detail - data_user:", detailData?.rawData?.data_user);
    
    setLoadingPengeluaran(true);
    setErrorPengeluaran(null);
    
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`http://localhost:3000/api/pengeluaran/penawaran/${detailData.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setPengeluaranLain(data.data);
      } else {
        setPengeluaranLain([]);
      }
    } catch (error) {
      console.error('Error loading pengeluaran data:', error);
      setErrorPengeluaran(error.message);
      setPengeluaranLain([]);
    } finally {
      setLoadingPengeluaran(false);
    }
  };

  useEffect(() => {
    loadPengeluaranData();
    loadFullDetailData(); // Load full detail data when component opens
    loadHasilPenawaranData(); // Load hasil penawaran data
  }, [detailData?.id_penawaran]); // Use id_penawaran instead of id

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
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Sales</span>
              <input
                type="text"
                value={detailData?.rawData?.data_user?.nama_user || detailData?.namaSales || detailData?.sales || 'Data sales tidak tersedia'}
                readOnly
                style={{
                  width: '200px',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#F9FAFB'
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
                  value={detailData?.tanggal || '-'}
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
                  Pelanggan
                </label>
                <input
                  type="text"
                  value={detailData?.namaPelanggan || '-'}
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
                  Nomor Kontrak / BAKBB
                </label>
                <input
                  type="text"
                  value={detailData?.nomorKontrak || '-'}
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
                  Kontrak Tahun ke-
                </label>
                <input
                  type="text"
                  value={detailData?.kontrakKe || '-'}
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
                  Referensi HJT
                </label>
                <input
                  type="text"
                  value={detailData?.referensi || '-'}
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
                  value={detailData?.durasi || '-'}
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
                  Status
                </label>
                <input
                  type="text"
                  value={detailData?.status || '-'}
                  readOnly
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
                      Detail Layanan
                    </th>
                    <th rowSpan="2" style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                      Keterangan
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
                          readOnly
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.keterangan}
                          readOnly
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.kapasitas}
                          readOnly
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.satuan}
                          readOnly
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                        <input
                          type="text"
                          value={row.qty}
                          readOnly
                          style={{ width: '100%', border: 'none', fontSize: '12px', backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.backbone}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.port}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.tarifAkses}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.aksesExisting}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.tarifBaru}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.tarifAksesNTahun}</td>
                      <td style={{ padding: '8px 6px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>{row.tarif}</td>
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
                        Discount ({totals.discount})
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                        {totals.discountAmount}
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
            
            {loadingPengeluaran ? (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px',
                backgroundColor: '#F9FAFB' 
              }}>
                <span style={{ color: '#6B7280' }}>Memuat data pengeluaran...</span>
              </div>
            ) : errorPengeluaran ? (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                border: '1px solid #F87171', 
                borderRadius: '8px',
                backgroundColor: '#FEF2F2' 
              }}>
                <span style={{ color: '#DC2626' }}>Error: {errorPengeluaran}</span>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F3F4F6' }}>
                      <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                        Item
                      </th>
                      <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                        Keterangan
                      </th>
                      <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                        Harga Satuan
                      </th>
                      <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                        Jumlah
                      </th>
                      <th style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600' }}>
                        Total (RP)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengeluaranLain && pengeluaranLain.length > 0 ? (
                      pengeluaranLain.map((row, index) => (
                        <tr key={row.id_pengeluaran || index}>
                          <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                            {row.item || '-'}
                          </td>
                          <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                            {row.keterangan || '-'}
                          </td>
                          <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>
                            {row.harga_satuan ? `Rp ${Number(row.harga_satuan).toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'center' }}>
                            {row.jumlah || '-'}
                          </td>
                          <td style={{ padding: '12px 8px', border: '1px solid #E5E7EB', fontSize: '12px', textAlign: 'right' }}>
                            {row.total_harga ? `Rp ${Number(row.total_harga).toLocaleString('id-ID')}` : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#6B7280' }}>
                          Tidak ada data pengeluaran lain-lain
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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

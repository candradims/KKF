import React, { useState, useEffect } from 'react';
import { Eye, Plus, RotateCcw, Download, Filter, Calendar, Check, X, MapPin } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Detail from './crud-penawaran/Detail';
import { penawaranAPI, getUserData } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function untuk konversi diskon
const convertDiscountToPercentage = (discount) => {
  // Handle null, undefined, atau empty values
  if (!discount && discount !== 0) {
    return '0%';
  }
  
  // Convert numeric discount to display format
  const numericValue = parseFloat(discount);
  
  if (numericValue === 10) {
    return '10% (MB Niaga)';
  } else if (numericValue === 20) {
    return '20% (GM SBU)';
  } else if (numericValue === 0) {
    return '0%';
  }
  
  // For any other numeric value, show as percentage
  return numericValue + '%';
};

const Penawaran = () => {
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State untuk data dari API
  const [penawaranData, setPenawaranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State baru untuk modal sukses ekspor
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);

  // Color palette
  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
    light: '#cbebea',
    white: '#ffffff',
    gray50: '#f8fafc',
    gray100: '#f1f5f9',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
    gray500: '#64748b',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1e293b',
    gray900: '#0f172a'
  };

  // Fetch data penawaran dari API
  const fetchPenawaranData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const userData = getUserData();
      if (!userData) {
        throw new Error('User tidak terautentikasi. Silakan login kembali.');
      }
      
      console.log("📋 Fetching penawaran data for user:", userData.email_user);

      const result = await penawaranAPI.getAll();
      
      if (result.success) {
        // Transform data dari API ke format yang digunakan di frontend
        const transformedData = result.data.map(item => {
          try {
            return {
              id: item.id_penawaran,
              id_penawaran: item.id_penawaran,
              tanggal: new Date(item.tanggal_dibuat).toLocaleDateString('id-ID'),
              namaPelanggan: item.nama_pelanggan,
              lokasiPelanggan: item.lokasi_pelanggan || '-',
              namaSales: item.data_user?.nama_user || "-",
              sales: item.data_user?.nama_user || "-",
              nomorKontrak: item.nomor_kontrak,
              kontrakKe: item.kontrak_tahun,
              referensi: item.wilayah_hjt,
              discount: convertDiscountToPercentage(item.diskon),
              durasi: item.durasi_kontrak,
              targetIRR: item.target_irr || '0',
              status: item.status || 'Menunggu',
              actions: ['view'],
              rawData: item
            };
          } catch (itemError) {
            console.error('❌ Error transforming item:', item, itemError);
            return {
              id: item.id_penawaran || 'unknown',
              id_penawaran: item.id_penawaran || 'unknown',
              tanggal: '-',
              namaPelanggan: item.nama_pelanggan || '-',
              lokasiPelanggan: item.lokasi_pelanggan || '-',
              namaSales: '-',
              sales: '-',
              nomorKontrak: item.nomor_kontrak || '-',
              kontrakKe: item.kontrak_tahun || '-',
              referensi: item.wilayah_hjt || '-',
              discount: '0%',
              durasi: item.durasi_kontrak || '-',
              targetIRR: '0',
              status: 'Error',
              actions: ['view'],
              rawData: item
            };
          }
        });
        
        setPenawaranData(transformedData);
        setError(null);
        console.log("✅ Penawaran data fetched successfully:", transformedData.length, "records");
      } else {
        throw new Error(result.message || 'Gagal mengambil data penawaran');
      }
    } catch (err) {
      console.error('❌ Error fetching penawaran data:', err);
      setError(err.message);
      setPenawaranData([]);
      
      if (err.message.includes('terautentikasi') || err.message.includes('authentication')) {
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPenawaranData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = penawaranData.filter(item => {
    const matchesDate = filterDate ? item.tanggal.includes(filterDate) : true;
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesDate && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDetailData = (item) => {
    setSelectedDetailData(item);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedDetailData(null);
  };

  const triggerDetailRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Fungsi untuk menutup modal sukses ekspor
  const handleCloseExportSuccessModal = () => {
    setShowExportSuccessModal(false);
  };

  const handleExportPDF = async () => {
    try {
      console.log('Starting comprehensive PDF export...');
      console.log('Filtered data:', filteredData);
      
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString('id-ID');
      
      // Process each penawaran data
      for (let dataIndex = 0; dataIndex < filteredData.length; dataIndex++) {
        const item = filteredData[dataIndex];
        
        // Add new page for each penawaran except the first one
        if (dataIndex > 0) {
          doc.addPage();
        }
        
        let yPosition = 20;
        
        // Header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(3, 91, 113); // Primary color
        doc.text('DETAIL DATA PENAWARAN', doc.internal.pageSize.width / 2, yPosition, { align: 'center' });
        
        yPosition += 10;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Tanggal Export: ${currentDate}`, doc.internal.pageSize.width / 2, yPosition, { align: 'center' });
        
        yPosition += 15;
        
        // Basic Information Section
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Informasi Dasar', 14, yPosition);
        yPosition += 7;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        const basicInfo = [
          ['Tanggal', `: ${item.tanggal || '-'}`],
          ['Nama Pelanggan', `: ${item.namaPelanggan || '-'}`],
          ['Lokasi Pelanggan', `: ${item.lokasiPelanggan || '-'}`],
          ['Nomor Kontrak/BAKB', `: ${item.nomorKontrak || '-'}`],
          ['Kontrak Tahun ke-', `: ${item.kontrakKe || '-'}`],
          ['Referensi HJT', `: ${item.referensi || '-'}`],
          ['Discount', `: ${convertDiscountToPercentage(item.discount)}`],
          ['Durasi Kontrak', `: ${item.durasi || '-'} tahun`],
          ['Status', `: ${item.status || '-'}`]
        ];
        
        basicInfo.forEach(([label, value]) => {
          doc.setFont('helvetica', 'bold');
          doc.text(label, 14, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(value, 70, yPosition);
          yPosition += 6;
        });
        
        yPosition += 5;
        
        // Fetch detailed data for this penawaran
        try {
          console.log(`📥 Fetching details for penawaran ID: ${item.id_penawaran}`);
          
          // Fetch full detail using direct fetch (same as Detail.jsx)
          const userData = getUserData();
          const detailResponse = await fetch(`http://localhost:3000/api/penawaran/${item.id_penawaran}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-User-ID': userData.id_user.toString(),
              'X-User-Role': userData.role_user,
              'X-User-Email': userData.email_user
            }
          });
          
          if (!detailResponse.ok) {
            throw new Error(`HTTP error! status: ${detailResponse.status}`);
          }
          
          const detailResult = await detailResponse.json();
          console.log('📊 Detail Response:', detailResult);
          console.log('📊 Data Penawaran Layanan:', detailResult?.data?.data_penawaran_layanan);
          
          const hasilResponse = await penawaranAPI.getHasil(item.id_penawaran);
          console.log('💰 Hasil Response:', hasilResponse);
          
          // Fetch pengeluaran data using direct fetch with proper auth headers
          let pengeluaranData = [];
          try {
            const userData = getUserData();
            if (userData) {
              const response = await fetch(`http://localhost:3000/api/pengeluaran/penawaran/${item.id_penawaran}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'X-User-ID': userData.id_user.toString(),
                  'X-User-Role': userData.role_user,
                  'X-User-Email': userData.email_user
                }
              });
              
              console.log('📦 Pengeluaran Response Status:', response.status);
              
              if (response.ok) {
                const pengeluaranResponse = await response.json();
                console.log('📦 Pengeluaran Response:', pengeluaranResponse);
                
                if (pengeluaranResponse.success && pengeluaranResponse.data) {
                  pengeluaranData = pengeluaranResponse.data;
                  console.log('✅ Pengeluaran Data Count:', pengeluaranData.length);
                }
              } else {
                console.error('❌ Pengeluaran fetch failed with status:', response.status);
              }
            }
          } catch (pengeluaranError) {
            console.error('❌ Error fetching pengeluaran:', pengeluaranError);
          }
          
          console.log('📋 Final Pengeluaran Data:', pengeluaranData);
          
          // A. Tabel Perhitungan Section
          console.log('🔍 Checking Tabel Perhitungan conditions...');
          console.log('- detailResult.success:', detailResult?.success);
          console.log('- detailResult.data:', detailResult?.data);
          console.log('- data_penawaran_layanan:', detailResult?.data?.data_penawaran_layanan);
          console.log('- data_penawaran_layanan length:', detailResult?.data?.data_penawaran_layanan?.length);
          
          if (detailResult && detailResult.success && detailResult.data) {
            const layananData = detailResult.data.data_penawaran_layanan || [];
            
            console.log('📊 Layanan Data:', layananData);
            console.log('📊 Layanan Data Length:', layananData.length);
            
            if (layananData && layananData.length > 0) {
              console.log('✅ Rendering Tabel Perhitungan...');
              
              doc.setFontSize(12);
              doc.setFont('helvetica', 'bold');
              doc.text('A. Tabel Perhitungan', 14, yPosition);
              yPosition += 5;
              
              const perhitunganData = layananData.map((layanan, idx) => {
                console.log(`Processing layanan ${idx}:`, layanan);
                const hargaDasar = parseFloat(layanan.harga_dasar_icon) || 0;
                const hargaFinal = parseFloat(layanan.harga_final_sebelum_ppn) || 0;
                
                return [
                  layanan.nama_layanan || '-',
                  layanan.detail_layanan || '-',
                  layanan.kapasitas || '-',
                  layanan.satuan || '-',
                  layanan.qty || '-',
                  `Rp ${hargaDasar.toLocaleString('id-ID')}`,
                  `Rp ${hargaFinal.toLocaleString('id-ID')}`
                ];
              });
              
              console.log('📋 Perhitungan Table Data:', perhitunganData);
              
              autoTable(doc, {
                head: [['Nama Layanan', 'Detail', 'Kapasitas', 'Satuan', 'QTY', 'Harga Dasar', 'Harga Final']],
                body: perhitunganData,
                startY: yPosition,
                margin: { left: 14, right: 14 },
                styles: {
                  fontSize: 7,
                  cellPadding: 2
                },
                headStyles: {
                  fillColor: [3, 91, 113],
                  textColor: [255, 255, 255],
                  fontStyle: 'bold'
                },
                columnStyles: {
                  0: { cellWidth: 30 },
                  1: { cellWidth: 35 },
                  2: { cellWidth: 20 },
                  3: { cellWidth: 20 },
                  4: { cellWidth: 15 },
                  5: { cellWidth: 28 },
                  6: { cellWidth: 28 }
                }
              });
              
              yPosition = doc.lastAutoTable.finalY + 10;
              console.log('✅ Tabel Perhitungan rendered successfully');
            } else {
              console.log('⚠️ No layanan data found');
            }
          } else {
            console.log('❌ Detail response invalid:', {
              hasResult: !!detailResult,
              success: detailResult?.success,
              hasData: !!detailResult?.data
            });
          }
          
          // B. Pengeluaran Lain-Lain Section
          console.log('🔍 Checking Pengeluaran Lain-Lain conditions...');
          console.log('- pengeluaranData:', pengeluaranData);
          console.log('- pengeluaranData length:', pengeluaranData?.length);
          
          if (pengeluaranData && pengeluaranData.length > 0) {
            console.log('✅ Rendering Pengeluaran Lain-Lain...');
            
            // Check if we need a new page
            if (yPosition > 200) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('B. Pengeluaran Lain-Lain', 14, yPosition);
            yPosition += 5;
            
            const pengeluaranTableData = pengeluaranData.map((item, idx) => {
              console.log(`Processing pengeluaran ${idx}:`, item);
              console.log(`  - item: ${item.item}`);
              console.log(`  - keterangan: ${item.keterangan}`);
              console.log(`  - harga_satuan: ${item.harga_satuan}`);
              console.log(`  - jumlah: ${item.jumlah}`);
              console.log(`  - total_harga: ${item.total_harga}`);
              
              const hargaSatuan = parseFloat(item.harga_satuan) || 0;
              const jumlah = parseInt(item.jumlah) || 0;
              const totalHarga = parseFloat(item.total_harga) || 0;
              
              return [
                item.item || '-',
                item.keterangan || '-',
                `Rp ${hargaSatuan.toLocaleString('id-ID')}`,
                jumlah.toLocaleString('id-ID'),
                `Rp ${totalHarga.toLocaleString('id-ID')}`
              ];
            });
            
            console.log('📋 Pengeluaran Table Data:', pengeluaranTableData);
            
            autoTable(doc, {
              head: [['Item', 'Keterangan', 'Harga Satuan (Rp)', 'Jumlah', 'Total (Rp)']],
              body: pengeluaranTableData,
              startY: yPosition,
              margin: { left: 14, right: 14 },
              styles: {
                fontSize: 7,
                cellPadding: 2
              },
              headStyles: {
                fillColor: [3, 91, 113],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
              },
              columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 50 },
                2: { cellWidth: 30, halign: 'right' },
                3: { cellWidth: 20, halign: 'right' },
                4: { cellWidth: 35, halign: 'right' }
              }
            });
            
            yPosition = doc.lastAutoTable.finalY + 10;
            console.log('✅ Pengeluaran Lain-Lain rendered successfully');
          } else {
            console.log('⚠️ No pengeluaran data found or empty array');
          }
          
          // Hasil Perhitungan / Summary Section
          if (hasilResponse.success && hasilResponse.data) {
            // Check if we need a new page
            if (yPosition > 220) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Ringkasan Perhitungan', 14, yPosition);
            yPosition += 5;
            
            const hasil = hasilResponse.data;
            
            console.log('📊 Hasil Penawaran Data for PDF:', hasil);
            console.log('📊 Field Mapping Check:', {
              total_per_bulan_harga_dasar: hasil.total_per_bulan_harga_dasar_icon,
              total_per_bulan_harga_final: hasil.total_per_bulan_harga_final_sebelum_ppn,
              grand_total_12_bulan_harga_dasar: hasil.grand_total_12_bulan_harga_dasar_icon,
              grand_total_12_bulan_harga_final: hasil.grand_total_12_bulan_harga_final_sebelum_ppn,
              discount: hasil.discount,
              grand_total_disc_harga_dasar: hasil.grand_total_disc_lain2_harga_dasar_icon,
              grand_total_disc_harga_final: hasil.grand_total_disc_lain2_harga_final_sebelum_ppn,
              profit: hasil.profit_dari_hjt_excl_ppn,
              margin: hasil.margin_dari_hjt
            });
            
            // Calculate total pengeluaran from pengeluaranData using correct field: total_harga
            const totalPengeluaranLain = pengeluaranData.reduce((sum, item) => {
              const totalHarga = parseFloat(item.total_harga) || 0;
              console.log(`Adding pengeluaran: ${item.item}, total_harga: ${totalHarga}`);
              return sum + totalHarga;
            }, 0);
            
            console.log('💰 Total Pengeluaran Lain-lain calculated:', totalPengeluaranLain);
            
            // Get discount value from hasil_penawaran
            const discountAmount = parseFloat(hasil.discount) || 0;
            console.log('💵 Discount amount from hasil_penawaran:', discountAmount);
            
            const summaryData = [
              ['Total/Bulan', `Rp ${(hasil.total_per_bulan_harga_dasar_icon || 0).toLocaleString('id-ID')}`, `Rp ${(hasil.total_per_bulan_harga_final_sebelum_ppn || 0).toLocaleString('id-ID')}`],
              ['Grand Total (12 Bulan)', `Rp ${(hasil.grand_total_12_bulan_harga_dasar_icon || 0).toLocaleString('id-ID')}`, `Rp ${(hasil.grand_total_12_bulan_harga_final_sebelum_ppn || 0).toLocaleString('id-ID')}`],
              ['Discount', `Rp ${discountAmount.toLocaleString('id-ID')}`, ''],
              ['Total Pengeluaran Lain-lain', '', `Rp ${totalPengeluaranLain.toLocaleString('id-ID')}`],
              ['Grand Total - Disc/Lain2', `Rp ${(hasil.grand_total_disc_lain2_harga_dasar_icon || 0).toLocaleString('id-ID')}`, `Rp ${(hasil.grand_total_disc_lain2_harga_final_sebelum_ppn || 0).toLocaleString('id-ID')}`],
              ['Profit dari HJT (excl.PPN)', '', `Rp ${(hasil.profit_dari_hjt_excl_ppn || 0).toLocaleString('id-ID')}`],
              ['Margin dari HJT', '', `${(hasil.margin_dari_hjt || 0).toFixed(2)}%`]
            ];
            
            autoTable(doc, {
              body: summaryData,
              startY: yPosition,
              margin: { left: 14, right: 14 },
              styles: {
                fontSize: 8,
                cellPadding: 3
              },
              columnStyles: {
                0: { cellWidth: 70, fontStyle: 'bold' },
                1: { cellWidth: 50, halign: 'right' },
                2: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
              }
            });
            
            yPosition = doc.lastAutoTable.finalY + 5;
          }
          
        } catch (detailError) {
          console.error(`Error fetching detail for penawaran ${item.id_penawaran}:`, detailError);
          doc.setFontSize(9);
          doc.setTextColor(255, 0, 0);
          doc.text('Data detail tidak dapat dimuat', 14, yPosition);
        }
        
        // Add signature section at bottom right
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const signatureY = pageHeight - 50; // 50mm from bottom
        const signatureX = pageWidth - 70; // 70mm from right edge
        
        // Reset text color to black for signature
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        
        // Add "Tanda tangan" text
        doc.text('Tanda tangan', signatureX, signatureY);
        
        // Add space for signature (blank area - no line)
        // Space of about 15mm for manual signature
        
        // Add name below signature space - aligned with "Tanda tangan"
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text('Alya Fadhiyan', signatureX, signatureY + 20);
        doc.setFont(undefined, 'normal');
        
        // Footer with page number
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Halaman ${dataIndex + 1} dari ${filteredData.length} | Data Penawaran - ${item.namaPelanggan || 'N/A'}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      const safeDate = currentDate.replace(/[\/\\:*?"<>|]/g, '-');
      const filename = `Detail_Penawaran_${safeDate}.pdf`;
      
      console.log('Saving comprehensive PDF with filename:', filename);
      
      doc.save(filename);
      
      console.log('Comprehensive PDF exported successfully');
      
      // TAMPILKAN MODAL SUKSES SETELAH BERHASIL EXPORT
      setShowExportSuccessModal(true);
      
    } catch (error) {
      console.error('Detailed error exporting PDF:', error);
      console.error('Error stack:', error.stack);
      alert(`Terjadi kesalahan saat mengexport PDF: ${error.message}`);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Menunggu':
        return {
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          border: '2px solid #F59E0B',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        };
      case 'Disetujui':
        return {
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          border: '2px solid #10B981',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        };
      case 'Ditolak':
        return {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          border: '2px solid #EF4444',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          color: '#374151',
          border: '2px solid #9CA3AF',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        };
    }
  };

  const getCardBorderColor = (cardType) => {
    switch (cardType) {
      case 'total':
        return colors.secondary;
      case 'filtered':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#e7f3f5ff',
      padding: '60px 48px 10px 48px',
      fontFamily: "'Open Sans', sans-serif !important",
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, ${colors.secondary}05 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${colors.success}05 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      <div style={{ 
        flex: '1 0 auto',
        maxWidth: '1800px',
        margin: '0 auto', 
        position: 'relative',
        width: '100%'
      }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Total Penawaran Card */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: `0 15px 30px ${colors.primary}20`,
              border: `1.5px solid ${getCardBorderColor('total')}`,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: 'auto',
              minHeight: 'auto'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(3, 91, 113, 0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}20`;
            }}>
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${colors.secondary}20 0%, ${colors.secondary}10 100%)`,
                borderRadius: '50%'
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 3px 8px ${colors.secondary}30`
                }}>
                  <Filter size={22} />
                </div>
                <div>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: colors.primary,
                    margin: '0 0 4px 0'
                  }}>
                    {penawaranData.length}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: colors.gray600,
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    Total Penawaran
                  </p>
                </div>
              </div>
            </div>

            {/* Data Terfilter Card */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: `0 15px 30px ${colors.primary}20`,
              border: `1.5px solid ${getCardBorderColor('filtered')}`,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: 'auto',
              minHeight: 'auto'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(3, 91, 113, 0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}20`;
            }}>
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${colors.success}20 0%, ${colors.success}10 100%)`,
                borderRadius: '50%'
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 3px 8px ${colors.success}30`
                }}>
                  <Filter size={22} />
                </div>
                <div>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: colors.primary,
                    margin: '0 0 4px 0'
                  }}>
                    {filteredData.length}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: colors.gray600,
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    Data Terfilter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            fontSize: '18px',
            color: colors.gray600,
            background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
            borderRadius: '24px',
            border: `2px solid ${colors.primary}`,
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: `4px solid ${colors.primary}20`,
                borderTop: `4px solid ${colors.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Memuat data penawaran...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '2px solid #EF4444',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '32px',
            color: '#DC2626',
            background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
            fontSize: '16px'
          }}>
            <strong>Error:</strong> {error}
            <button 
              onClick={fetchPenawaranData}
              style={{
                marginLeft: '20px',
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!isLoading && !error && (
          <>
            {/* Filter Section */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: `0 15px 30px ${colors.primary}20`,
              border: `1.5px solid ${colors.primary}`,
              marginBottom: '24px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '120px'
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                width: '80px',
                height: '80px',
                background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`,
                borderRadius: '50%'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                right: '-15px',
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${colors.success}08 0%, transparent 70%)`,
                borderRadius: '50%'
              }} />

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                alignItems: 'end',
                position: 'relative',
              }}>
                {/* Filter by Date */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Calendar size={18} />
                    Filter By Tanggal
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: `1.5px solid ${colors.primary}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: colors.white,
                      color: colors.gray700
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.secondary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Filter by Status */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Filter size={18} />
                    Filter By Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: `1.5px solid ${colors.primary}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: colors.white,
                      color: colors.gray700,
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23035b71' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      backgroundSize: '16px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.secondary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="" disabled hidden>Semua Status</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                {/* Reset Filter Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                  <button
                    onClick={() => {
                      setFilterDate('');
                      setFilterStatus('');
                      setCurrentPage(1);
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
                      color: 'white',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 3px 8px ${colors.primary}30`,
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 5px 15px ${colors.primary}40`;
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = `0 3px 8px ${colors.primary}30`;
                    }}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              {/* Export PDF Button */}
              <button
                onClick={handleExportPDF}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 29px',
                  background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.accent1} 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 3px 8px ${colors.primary}30`,
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 5px 15px ${colors.primary}40`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 3px 8px ${colors.primary}30`;
                }}
              >
                <Download size={18} />
                Ekspor PDF
              </button>
            </div>

            {/* Table Section */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: `0 12px 40px ${colors.primary}08`,
              border: `2px solid ${colors.primary}`,
              position: 'relative',
              marginBottom: '249px'
            }}>
              {/* Table Header */}
              <div style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
                padding: '24px 32px',
                borderBottom: `1px solid ${colors.gray200}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-10%',
                  width: '120%',
                  height: '200%',
                  background: `radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)`,
                  transform: 'rotate(-15deg)',
                  pointerEvents: 'none'
                }} />
                <h3 style={{
                  color: colors.white,
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: 0,
                  position: 'relative',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  Daftar Penawaran
                </h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: 0
                }}>
                  <thead>
                    <tr style={{
                      background: `linear-gradient(135deg, ${colors.light}60 0%, ${colors.gray100} 100%)`
                    }}>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '100px'
                      }}>
                        No.
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '160px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={18} />
                          Tanggal
                        </div>
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Nama Sales
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Nama Pelanggan
                      </th>
                      {/* Lokasi Pelanggan */}
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px', 
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          Lokasi Pelanggan
                        </div>
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Nomor Kontrak/BAKB
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Kontrak Ke-
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Referensi
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Discount
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Durasi Kontrak (in thn)
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Status
                      </th>
                      <th style={{
                        padding: '24px 20px',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '100px'
                      }}>
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td
                          colSpan="12" 
                          style={{
                            padding: '80px 20px',
                            textAlign: 'center',
                            color: colors.gray500,
                            fontSize: '18px',
                            background: `linear-gradient(135deg, ${colors.gray50} 0%, ${colors.white} 100%)`
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px'
                          }}>
                            <Filter size={56} style={{ color: colors.gray300 }} />
                            <span>Tidak ada data yang ditemukan</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, index) => (
                        <tr
                          key={item.id}
                          style={{
                            background: index % 2 === 0 
                              ? `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50}50 100%)`
                              : colors.white,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${colors.light}30 0%, ${colors.secondary}05 100%)`;
                            e.currentTarget.style.transform = 'scale(1.005)';
                            e.currentTarget.style.boxShadow = `0 8px 25px ${colors.primary}08`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = index % 2 === 0 
                              ? `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50}50 100%)`
                              : colors.white;
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <td style={{
                            padding: '24px 20px',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '700',
                              margin: '0 auto',
                              boxShadow: `0 2px 8px ${colors.secondary}30`
                            }}>
                              {startIndex + index + 1}
                            </div>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}>
                              <span style={{ fontWeight: '600' }}>{item.tanggal}</span>
                            </div>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              background: `${colors.gray100}`,
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontSize: '15px',
                              fontFamily: "'Open Sans', sans-serif !important",
                              border: `1px solid ${colors.primary}`,
                              display: 'inline-block'
                            }}>
                              {item.namaSales}
                            </div>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px'
                            }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '700',
                                boxShadow: `0 4px 12px ${colors.success}25`
                              }}>
                                {item.namaPelanggan.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                  {item.namaPelanggan}
                                </div>
                                <div style={{ 
                                  fontSize: '14px',
                                  color: colors.gray500 
                                }}>
                                  Pelanggan
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Lokasi Pelanggan */}
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}>
                              <MapPin size={18} color={colors.tertiary} />
                              <div style={{
                                 background: `${colors.gray100}`,
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontSize: '15px',
                              fontFamily: "'Open Sans', sans-serif !important",
                              border: `1px solid ${colors.primary}`,
                              display: 'inline-block'
                              }}>
                                {item.lokasiPelanggan}
                              </div>
                            </div>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              background: `${colors.gray100}`,
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontSize: '15px',
                              fontFamily: "'Open Sans', sans-serif !important",
                              border: `1px solid ${colors.primary}`,
                              display: 'inline-block'
                            }}>
                              {item.nomorKontrak}
                            </div>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              background: `${colors.gray100}`,
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontSize: '15px',
                              fontFamily: "'Open Sans', sans-serif !important",
                              border: `1px solid ${colors.primary}`,
                              display: 'inline-block'
                            }}>
                              {item.kontrakKe}
                            </div>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              background: `${colors.gray100}`,
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontSize: '15px',
                              fontFamily: "'Open Sans', sans-serif !important",
                              border: `1px solid ${colors.primary}`,
                              display: 'inline-block'
                            }}>
                              {item.referensi}
                            </div>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.gray700,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              background: `${colors.gray100}`,
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontSize: '15px',
                              fontFamily: "'Open Sans', sans-serif !important",
                              border: `1px solid ${colors.primary}`,
                              display: 'inline-block',
                              fontWeight: '600'
                            }}>
                              {item.discount}
                            </div>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              background: `${colors.gray100}`,
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontSize: '15px',
                              fontFamily: "'Open Sans', sans-serif !important",
                              border: `1px solid ${colors.primary}`,
                              display: 'inline-block'
                            }}>
                              {item.durasi} tahun
                            </div>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            fontSize: '16px',
                            color: colors.gray700,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <span style={{
                              ...getStatusStyle(item.status),
                              fontSize: '14px',
                              padding: '6px 12px'
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{
                            padding: '24px 20px',
                            textAlign: 'center',
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '10px'
                            }}>
                              {/* View Button */}
                              <button
                                onClick={() => handleDetailData(item)}
                                style={{
                                  background: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.secondary}25 100%)`,
                                  color: colors.secondary,
                                  padding: '10px',
                                  borderRadius: '10px',
                                  border: `1px solid ${colors.tertiary}90`,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.3s ease',
                                  boxShadow: `0 2px 8px ${colors.secondary}20`
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.background = colors.secondary;
                                  e.target.style.color = 'white';
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = `0 4px 12px ${colors.secondary}40`;
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.background = `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.secondary}25 100%)`;
                                  e.target.style.color = colors.secondary;
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = `0 2px 8px ${colors.secondary}20`;
                                }}
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              <div style={{
                padding: '28px',
                borderTop: `1px solid ${colors.gray200}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${colors.gray50} 0%, ${colors.white} 100%)`,
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div style={{
                  fontSize: '16px',
                  color: colors.gray600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    padding: '8px 14px',
                    background: `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.tertiary}10 100%)`,
                    borderRadius: '10px',
                    border: `1px solid ${colors.primary}`,
                    fontWeight: '600',
                    color: colors.primary
                  }}>
                    {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    style={{
                      padding: '12px 20px',
                      border: `2px solid ${currentPage === 1 ? colors.gray400 : colors.secondary}`,
                      borderRadius: '12px',
                      background: currentPage === 1 
                        ? colors.gray100 
                        : `linear-gradient(135deg, ${colors.white} 0%, ${colors.secondary}05 100%)`,
                      color: currentPage === 1 ? colors.gray400 : colors.secondary,
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.background = colors.secondary;
                        e.target.style.color = 'white';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.background = `linear-gradient(135deg, ${colors.white} 0%, ${colors.secondary}05 100%)`;
                        e.target.style.color = colors.secondary;
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    ← Previous
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(() => {
                      const maxVisiblePages = 10;
                      let startPage, endPage;

                      if (totalPages <= maxVisiblePages) {
                        startPage = 1;
                        endPage = totalPages;
                      } else {
                        if (currentPage <= 6) {
                          startPage = 1;
                          endPage = maxVisiblePages;
                        } else if (currentPage + 4 >= totalPages) {
                          startPage = totalPages - 9;
                          endPage = totalPages;
                        } else {
                          startPage = currentPage - 5;
                          endPage = currentPage + 4;
                        }
                      }

                      const pages = [];
                      
                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => handlePageChange(1)}
                            style={{
                              width: '48px',
                              height: '48px',
                              border: `2px solid ${1 === currentPage ? colors.secondary : colors.gray300}`,
                              borderRadius: '12px',
                              background: 1 === currentPage 
                                ? `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`
                                : `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
                              color: 1 === currentPage ? 'white' : colors.gray600,
                              fontSize: '16px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 1 === currentPage 
                                ? `0 4px 12px ${colors.secondary}30`
                                : '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            onMouseOver={(e) => {
                              if (1 !== currentPage) {
                                e.target.style.background = `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.tertiary}10 100%)`;
                                e.target.style.borderColor = colors.secondary;
                                e.target.style.color = colors.secondary;
                              }
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                              if (1 !== currentPage) {
                                e.target.style.background = `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`;
                                e.target.style.borderColor = colors.gray300;
                                e.target.style.color = colors.gray600;
                              }
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            1
                          </button>
                        );

                        if (startPage > 2) {
                          pages.push(
                            <span key="ellipsis1" style={{
                              width: '48px',
                              height: '48px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: colors.gray500,
                              fontSize: '16px',
                              fontWeight: '600'
                            }}>
                              ...
                            </span>
                          );
                        }
                      }

                      for (let page = startPage; page <= endPage; page++) {
                        const isCurrentPage = page === currentPage;
                        
                        pages.push(
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            style={{
                              width: '48px',
                              height: '48px',
                              border: `2px solid ${isCurrentPage ? colors.secondary : colors.gray300}`,
                              borderRadius: '12px',
                              background: isCurrentPage 
                                ? `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`
                                : `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
                              color: isCurrentPage ? 'white' : colors.gray600,
                              fontSize: '16px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: isCurrentPage 
                                ? `0 4px 12px ${colors.secondary}30`
                                : '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            onMouseOver={(e) => {
                              if (!isCurrentPage) {
                                e.target.style.background = `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.tertiary}10 100%)`;
                                e.target.style.borderColor = colors.secondary;
                                e.target.style.color = colors.secondary;
                              }
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                              if (!isCurrentPage) {
                                e.target.style.background = `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`;
                                e.target.style.borderColor = colors.gray300;
                                e.target.style.color = colors.gray600;
                              }
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            {page}
                          </button>
                        );
                      }
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span key="ellipsis2" style={{
                              width: '48px',
                              height: '48px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: colors.gray500,
                              fontSize: '16px',
                              fontWeight: '600'
                            }}>
                              ...
                            </span>
                          );
                        }

                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            style={{
                              width: '48px',
                              height: '48px',
                              border: `2px solid ${totalPages === currentPage ? colors.secondary : colors.gray300}`,
                              borderRadius: '12px',
                              background: totalPages === currentPage 
                                ? `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`
                                : `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
                              color: totalPages === currentPage ? 'white' : colors.gray600,
                              fontSize: '16px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: totalPages === currentPage 
                                ? `0 4px 12px ${colors.secondary}30`
                                : '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            onMouseOver={(e) => {
                              if (totalPages !== currentPage) {
                                e.target.style.background = `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.tertiary}10 100%)`;
                                e.target.style.borderColor = colors.secondary;
                                e.target.style.color = colors.secondary;
                              }
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                              if (totalPages !== currentPage) {
                                e.target.style.background = `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`;
                                e.target.style.borderColor = colors.gray300;
                                e.target.style.color = colors.gray600;
                              }
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '12px 20px',
                      border: `2px solid ${currentPage === totalPages ? colors.gray400 : colors.secondary}`,
                      borderRadius: '12px',
                      background: currentPage === totalPages 
                        ? colors.gray100 
                        : `linear-gradient(135deg, ${colors.white} 0%, ${colors.secondary}05 100%)`,
                      color: currentPage === totalPages ? colors.gray400 : colors.secondary,
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.background = colors.secondary;
                        e.target.style.color = 'white';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.background = `linear-gradient(135deg, ${colors.white} 0%, ${colors.secondary}05 100%)`;
                        e.target.style.color = colors.secondary;
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal Components */}
        <Detail
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          detailData={selectedDetailData}
          refreshTrigger={refreshTrigger}
        />

        {/* Modal Sukses Export PDF */}
        <AnimatePresence>
          {showExportSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(3, 91, 113, 0.3)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001,
                padding: '20px'
              }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.4, 0, 0.2, 1],
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                style={{
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  borderRadius: '28px',
                  padding: '48px',
                  textAlign: 'center',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '480px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                    borderRadius: '50%',
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 32px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 20px 40px rgba(63, 186, 140, 0.4)`
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 600, damping: 20 }}
                  >
                    <Check style={{ 
                      width: '56px',
                      height: '56px',
                      color: 'white',
                      strokeWidth: 3
                    }} />
                  </motion.div>
                </motion.div>

                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '28px',
                    fontWeight: '700',
                    background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Berhasil!
                </motion.h3>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{
                    margin: '0 0 40px 0',
                    fontSize: '18px',
                    color: colors.accent1,
                    lineHeight: '1.5',
                    opacity: 0.9
                  }}
                >
                  File PDF berhasil diunduh dan disimpan
                </motion.p>
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseExportSuccessModal}
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '18px 36px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: `0 8px 25px rgba(63, 186, 140, 0.3)`,
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.02em'
                  }}
                >
                  Selesai
                </motion.button>

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseExportSuccessModal}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(3, 91, 113, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <X size={22} color={colors.primary} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        flexShrink: 0,
        padding: '30px 20px',
        color: colors.primary,
        fontSize: '14px',
        opacity: 0.7,
        marginTop: 'auto',
        paddingTop: '80px'
      }}>
        © {new Date().getFullYear()} PLN Icon Plus • Financial Network Feasibility System 
      </div>
    </div>
  );
};

export default Penawaran;
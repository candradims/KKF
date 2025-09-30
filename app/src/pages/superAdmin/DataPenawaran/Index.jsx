import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Eye, RotateCcw, Filter, Calendar } from 'lucide-react';
import Detail from './Detail';
import { penawaranAPI, getUserData } from '../../../utils/api';

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

// Helper function untuk format tanggal dari DD/MM/YYYY menjadi DD-MM-YYYY
const formatTanggal = (tanggal) => {
  if (!tanggal) return '-';
  
  // Jika sudah menggunakan format DD-MM-YYYY, return langsung
  if (tanggal.includes('-')) return tanggal;
  
  // Konversi dari DD/MM/YYYY ke DD-MM-YYYY
  return tanggal.replace(/\//g, '-');
};

const Index = () => {
  const location = useLocation();
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatusItem, setSelectedStatusItem] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusCatatan, setStatusCatatan] = useState('');

  // State untuk data dari API
  const [penawaranData, setPenawaranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Apply filter from dashboard navigation
  useEffect(() => {
    if (location.state?.filterStatus) {
      setFilterStatus(location.state.filterStatus);
    }
  }, [location.state]);

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
      
      console.log("📋 Fetching penawaran data for SuperAdmin:", userData.email_user);

      const result = await penawaranAPI.getAll();
      
      if (result.success) {
        // Transform data dari API ke format yang digunakan di frontend - sama seperti Admin
        const transformedData = result.data.map(item => {
          try {
            console.log("🔧 Transforming item:", item.id_penawaran, "diskon:", item.diskon);
            
            // Format tanggal dari DD/MM/YYYY ke DD-MM-YYYY
            const originalDate = new Date(item.tanggal_dibuat).toLocaleDateString('id-ID');
            const formattedTanggal = formatTanggal(originalDate);
            
            const transformedItem = {
              id: item.id_penawaran,
              id_penawaran: item.id_penawaran,
              tanggal: formattedTanggal,
              namaPelanggan: item.nama_pelanggan,
              namaSales: item.data_user?.nama_user || '-',
              sales: item.data_user?.nama_user || '-',
              nomorKontrak: item.nomor_kontrak,
              kontrakKe: item.kontrak_tahun,
              referensi: item.wilayah_hjt,
              diskon: item.diskon,
              discount: convertDiscountToPercentage(item.diskon),
              durasi: item.durasi_kontrak,
              status: item.status || 'Menunggu',
              actions: ['view'],
              rawData: item
            };
            console.log("🔧 Transformed item:", transformedItem.id, "tanggal:", transformedItem.tanggal, "diskon:", transformedItem.diskon, "display:", transformedItem.discount);
            return transformedItem;
          } catch (itemError) {
            console.error('❌ Error transforming item:', item, itemError);
            return {
              id: item.id_penawaran || 'unknown',
              id_penawaran: item.id_penawaran || 'unknown',
              tanggal: '-',
              namaPelanggan: item.nama_pelanggan || '-',
              namaSales: '-',
              sales: '-',
              nomorKontrak: item.nomor_kontrak || '-',
              kontrakKe: item.kontrak_tahun || '-',
              referensi: item.wilayah_hjt || '-',
              diskon: 0,
              discount: '0%',
              durasi: item.durasi_kontrak || '-',
              status: 'Error',
              actions: ['view'],
              rawData: item
            };
          }
        });
        
        console.log("✅ SuperAdmin penawaran data transformed:", transformedData.length, "items");
        console.log("📋 Sample transformed data:", transformedData.slice(0, 2));
        setPenawaranData(transformedData);
      } else {
        throw new Error(result.message || 'Gagal mengambil data penawaran');
      }
    } catch (err) {
      console.error('❌ Error fetching penawaran data:', err);
      setError(err.message);
      setPenawaranData([]);
      
      // If authentication error, redirect to login
      if (err.message.includes('terautentikasi') || err.message.includes('authentication')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect untuk fetch data saat komponen dimount
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

  // Debug data
  console.log("🔍 SuperAdmin Debug - Total penawaranData:", penawaranData.length);
  console.log("🔍 SuperAdmin Debug - Filtered data:", filteredData.length);
  console.log("🔍 SuperAdmin Debug - Sample data:", penawaranData.slice(0, 2));

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

  const handleStatusClick = (item) => {
    setSelectedStatusItem(item);
    setNewStatus(item.status);
    setStatusCatatan(''); // Reset catatan saat modal dibuka
    setShowStatusModal(true);
  };

  const handleStatusChange = async () => {
    if (!selectedStatusItem || !newStatus) return;
    
    // Jika status ditolak dan belum ada catatan, tampilkan peringatan
    if (newStatus === 'Ditolak' && !statusCatatan.trim()) {
      alert('Catatan wajib diisi untuk status Ditolak');
      return;
    }
    
    try {
      console.log("📝 Updating status for penawaran:", selectedStatusItem.id, "to:", newStatus);
      
      // Buat catatan berdasarkan status
      let finalCatatan;
      if (newStatus === 'Ditolak' && statusCatatan.trim()) {
        finalCatatan = statusCatatan.trim();
      } else {
        finalCatatan = `Status diubah menjadi ${newStatus}`;
      }
      
      // Call API to update status
      const result = await penawaranAPI.updateStatus(selectedStatusItem.id, {
        status: newStatus,
        catatan: finalCatatan
      });
      
      if (result.success) {
        console.log("✅ Status updated successfully");
        
        // Update local state
        setPenawaranData(prevData => 
          prevData.map(item => 
            item.id === selectedStatusItem.id 
              ? { ...item, status: newStatus, catatan: finalCatatan }
              : item
          )
        );
        
        handleCloseStatusModal();
        alert('Status berhasil diperbarui!');
      } else {
        console.error("❌ Failed to update status:", result.message);
        alert(`Gagal memperbarui status: ${result.message}`);
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setSelectedStatusItem(null);
    setNewStatus('');
    setStatusCatatan(''); // Reset catatan saat modal ditutup
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Menunggu':
        return {
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        };
      case 'Disetujui':
        return {
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        };
      case 'Ditolak':
        return {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        };
      default:
        return {
          backgroundColor: colors.gray200,
          color: colors.gray700,
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        };
    }
  };

  // Function untuk mendapatkan border color berdasarkan konten card
  const getCardBorderColor = (cardType) => {
    switch (cardType) {
      case 'total':
        return colors.secondary;
      case 'filtered':
        return colors.success;
      case 'penawaran':
        return colors.primary;
      case 'layanan':
        return colors.secondary;
      default:
        return colors.gray300;
    }
  };

  return (
    <>
      {/* CSS Animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={{
        padding: '24px',
        backgroundColor: colors.gray50,
        minHeight: '100vh',
        position: 'relative'
      }}>
      
      {/* Background decorative elements */}
      <div style={{
        position: 'fixed',
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

      <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Total Penawaran Card */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: `0 4px 20px ${colors.primary}10`,
              border: `2px solid ${getCardBorderColor('total')}`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
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
                  boxShadow: `0 4px 12px ${colors.secondary}30`
                }}>
                  <Filter size={24} />
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
                    margin: 0
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
              boxShadow: `0 4px 20px ${colors.primary}10`,
              border: `2px solid ${getCardBorderColor('filtered')}`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
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
                  boxShadow: `0 4px 12px ${colors.success}30`
                }}>
                  <Filter size={24} />
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
                    margin: 0
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
            background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: `0 4px 20px ${colors.primary}10`,
            border: `2px solid ${colors.primary}20`
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: `4px solid ${colors.gray200}`,
              borderTop: `4px solid ${colors.secondary}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{
              fontSize: '16px',
              color: colors.gray600,
              margin: 0
            }}>
              Memuat data penawaran...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            background: `linear-gradient(135deg, #FEF2F2 0%, #FECACA20 100%)`,
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px #EF444410',
            border: '2px solid #FCA5A5'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#DC2626',
              marginBottom: '8px'
            }}>
              Error memuat data
            </div>
            <div style={{
              fontSize: '14px',
              color: '#7F1D1D',
              marginBottom: '16px'
            }}>
              {error}
            </div>
            <button
              onClick={fetchPenawaranData}
              style={{
                padding: '12px 24px',
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#B91C1C';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#DC2626';
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Main Content - Only show when not loading and no error */}
        {!isLoading && !error && (
          <>
            {/* Filter Section */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: `0 10px 40px ${colors.primary}10`,
              border: `2px solid ${colors.primary}15`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                width: '120px',
                height: '120px',
                background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`,
                borderRadius: '50%'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                right: '-30px',
                width: '150px',
                height: '150px',
                background: `radial-gradient(circle, ${colors.success}08 0%, transparent 70%)`,
                borderRadius: '50%'
              }} />

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
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
                    <Calendar size={16} />
                    Filter by Tanggal
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${colors.primary}`,
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
                    <Filter size={16} />
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${colors.primary}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: colors.white,
                      color: colors.gray700,
                      cursor: 'pointer'
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
                    <option value="">Semua Status</option>
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 4px 12px ${colors.secondary}30`,
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 6px 20px ${colors.secondary}40`;
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0px)';
                      e.target.style.boxShadow = `0 4px 12px ${colors.secondary}30`;
                    }}
                  >
                    <RotateCcw size={16} />
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Data Section */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: `0 10px 40px ${colors.primary}10`,
              border: `2px solid ${colors.primary}15`
            }}>
              {/* Table Header */}
              <div style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                padding: '20px 32px',
                borderBottom: `2px solid ${colors.primary}20`
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.white,
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Filter size={24} />
                  Daftar Penawaran
                </h3>
              </div>

              {/* Table Container */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{ 
                      background: `linear-gradient(135deg, ${colors.gray50} 0%, ${colors.white} 100%)`,
                      borderBottom: `2px solid ${colors.primary}20`
                    }}>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>No</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Tanggal</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Nama Pelanggan</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Nama Sales</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Nomor Kontrak/BAKB</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Kontrak Ke-</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Referensi</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Discount</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Durasi Kontrak (thn)</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Status</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={item.id} style={{
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
                          padding: '20px 16px',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '700',
                            margin: '0 auto',
                            boxShadow: `0 2px 8px ${colors.secondary}30`
                          }}>
                            {startIndex + index + 1}
                          </div>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px'
                          }}>
                            <span style={{ fontWeight: '600' }}>{formatTanggal(item.tanggal)}</span>
                          </div>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: '700',
                              boxShadow: `0 4px 12px ${colors.success}25`
                            }}>
                              {item.namaPelanggan.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                                {item.namaPelanggan}
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: colors.gray500 
                              }}>
                                Pelanggan
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <div style={{
                            background: `${colors.gray100}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontFamily: "'Open Sans', sans-serif !important",
                            border: `1px solid ${colors.primary}`,
                            display: 'inline-block'
                          }}>
                            {item.namaSales}
                          </div>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <div style={{
                            background: `${colors.gray100}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontFamily: "'Open Sans', sans-serif !important",
                            border: `1px solid ${colors.primary}`,
                            display: 'inline-block'
                          }}>
                            {item.nomorKontrak}
                          </div>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <div style={{
                            background: `${colors.gray100}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontFamily: "'Open Sans', sans-serif !important",
                            border: `1px solid ${colors.primary}`,
                            display: 'inline-block'
                          }}>
                            {item.kontrakKe}
                          </div>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <div style={{
                            background: `${colors.gray100}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontFamily: "'Open Sans', sans-serif !important",
                            border: `1px solid ${colors.primary}`,
                            display: 'inline-block'
                          }}>
                            {item.referensi}
                          </div>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <div style={{
                            background: `${colors.gray100}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontFamily: "'Open Sans', sans-serif !important",
                            border: `1px solid ${colors.primary}`,
                            display: 'inline-block'
                          }}>
                            {convertDiscountToPercentage(item.discount)}
                          </div>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <div style={{
                            background: `${colors.gray100}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontFamily: "'Open Sans', sans-serif !important",
                            border: `1px solid ${colors.primary}`,
                            display: 'inline-block'
                          }}>
                            {item.durasi}
                          </div>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <button
                            onClick={() => handleStatusClick(item)}
                            style={{
                              ...getStatusStyle(item.status),
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              outline: 'none'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = 'none';
                            }}
                            title="Klik untuk mengubah status"
                          >
                            {item.status}
                          </button>
                        </td>
                        <td style={{
                          padding: '20px 16px',
                          textAlign: 'center',
                          borderBottom: `2px solid ${colors.gray200}`,
                        }}>
                          <button
                            onClick={() => handleDetailData(item)}
                            style={{
                              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                              color: colors.white,
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease',
                              fontSize: '12px',
                              fontWeight: '600',
                              boxShadow: `0 2px 8px ${colors.secondary}30`,
                              margin: '0 auto'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = `0 4px 12px ${colors.secondary}40`;
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0px)';
                              e.target.style.boxShadow = `0 2px 8px ${colors.secondary}30`;
                            }}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 32px',
                background: `linear-gradient(135deg, ${colors.gray50} 0%, ${colors.white} 100%)`,
                borderTop: `2px solid ${colors.primary}10`
              }}>
                <div style={{
                  fontSize: '14px',
                  color: colors.gray600,
                  fontWeight: '500'
                }}>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: currentPage === 1 ? colors.gray200 : colors.white,
                      color: currentPage === 1 ? colors.gray400 : colors.primary,
                      border: `2px solid ${currentPage === 1 ? colors.gray300 : colors.primary}`,
                      borderRadius: '10px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.backgroundColor = colors.primary;
                        e.target.style.color = colors.white;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.color = colors.primary;
                      }
                    }}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: page === currentPage ? colors.secondary : colors.white,
                          color: page === currentPage ? colors.white : colors.primary,
                          border: `2px solid ${page === currentPage ? colors.secondary : colors.primary}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          minWidth: '44px',
                          transition: 'all 0.3s ease',
                          boxShadow: page === currentPage ? `0 4px 12px ${colors.secondary}30` : 'none'
                        }}
                        onMouseOver={(e) => {
                          if (page !== currentPage) {
                            e.target.style.backgroundColor = colors.secondary;
                            e.target.style.color = colors.white;
                            e.target.style.borderColor = colors.secondary;
                            e.target.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (page !== currentPage) {
                            e.target.style.backgroundColor = colors.white;
                            e.target.style.color = colors.primary;
                            e.target.style.borderColor = colors.primary;
                            e.target.style.transform = 'translateY(0px)';
                          }
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: currentPage === totalPages ? colors.gray200 : colors.white,
                      color: currentPage === totalPages ? colors.gray400 : colors.primary,
                      border: `2px solid ${currentPage === totalPages ? colors.gray300 : colors.primary}`,
                      borderRadius: '10px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.backgroundColor = colors.primary;
                        e.target.style.color = colors.white;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.backgroundColor = colors.white;
                        e.target.style.color = colors.primary;
                      }
                    }}
                  >
                    Next
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
        />

        {/* Status Change Modal */}
        {showStatusModal && (
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
            zIndex: 1000
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '20px',
              padding: '32px',
              width: '480px',
              maxWidth: '90vw',
              boxShadow: `0 20px 40px ${colors.primary}20`,
              border: `2px solid ${colors.primary}20`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`,
                borderRadius: '50%'
              }} />
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: colors.primary,
                margin: '0 0 24px 0',
                position: 'relative'
              }}>
                Ubah Status Penawaran
              </h3>
              
              <div style={{
                marginBottom: '20px',
                position: 'relative'
              }}>
                <p style={{
                  fontSize: '15px',
                  color: colors.gray600,
                  margin: '0 0 8px 0',
                  fontWeight: '500'
                }}>
                  Pelanggan: <strong style={{ color: colors.primary }}>{selectedStatusItem?.namaPelanggan}</strong>
                </p>
                <p style={{
                  fontSize: '15px',
                  color: colors.gray600,
                  margin: '0 0 20px 0',
                  fontWeight: '500'
                }}>
                  Nomor Kontrak: <strong style={{ color: colors.primary }}>{selectedStatusItem?.nomorKontrak}</strong>
                </p>
              </div>

              <div style={{
                marginBottom: '24px'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: colors.primary,
                  marginBottom: '12px'
                }}>
                  Status Baru:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: `2px solid ${colors.primary}`,
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    backgroundColor: colors.white,
                    color: colors.gray700,
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
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
                  <option value="Menunggu">Menunggu</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              {newStatus === 'Ditolak' && (
                <div style={{
                  marginBottom: '24px'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '12px'
                  }}>
                    Catatan Penolakan <span style={{ color: '#DC2626' }}>*</span>:
                  </label>
                  <textarea
                    value={statusCatatan}
                    onChange={(e) => setStatusCatatan(e.target.value)}
                    placeholder="Masukkan alasan penolakan..."
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: `2px solid ${colors.primary}`,
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      backgroundColor: colors.white,
                      color: colors.gray700,
                      resize: 'vertical',
                      minHeight: '90px',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease'
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
                  <p style={{
                    fontSize: '13px',
                    color: colors.gray500,
                    margin: '8px 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    Catatan wajib diisi untuk status Ditolak
                  </p>
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={handleCloseStatusModal}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: colors.gray200,
                    color: colors.gray700,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = colors.gray300;
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = colors.gray200;
                    e.target.style.transform = 'translateY(0px)';
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())}
                  style={{
                    padding: '12px 24px',
                    background: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) 
                      ? colors.gray300 
                      : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                    color: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) 
                      ? colors.gray500 
                      : colors.white,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) 
                      ? 'not-allowed' 
                      : 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) 
                      ? 'none' 
                      : `0 4px 12px ${colors.secondary}30`
                  }}
                  onMouseOver={(e) => {
                    if (newStatus && newStatus !== selectedStatusItem?.status && !(newStatus === 'Ditolak' && !statusCatatan.trim())) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 6px 16px ${colors.secondary}40`;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (newStatus && newStatus !== selectedStatusItem?.status && !(newStatus === 'Ditolak' && !statusCatatan.trim())) {
                      e.target.style.transform = 'translateY(0px)';
                      e.target.style.boxShadow = `0 4px 12px ${colors.secondary}30`;
                    }
                  }}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Index;
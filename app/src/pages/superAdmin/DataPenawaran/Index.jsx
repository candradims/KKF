import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Eye, RotateCcw, Filter, Calendar, Check } from 'lucide-react';
import Detail from './Detail';
import { penawaranAPI, getUserData } from '../../../utils/api';
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

  // State untuk success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Fungsi untuk menampilkan success modal
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    
    // Auto close setelah 3 detik
    setTimeout(() => {
      setShowSuccessModal(false);
      setSuccessMessage('');
    }, 3000);
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
      const result = await penawaranAPI.updateStatus(selectedStatusItem.id, newStatus, finalCatatan);
      
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
        
        // Tampilkan success modal
        showSuccessMessage(`Status penawaran berhasil diubah menjadi "${newStatus}"`);
        
        handleCloseStatusModal();
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

  // Function untuk mendapatkan border color berdasarkan konten card
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
      padding: '24px',
      fontFamily: "'Open Sans', sans-serif !important",
      position: 'relative'
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: colors.gray600,
            background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
            borderRadius: '16px',
            border: `2px solid ${colors.primary}`
          }}>
            Memuat data penawaran...
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '2px solid #EF4444',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            color: '#DC2626',
            background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`
          }}>
            <strong>Error:</strong> {error}
            <button 
              onClick={fetchPenawaranData}
              style={{
                marginLeft: '16px',
                padding: '10px 20px',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !error && (
          <>
            {/* Filter Section */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '20px',
              padding: '28px',
              boxShadow: `0 8px 32px ${colors.primary}08`,
              border: `2px solid ${colors.primary}`,
              marginBottom: '24px',
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
                    <option value="" disabled hidden>Semua Status</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                {/* Refresh Button */}
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
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 4px 15px ${colors.primary}30`,
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 6px 20px ${colors.primary}40`;
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = `0 4px 15px ${colors.primary}30`;
                    }}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: `0 12px 40px ${colors.primary}08`,
              border: `2px solid ${colors.primary}`,
              position: 'relative'
            }}>
              {/* Table Header */}
              <div style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
                padding: '20px 24px',
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
                  fontSize: '18px',
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
                        padding: '20px 16px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '80px'
                      }}>
                        No.
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '140px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={16} />
                          Tanggal
                        </div>
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Nama Pelanggan
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Sales
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Nomor Kontrak
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Kontrak Ke-
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Referensi
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Discount
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Durasi Kontrak
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}>
                        Status
                      </th>
                      <th style={{
                        padding: '20px 16px',
                        textAlign: 'center',
                        fontSize: '14px',
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
                          colSpan="11"
                          style={{
                            padding: '60px 20px',
                            textAlign: 'center',
                            color: colors.gray500,
                            fontSize: '16px',
                            background: `linear-gradient(135deg, ${colors.gray50} 0%, ${colors.white} 100%)`
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <Filter size={48} style={{ color: colors.gray300 }} />
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
                              <span style={{ fontWeight: '600' }}>{item.tanggal}</span>
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
                              {convertDiscountToPercentage(item.diskon)}
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
                              {item.durasi} tahun
                            </div>
                          </td>
                          <td style={{
                            padding: '20px 16px',
                            fontSize: '14px',
                            color: colors.gray700,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <button
                              onClick={() => handleStatusClick(item)}
                              style={{
                                ...getStatusStyle(item.status),
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                outline: 'none',
                                fontWeight: '600'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.opacity = '0.8';
                                e.target.style.transform = 'scale(1.02)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.opacity = '1';
                                e.target.style.transform = 'scale(1)';
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
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}>
                              <button
                                onClick={() => handleDetailData(item)}
                                style={{
                                  background: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.secondary}25 100%)`,
                                  color: colors.secondary,
                                  padding: '8px',
                                  borderRadius: '8px',
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
                                <Eye size={16} />
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
                padding: '24px',
                borderTop: `1px solid ${colors.gray200}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${colors.gray50} 0%, ${colors.white} 100%)`,
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: colors.gray600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    padding: '6px 12px',
                    background: `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.tertiary}10 100%)`,
                    borderRadius: '8px',
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
                  gap: '8px'
                }}>
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    style={{
                      padding: '10px 16px',
                      border: `2px solid ${currentPage === 1 ? colors.gray400 : colors.secondary}`,
                      borderRadius: '10px',
                      background: currentPage === 1 
                        ? colors.gray100 
                        : `linear-gradient(135deg, ${colors.white} 0%, ${colors.secondary}05 100%)`,
                      color: currentPage === 1 ? colors.gray400 : colors.secondary,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
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

                  <div style={{ display: 'flex', gap: '4px' }}>
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
                              width: '44px',
                              height: '44px',
                              border: `2px solid ${1 === currentPage ? colors.secondary : colors.gray300}`,
                              borderRadius: '10px',
                              background: 1 === currentPage 
                                ? `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`
                                : `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
                              color: 1 === currentPage ? 'white' : colors.gray600,
                              fontSize: '14px',
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
                              width: '44px',
                              height: '44px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: colors.gray500,
                              fontSize: '14px',
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
                              width: '44px',
                              height: '44px',
                              border: `2px solid ${isCurrentPage ? colors.secondary : colors.gray300}`,
                              borderRadius: '10px',
                              background: isCurrentPage 
                                ? `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`
                                : `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
                              color: isCurrentPage ? 'white' : colors.gray600,
                              fontSize: '14px',
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
                              width: '44px',
                              height: '44px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: colors.gray500,
                              fontSize: '14px',
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
                              width: '44px',
                              height: '44px',
                              border: `2px solid ${totalPages === currentPage ? colors.secondary : colors.gray300}`,
                              borderRadius: '10px',
                              background: totalPages === currentPage 
                                ? `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`
                                : `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
                              color: totalPages === currentPage ? 'white' : colors.gray600,
                              fontSize: '14px',
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
                      padding: '10px 16px',
                      border: `2px solid ${currentPage === totalPages ? colors.gray400 : colors.secondary}`,
                      borderRadius: '10px',
                      background: currentPage === totalPages 
                        ? colors.gray100 
                        : `linear-gradient(135deg, ${colors.white} 0%, ${colors.secondary}05 100%)`,
                      color: currentPage === totalPages ? colors.gray400 : colors.secondary,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
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
        />

        {/* Status Change Modal */}
        <AnimatePresence>
          {showStatusModal && (
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
                backgroundColor: 'rgba(3, 91, 113, 0.4)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -20 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25 
                }}
                style={{
                  background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
                  borderRadius: '24px',
                  padding: '32px',
                  width: '480px',
                  maxWidth: '90vw',
                  boxShadow: `0 25px 50px -12px ${colors.primary}20`,
                  border: `2px solid ${colors.primary}20`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '120px',
                  height: '120px',
                  background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`,
                  borderRadius: '50%'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '80px',
                  height: '80px',
                  background: `radial-gradient(circle, ${colors.success}10 0%, transparent 70%)`,
                  borderRadius: '50%'
                }} />

                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: `0 4px 12px ${colors.primary}30`
                  }}>
                    <Check size={24} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      margin: '0 0 4px 0'
                    }}>
                      Ubah Status Penawaran
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: colors.gray500,
                      margin: 0
                    }}>
                      Perbarui status penawaran pelanggan
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div style={{
                  background: `linear-gradient(135deg, ${colors.light}20 0%, ${colors.secondary}08 100%)`,
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: `1px solid ${colors.primary}15`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
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
                      {selectedStatusItem?.namaPelanggan?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: '600', 
                        color: colors.primary,
                        marginBottom: '2px'
                      }}>
                        {selectedStatusItem?.namaPelanggan}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: colors.gray500 
                      }}>
                        No. Kontrak: {selectedStatusItem?.nomorKontrak}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Filter size={16} />
                    Status Baru
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: `2px solid ${colors.primary}30`,
                      borderRadius: '14px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: colors.white,
                      transition: 'all 0.3s ease',
                      color: colors.gray700,
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.secondary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${colors.primary}30`;
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="Menunggu">🟡 Menunggu</option>
                    <option value="Disetujui">🟢 Disetujui</option>
                    <option value="Ditolak">🔴 Ditolak</option>
                  </motion.select>
                </div>

                {/* Rejection Note */}
                <AnimatePresence>
                  {newStatus === 'Ditolak' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        marginBottom: '24px',
                        overflow: 'hidden'
                      }}
                    >
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: colors.primary,
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 16h.01M12 8v4" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        </svg>
                        Catatan Penolakan <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <motion.textarea
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        value={statusCatatan}
                        onChange={(e) => setStatusCatatan(e.target.value)}
                        placeholder="Masukkan alasan penolakan..."
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: `2px solid ${colors.primary}30`,
                          borderRadius: '14px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: colors.white,
                          resize: 'vertical',
                          minHeight: '100px',
                          transition: 'all 0.3s ease',
                          color: colors.gray700,
                          fontFamily: 'inherit'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = colors.secondary;
                          e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = `${colors.primary}30`;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          fontSize: '12px',
                          color: colors.gray500,
                          margin: '8px 0 0 0'
                        }}
                      >
                        Catatan wajib diisi untuk status Ditolak
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '8px'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseStatusModal}
                    style={{
                      padding: '14px 28px',
                      background: `linear-gradient(135deg, ${colors.gray100} 0%, ${colors.gray200} 100%)`,
                      color: colors.gray700,
                      border: 'none',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 2px 8px ${colors.gray300}30`
                    }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      scale: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) ? 1 : 1.05,
                      y: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) ? 0 : -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStatusChange}
                    disabled={!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())}
                    style={{
                      padding: '14px 28px',
                      background: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) 
                        ? `linear-gradient(135deg, ${colors.gray300} 0%, ${colors.gray400} 100%)`
                        : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      cursor: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) 
                        ? 'none' 
                        : `0 4px 15px ${colors.secondary}40`
                    }}
                  >
                    Simpan Perubahan
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
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
                  backgroundColor: 'white',
                  borderRadius: '24px',
                  padding: '40px',
                  textAlign: 'center',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '400px',
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
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 24px auto',
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
                      width: '48px', 
                      height: '48px', 
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
                    margin: '0 0 12px 0',
                    fontSize: '24px',
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
                    margin: '0 0 32px 0',
                    fontSize: '16px',
                    color: colors.accent1,
                    lineHeight: '1.5',
                    opacity: 0.9
                  }}
                >
                  {successMessage}
                </motion.p>
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSuccessModal(false)}
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: `0 8px 25px rgba(63, 186, 140, 0.3)`,
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.02em'
                  }}
                >
                  Tutup
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
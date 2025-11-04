import React, { useState, useEffect } from 'react';
import { Eye, Filter, Calendar, RotateCcw, Search, MapPin } from 'lucide-react';
import Detail from './Detail';
import { penawaranAPI, getUserData } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function untuk konversi diskon
const convertDiscountToPercentage = (discount) => {
  console.log("🔄 convertDiscountToPercentage input:", discount, "type:", typeof discount);
  
  if (!discount && discount !== 0) {
    console.log("🔄 convertDiscountToPercentage returning 0% for null/undefined");
    return '0%';
  }
  
  const numericValue = parseFloat(discount);
  console.log("🔄 convertDiscountToPercentage parsed numeric:", numericValue);
  
  if (numericValue === 10) {
    console.log("🔄 convertDiscountToPercentage returning MB Niaga");
    return '10% (MB Niaga)';
  } else if (numericValue === 20) {
    console.log("🔄 convertDiscountToPercentage returning GM SBU");
    return '20% (GM SBU)';
  } else if (numericValue === 0) {
    console.log("🔄 convertDiscountToPercentage returning 0%");
    return '0%';
  }
  
  console.log("🔄 convertDiscountToPercentage returning generic percentage:", numericValue + '%');
  return numericValue + '%';
};

// Helper function untuk format tanggal
const formatTanggal = (tanggal) => {
  if (!tanggal) return '-';
  
  if (tanggal.includes('-')) return tanggal;
  
  return tanggal.replace(/\//g, '-');
};

const Index = () => {
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState(null);

  // State untuk data dari API
  const [penawaranData, setPenawaranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk focused field
  const [focusedField, setFocusedField] = useState('');

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

  // Styles untuk input
  const inputStyle = (fieldName) => ({
    padding: '16px 16px 16px 48px',
    borderRadius: '12px',
    border: `2px solid ${focusedField === fieldName ? colors.secondary : 'rgba(3, 91, 113, 0.38)'}`,
    fontSize: '14px',
    backgroundColor: focusedField === fieldName ? 'rgba(0, 191, 202, 0.05)' : '#ffffff',
    color: colors.primary,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    boxShadow: focusedField === fieldName 
      ? `0 0 0 3px rgba(0, 191, 202, 0.1)` 
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    fontFamily: "'Open Sans', sans-serif !important",
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(focusedField === fieldName ? colors.secondary : colors.primary)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '20px'
  });

  const iconContainerStyle = (fieldName) => ({
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: focusedField === fieldName ? colors.secondary : colors.primary,
    transition: 'color 0.3s ease',
    zIndex: 1
  });

  // Fetch data penawaran dari API
  const fetchPenawaranData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = getUserData();
      if (!userData) {
        throw new Error('User tidak terautentikasi. Silakan login kembali.');
      }
      
      console.log("📋 Fetching penawaran data for Aktivasi:", userData.email_user);

      const result = await penawaranAPI.getAll();
      
      if (result.success) {
        const transformedData = result.data.map(item => {
          try {
            console.log("🔧 Transforming item:", item.id_penawaran, "diskon:", item.diskon, "lokasi:", item.lokasi_pelanggan);
            
            const originalDate = new Date(item.tanggal_dibuat).toLocaleDateString('id-ID');
            const formattedTanggal = formatTanggal(originalDate);
            
            const transformedItem = {
              id: item.id_penawaran,
              id_penawaran: item.id_penawaran,
              tanggal: formattedTanggal,
              namaPelanggan: item.nama_pelanggan,
              lokasiPelanggan: item.lokasi_pelanggan || '-',
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
            console.log("🔧 Transformed item:", transformedItem.id, "tanggal:", transformedItem.tanggal, "diskon:", transformedItem.diskon, "display:", transformedItem.discount, "lokasi:", transformedItem.lokasiPelanggan);
            return transformedItem;
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
              diskon: 0,
              discount: '0%',
              durasi: item.durasi_kontrak || '-',
              status: 'Error',
              actions: ['view'],
              rawData: item
            };
          }
        });
        
        setPenawaranData(transformedData);
        console.log("✅ Data penawaran berhasil dimuat:", transformedData.length, "items");
      } else {
        throw new Error(result.message || 'Gagal memuat data penawaran');
      }
    } catch (error) {
      console.error("❌ Error fetching penawaran data:", error);
      setError(error.message);
      setPenawaranData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPenawaranData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data berdasarkan search term dan filter lainnya
  const filteredData = penawaranData.filter(item => {
    // Search filter - mencari di semua kolom yang relevan
    const matchesSearch = !searchTerm || 
      item.namaPelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasiPelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaSales.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorKontrak.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referensi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    // Date filter
    let matchesDate = true;
    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      
      let itemDateObj;
      if (item.rawData?.tanggal_dibuat) {
        itemDateObj = new Date(item.rawData.tanggal_dibuat);
      } else {
        const [day, month, year] = item.tanggal.split('-');
        itemDateObj = new Date(`${year}-${month}-${day}`);
      }
      
      filterDateObj.setHours(0, 0, 0, 0);
      itemDateObj.setHours(0, 0, 0, 0);
      
      matchesDate = itemDateObj.getTime() === filterDateObj.getTime();
    }

    return matchesSearch && matchesDate;
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

  // Handler untuk refresh/reset filter
  const handleRefresh = () => {
    setFilterDate('');
    setFilterStatus('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handler untuk detail data
  const handleDetailData = (item) => {
    setSelectedDetailData(item);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedDetailData(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#e7f3f5ff',
      padding: '24px',
      fontFamily: "'Open Sans', sans-serif !important",
      position: 'relative'
    }}>
      
      <style>
      {`
        .search-input::placeholder {
          color: ${colors.gray500};
          opacity: 1;
          font-family: 'Open Sans', sans-serif;
        }
        
        .search-input::-ms-input-placeholder {
          color: ${colors.gray500};
          font-family: 'Open Sans', sans-serif;
        }
        
        .search-input::-webkit-input-placeholder {
          color: ${colors.gray500};
          font-family: 'Open Sans', sans-serif;
        }
      `}
      </style>

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
              border: `2px solid ${colors.secondary}`,
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
              border: `2px solid ${colors.success}`,
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(20px, 1fr))',
                gap: '24px',
                alignItems: 'end',
                position: 'relative',
              }}>
                {/* Search Filter */}
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
                    <Search size={16} />
                    Cari Penawaran
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari sesuatu..."
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
                      fontFamily: "'Open Sans', sans-serif !important",
                    }}
                    className="search-input"
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
                    Filter By Tanggal
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #035b71',
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

                {/* Refresh Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                  <button
                    onClick={handleRefresh}
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
                  Daftar Penawaran - Aktivasi
                </h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  tableLayout: 'fixed'
                }}>
                  <thead>
                    <tr style={{
                      background: `linear-gradient(135deg, ${colors.light}60 0%, ${colors.gray100} 100%)`
                    }}>
                      <th style={{
                        padding: '20px 12px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '60px',
                        minWidth: '60px'
                      }}>
                        No.
                      </th>
                      <th style={{
                        padding: '20px 12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '120px',
                        minWidth: '120px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={16} />
                          Tanggal
                        </div>
                      </th>
                      <th style={{
                        padding: '20px 12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '20%',
                        minWidth: '180px'
                      }}>
                        Nama Pelanggan
                      </th>
                      {/* Lokasi Pelanggan */}
                      <th style={{
                        padding: '20px 12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '15%',
                        minWidth: '150px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={16} />
                          Lokasi Pelanggan
                        </div>
                      </th>
                      <th style={{
                        padding: '20px 12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '15%',
                        minWidth: '120px'
                      }}>
                        Sales
                      </th>
                      <th style={{
                        padding: '20px 12px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `2px solid ${colors.primary}`,
                        width: '100px',
                        minWidth: '100px'
                      }}>
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
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
                            padding: '20px 12px',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                            verticalAlign: 'middle'
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
                            padding: '20px 12px',
                            fontSize: '14px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                            verticalAlign: 'middle'
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
                            padding: '20px 12px',
                            fontSize: '14px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                            verticalAlign: 'middle',
                            wordWrap: 'break-word'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              minHeight: '40px'
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
                                boxShadow: `0 4px 12px ${colors.success}25`,
                                flexShrink: 0
                              }}>
                                {item.namaPelanggan.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ 
                                  fontWeight: '600', 
                                  marginBottom: '2px',
                                  wordBreak: 'break-word'
                                }}>
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
                          {/* Lokasi Pelanggan */}
                          <td style={{
                            padding: '20px 12px',
                            fontSize: '14px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                            verticalAlign: 'middle',
                            wordWrap: 'break-word'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <MapPin size={16} color={colors.tertiary} />
                              <div style={{
                                background: `${colors.gray100}`,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontFamily: "'Open Sans', sans-serif !important",
                                border: `1px solid ${colors.primary}`,
                                display: 'inline-block',
                                maxWidth: '100%',
                                wordBreak: 'break-word'
                              }}>
                                {item.lokasiPelanggan}
                              </div>
                            </div>
                          </td>
                          <td style={{
                            padding: '20px 12px',
                            fontSize: '14px',
                            color: colors.primary,
                            borderBottom: `2px solid ${colors.gray200}`,
                            verticalAlign: 'middle',
                            wordWrap: 'break-word'
                          }}>
                            <div style={{
                              background: `${colors.gray100}`,
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontFamily: "'Open Sans', sans-serif !important",
                              border: `1px solid ${colors.primary}`,
                              display: 'inline-block',
                              maxWidth: '100%',
                              wordBreak: 'break-word'
                            }}>
                              {item.namaSales}
                            </div>
                          </td>
                          <td style={{
                            padding: '20px 12px',
                            textAlign: 'center',
                            borderBottom: `2px solid ${colors.gray200}`,
                            verticalAlign: 'middle'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}>
                              {/* View Button */}
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

              {/* Pagination */}
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
      </div>
    </div>
  );
};

export default Index;

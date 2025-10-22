import React, { useState, useEffect } from 'react';
import { Eye, RotateCcw, Filter, Calendar, Check, X, Settings, Tag, DollarSign } from 'lucide-react';
import Detail from './Detail';
import { penawaranAPI, getUserData } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function untuk konversi diskon
const convertDiscountToPercentage = (discount) => {
  console.log("🔄 convertDiscountToPercentage input:", discount, "type:", typeof discount);
  
  // Handle null, undefined, atau empty values
  if (!discount && discount !== 0) {
    console.log("🔄 convertDiscountToPercentage returning 0% for null/undefined");
    return '0%';
  }
  
  // Convert numeric discount to display format
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
  
  // For any other numeric value, show as percentage
  console.log("🔄 convertDiscountToPercentage returning generic percentage:", numericValue + '%');
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
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatusItem, setSelectedStatusItem] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusCatatan, setStatusCatatan] = useState('');
  
  // State untuk discount modal
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedDiscountItem, setSelectedDiscountItem] = useState(null);
  const [newDiscount, setNewDiscount] = useState('');

  // State untuk success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Styles untuk input dan select sesuai template
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
      
      // Check if user is authenticated
      const userData = getUserData();
      if (!userData) {
        throw new Error('User tidak terautentikasi. Silakan login kembali.');
      }
      
      console.log("📋 Fetching penawaran data for Admin:", userData.email_user);

      const result = await penawaranAPI.getAll();
      
      if (result.success) {
        // Transform data dari API ke format yang digunakan di frontend
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

  const filteredData = penawaranData.filter(item => {
    // Format filter date untuk matching dengan format DD-MM-YYYY
    const formattedFilterDate = filterDate ? formatTanggal(new Date(filterDate).toLocaleDateString('id-ID')) : '';
    const matchesDate = filterDate ? item.tanggal.includes(formattedFilterDate) : true;
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
    setStatusCatatan('');
    setShowStatusModal(true);
  };

  const handleStatusChange = async () => {
    if (!selectedStatusItem || !newStatus) return;
    
    if (newStatus === 'Ditolak' && !statusCatatan.trim()) {
      alert('Catatan wajib diisi untuk status Ditolak');
      return;
    }
    
    try {
      console.log("📝 Updating status for penawaran:", selectedStatusItem.id, "to:", newStatus);
      
      let finalCatatan;
      if (newStatus === 'Ditolak' && statusCatatan.trim()) {
        finalCatatan = `Status ditolak oleh Admin. Alasan: ${statusCatatan}`;
      } else {
        finalCatatan = `Status diubah oleh Admin menjadi ${newStatus}`;
      }
      
      const response = await fetch(`http://localhost:3000/api/penawaran/${selectedStatusItem.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': getUserData().id_user.toString(),
          'X-User-Role': getUserData().role_user,
          'X-User-Email': getUserData().email_user
        },
        body: JSON.stringify({
          status: newStatus,
          catatan: finalCatatan
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setPenawaranData(prevData =>
          prevData.map(item =>
            item.id === selectedStatusItem.id
              ? { ...item, status: newStatus }
              : item
          )
        );
        
        console.log("✅ Status updated successfully:", result.data);
        
        // Tampilkan success modal
        showSuccessMessage(`Status penawaran berhasil diubah menjadi "${newStatus}"`);
        fetchPenawaranData();
        
      } else {
        throw new Error(result.message || 'Failed to update status');
      }
      
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert(`Gagal mengubah status: ${error.message}`);
    } finally {
      setShowStatusModal(false);
      setSelectedStatusItem(null);
      setNewStatus('');
    }
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setSelectedStatusItem(null);
    setNewStatus('');
  };

  // Discount handlers
  const handleDiscountClick = (item) => {
    setSelectedDiscountItem(item);
    
    const numericDiscount = parseFloat(item.diskon);
    let initialDiscount;
    
    if (numericDiscount === 10) {
      initialDiscount = '10%';
    } else if (numericDiscount === 20) {
      initialDiscount = '20%';
    } else {
      initialDiscount = '0%';
    }
    
    setNewDiscount(initialDiscount);
    setShowDiscountModal(true);
  };

  const handleDiscountSelectChange = (e) => {
    setNewDiscount(e.target.value);
  };

  const isDiscountUnchanged = () => {
    if (!newDiscount || !selectedDiscountItem) return true;
    
    const currentNumericDiscount = parseFloat(selectedDiscountItem.diskon);
    
    return (
      (newDiscount === '0%' && currentNumericDiscount === 0) ||
      (newDiscount === '10%' && currentNumericDiscount === 10) ||
      (newDiscount === '20%' && currentNumericDiscount === 20)
    );
  };

  const handleDiscountChange = async () => {
    if (!selectedDiscountItem || newDiscount === null || newDiscount === undefined) {
      console.log("❌ Missing data:", { selectedDiscountItem, newDiscount });
      return;
    }
    
    try {
      console.log("📝 Updating discount for penawaran:", selectedDiscountItem.id, "to:", newDiscount);
      
      const userData = getUserData();
      const response = await fetch(`http://localhost:3000/api/penawaran/${selectedDiscountItem.id}/discount`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userData.id_user.toString(),
          'X-User-Role': userData.role_user,
          'X-User-Email': userData.email_user
        },
        body: JSON.stringify({
          discount: newDiscount,
          catatan: `Discount diubah oleh Admin menjadi ${newDiscount}`
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Tampilkan success modal
        showSuccessMessage(`Discount penawaran berhasil diubah menjadi "${newDiscount}"`);
        
        setShowDiscountModal(false);
        setSelectedDiscountItem(null);
        setNewDiscount('');
        fetchPenawaranData();
        
      } else {
        throw new Error(result.message || 'Failed to update discount');
      }
      
    } catch (error) {
      console.error("❌ Error updating discount:", error);
      alert(`Gagal mengubah discount: ${error.message}`);
    }
  };

  const handleCloseDiscountModal = () => {
    setShowDiscountModal(false);
    setSelectedDiscountItem(null);
    setNewDiscount('');
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

      {/* Custom Styles Dropdown */}
      <style>
        {`
          /* Style untuk select dropdown */
          select {
            font-family: "'Open Sans', sans-serif !important";
          }
          
          select:focus {
            background-color: rgba(0, 191, 202, 0.05) !important;
          }
          
          /* Style untuk dropdown options */
          select option {
            background-color: #e7f3f5ff !important;
            color: #035b71 !important;
            padding: 12px 16px !important;
            font-size: 14px !important;
            font-family: "'Open Sans', sans-serif !important";
            border-bottom: 1px solid rgba(3, 91, 113, 0.1) !important;
            transition: all 0.3s ease !important;
          }
          
          select option:hover {
            background-color: rgba(0, 191, 202, 0.1) !important;
            color: #035b71 !important;
          }
          
          select option:checked {
            background: linear-gradient(135deg, #00bfca 0%, #00a2b9 100%) !important;
            color: white !important;
            font-weight: 600 !important;
          }
          
          select option:first-child {
            border-radius: 8px 8px 0 0 !important;
          }
          
          select option:last-child {
            border-radius: 0 0 8px 8px !important;
          }
          
          /* Style untuk select ketika dropdown terbuka */
          select:focus option {
            background-color: #e7f3f5ff !important;
          }

          /* Custom scrollbar untuk dropdown */
          select::-webkit-scrollbar {
            width: 8px;
          }
          
          select::-webkit-scrollbar-track {
            background: rgba(0, 191, 202, 0.1);
            border-radius: 10px;
          }
          
          select::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%);
            border-radius: 10px;
          }
          
          select::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.primary} 100%);
          }
        `}
      </style>

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
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('filterStatus')}>
                      <Filter size={18} />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      onFocus={() => setFocusedField('filterStatus')}
                      onBlur={() => setFocusedField('')}
                      style={inputStyle('filterStatus')}
                    >
                      <option value="">Semua Status</option>
                      <option value="Menunggu">Menunggu</option>
                      <option value="Disetujui">Disetujui</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>
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
                            color: colors.gray700,
                            borderBottom: `2px solid ${colors.gray200}`,
                          }}>
                            <button
                              onClick={() => handleDiscountClick(item)}
                              style={{
                                background: `linear-gradient(135deg, ${colors.tertiary}15 0%, ${colors.tertiary}25 100%)`,
                                color: colors.tertiary,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: `1px solid ${colors.primary}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: `0 2px 8px ${colors.tertiary}20`,
                                fontWeight: '600'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = colors.tertiary;
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = `0 4px 12px ${colors.tertiary}40`;
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = `linear-gradient(135deg, ${colors.tertiary}15 0%, ${colors.tertiary}25 100%)`;
                                e.target.style.color = colors.tertiary;
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = `0 2px 8px ${colors.tertiary}20`;
                              }}
                              title="Klik untuk mengubah discount"
                            >
                              {convertDiscountToPercentage(item.diskon)}
                            </button>
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
                backgroundColor: 'rgba(3, 91, 113, 0.3)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  y: 0,
                  rotate: [0, 0.5, -0.5, 0]
                }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
                style={{
                  background: '#e7f3f5ff',
                  borderRadius: '32px',
                  width: '100%',
                  maxWidth: '500px',
                  maxHeight: '90vh',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Decorative highlight */}
                <div style={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '120px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0))',
                  pointerEvents: 'none'
                }} />

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseStatusModal}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(3, 91, 113, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(3, 91, 113, 0.2)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(3, 91, 113, 0.1)'}
                >
                  <X size={20} color={colors.primary} />
                </motion.button>

                {/* Scrollable Container */}
                <div className="custom-scrollbar" style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '20px'
                }}>
                  {/* Header */}
                  <motion.div 
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{
                      padding: '20px 12px 20px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: `0 10px 30px rgba(0, 191, 202, 0.3)`
                    }}>
                      <Settings size={32} color="white" />
                    </div>
                    <h2 style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      margin: 0,
                      letterSpacing: '-0.02em'
                    }}>
                      Ubah Status Penawaran
                    </h2>
                    <p style={{
                      color: colors.accent1,
                      fontSize: '16px',
                      margin: '8px 0 0',
                      opacity: 0.8
                    }}>
                      Perbarui status penawaran pelanggan
                    </p>
                  </motion.div>

                  {/* Form */}
                  <motion.form 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                      background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                      borderRadius: '20px',
                      padding: '32px',
                      margin: '0 20px 20px',
                      border: '1px solid rgba(0, 192, 202, 0.68)',
                      position: 'relative'
                    }}
                  >
                    {/* Customer Info */}
                    <div style={{
                      background: `linear-gradient(135deg, ${colors.light}20 0%, ${colors.secondary}08 100%)`,
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '24px',
                      border: '1px solid rgba(3, 91, 113, 0.3)'
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
                    <motion.div 
                      whileHover={{ y: -2 }}
                      style={{
                        marginBottom: '24px',
                        position: 'relative'
                      }}
                    >
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: colors.primary,
                        marginBottom: '12px',
                        letterSpacing: '0.02em'
                      }}>
                        Status Baru *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div style={iconContainerStyle('status')}>
                          <Tag size={18} />
                        </div>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          onFocus={() => setFocusedField('status')}
                          onBlur={() => setFocusedField('')}
                          required
                          style={inputStyle('status')}
                        >
                          <option value="" disabled hidden>Pilih status</option>
                          <option value="Menunggu">🟡 Menunggu</option>
                          <option value="Disetujui">🟢 Disetujui</option>
                          <option value="Ditolak">🔴 Ditolak</option>
                        </select>
                      </div>
                    </motion.div>

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
                            letterSpacing: '0.02em',
                          }}>
                            Catatan Penolakan <span style={{ color: '#EF4444' }}>*</span>
                          </label>
                          <motion.textarea
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            value={statusCatatan}
                            onChange={(e) => setStatusCatatan(e.target.value)}
                            placeholder="Masukkan alasan penolakan..."
                            onFocus={() => setFocusedField('catatan')}
                            onBlur={() => setFocusedField('')}
                            style={{
                              width: '100%',
                              padding: '16px',
                              border: `2px solid ${focusedField === 'catatan' ? colors.secondary : 'rgba(3, 91, 113, 0.38)'}`,
                              borderRadius: '12px',
                              fontSize: '14px',
                              backgroundColor: focusedField === 'catatan' ? 'rgba(0, 191, 202, 0.05)' : '#f0f4f5',
                              resize: 'vertical',
                              minHeight: '100px',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              color: colors.primary,
                              fontFamily: 'inherit',
                              outline: 'none',
                              boxShadow: focusedField === 'catatan' 
                                ? `0 0 0 3px rgba(0, 191, 202, 0.1)` 
                                : '0 1px 3px rgba(0, 0, 0, 0.1)'
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
                      justifyContent: 'flex-end',
                      gap: '16px',
                      marginTop: '32px'
                    }}>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleCloseStatusModal}
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                          color: '#ffffff',
                          border: 'none',
                          padding: '16px 32px',
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(3, 91, 113, 0.3)',
                          transition: 'all 0.3s ease',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Batal
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleStatusChange}
                        disabled={!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())}
                        style={{
                          background: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim()))
                            ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                            : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                          color: '#ffffff',
                          border: 'none',
                          padding: '16px 40px',
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 20px rgba(0, 191, 202, 0.4)',
                          transition: 'all 0.3s ease',
                          letterSpacing: '0.02em',
                          opacity: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) ? 0.8 : 1
                        }}
                      >
                        Simpan Status
                      </motion.button>
                    </div>
                  </motion.form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Edit Discount */}
        <AnimatePresence>
          {showDiscountModal && (
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
                zIndex: 1000,
                padding: '20px'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  y: 0,
                  rotate: [0, 0.5, -0.5, 0]
                }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
                style={{
                  background: '#e7f3f5ff',
                  borderRadius: '32px',
                  width: '100%',
                  maxWidth: '500px',
                  maxHeight: '90vh',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Decorative highlight */}
                <div style={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '120px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0))',
                  pointerEvents: 'none'
                }} />

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseDiscountModal}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(3, 91, 113, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(3, 91, 113, 0.2)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(3, 91, 113, 0.1)'}
                >
                  <X size={20} color={colors.primary} />
                </motion.button>

                {/* Scrollable Container */}
                <div className="custom-scrollbar" style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '20px'
                }}>
                  {/* Header */}
                  <motion.div 
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{
                      padding: '20px 12px 20px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.accent1} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: `0 10px 30px rgba(0, 162, 185, 0.3)`
                    }}>
                      <DollarSign size={32} color="white" />
                    </div>
                    <h2 style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.accent1} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      margin: 0,
                      letterSpacing: '-0.02em'
                    }}>
                      Edit Discount
                    </h2>
                    <p style={{
                      color: colors.accent1,
                      fontSize: '16px',
                      margin: '8px 0 0',
                      opacity: 0.8
                    }}>
                      Atur persentase discount penawaran
                    </p>
                  </motion.div>

                  {/* Form */}
                  <motion.form 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                      background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                      borderRadius: '20px',
                      padding: '32px',
                      margin: '0 20px 20px',
                      border: '1px solid rgba(0, 192, 202, 0.68)',
                      position: 'relative'
                    }}
                  >
                    {/* Customer Info */}
                    <div style={{
                      background: `linear-gradient(135deg, ${colors.light}20 0%, ${colors.tertiary}08 100%)`,
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '24px',
                      border: '1px solid rgba(3, 91, 113, 0.3)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.accent1} 100%)`,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '700',
                          boxShadow: `0 4px 12px ${colors.tertiary}25`
                        }}>
                          {selectedDiscountItem?.namaPelanggan?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: colors.primary,
                            marginBottom: '2px'
                          }}>
                            {selectedDiscountItem?.namaPelanggan}
                          </div>
                          <div style={{ 
                            fontSize: '13px', 
                            color: colors.gray500 
                          }}>
                            No. Kontrak: {selectedDiscountItem?.nomorKontrak}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Discount Selection */}
                    <motion.div 
                      whileHover={{ y: -2 }}
                      style={{
                        marginBottom: '32px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '18px'
                      }}>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: colors.primary,
                          letterSpacing: '0.02em'
                        }}>
                          Pilih Discount *
                        </label>
                        
                        {/* Discount Info */}
                        {newDiscount && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                              padding: '6px 12px',
                              background: `linear-gradient(135deg, ${colors.light}20 0%, ${colors.tertiary}08 100%)`,
                              borderRadius: '8px',
                              border: '1px solid rgba(3, 91, 113, 0.3)'
                            }}
                          >
                            <div style={{
                              fontSize: '12px',
                              color: colors.tertiary,
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4M12 8h.01"/>
                              </svg>
                              Terpilih: {newDiscount}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div style={{ position: 'relative' }}>
                        <div style={iconContainerStyle('discount')}>
                          <DollarSign size={18} />
                        </div>
                        <select
                          value={newDiscount}
                          onChange={handleDiscountSelectChange}
                          onFocus={() => setFocusedField('discount')}
                          onBlur={() => setFocusedField('')}
                          required
                          style={inputStyle('discount')}
                        >
                          <option value="" disabled hidden>Pilih discount...</option>
                          <option value="0%">0%</option>
                          <option value="10%">10% - MB Niaga</option>
                          <option value="20%">20% - GM SBU</option>
                        </select>
                      </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      justifyContent: 'flex-end' 
                    }}>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleCloseDiscountModal}
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                          color: '#ffffff',
                          border: 'none',
                          padding: '16px 32px',
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(3, 91, 113, 0.3)',
                          transition: 'all 0.3s ease',
                          letterSpacing: '0.02em'
                        }}
                      >
                        Batal
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleDiscountChange}
                        disabled={isDiscountUnchanged()}
                        style={{
                          background: isDiscountUnchanged()
                            ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                            : `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.accent1} 100%)`,
                          color: '#ffffff',
                          border: 'none',
                          padding: '16px 40px',
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: isDiscountUnchanged() ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 20px rgba(0, 162, 185, 0.4)',
                          transition: 'all 0.3s ease',
                          letterSpacing: '0.02em',
                          opacity: isDiscountUnchanged() ? 0.8 : 1
                        }}
                      >
                        Simpan Discount
                      </motion.button>
                    </div>
                  </motion.form>
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

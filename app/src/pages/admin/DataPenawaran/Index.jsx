import React, { useState, useEffect } from 'react';
import { Eye, RotateCcw } from 'lucide-react';
import Detail from './Detail';
import { penawaranAPI, getUserData } from '../../../utils/api';

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

const Index = () => {
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatusItem, setSelectedStatusItem] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusCatatan, setStatusCatatan] = useState(''); // State untuk catatan status
  
  // State untuk discount modal
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedDiscountItem, setSelectedDiscountItem] = useState(null);
  const [newDiscount, setNewDiscount] = useState('');

  // State untuk data dari API
  const [penawaranData, setPenawaranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
            const transformedItem = {
              id: item.id_penawaran,
              id_penawaran: item.id_penawaran, // Add this for Detail component
              tanggal: new Date(item.tanggal_dibuat).toLocaleDateString('id-ID'),
              namaPelanggan: item.nama_pelanggan,
              namaSales: item.data_user?.nama_user || '-', // Get sales name from relasi data_user
              sales: item.data_user?.nama_user || '-', // Get sales name from relasi data_user
              nomorKontrak: item.nomor_kontrak,
              kontrakKe: item.kontrak_tahun,
              referensi: item.wilayah_hjt,
              diskon: item.diskon, // Preserve the raw numeric value for editing
              discount: convertDiscountToPercentage(item.diskon), // Display format
              durasi: item.durasi_kontrak,
              status: item.status || 'Menunggu',
              actions: ['view'],
              // Tambahan data untuk komponen Detail
              rawData: item // Data mentah dari API untuk keperluan Detail component
            };
            console.log("🔧 Transformed item:", transformedItem.id, "diskon:", transformedItem.diskon, "display:", transformedItem.discount);
            return transformedItem;
          } catch (itemError) {
            console.error('❌ Error transforming item:', item, itemError);
            // Return a safe fallback for this item
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
              diskon: 0, // Preserve numeric value
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
      setPenawaranData([]); // Set empty array on error
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

  const handleStatusClick = (item) => {
    setSelectedStatusItem(item);
    setNewStatus(item.status);
    setStatusCatatan(''); // Reset catatan
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
        finalCatatan = `Status ditolak oleh Admin. Alasan: ${statusCatatan}`;
      } else {
        finalCatatan = `Status diubah oleh Admin menjadi ${newStatus}`;
      }
      
      // Call API to update status
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
        // Update local state dengan data dari API
        setPenawaranData(prevData =>
          prevData.map(item =>
            item.id === selectedStatusItem.id
              ? { ...item, status: newStatus }
              : item
          )
        );
        
        console.log("✅ Status updated successfully:", result.data);
        
        // Show success message (you can replace this with a toast notification)
        alert(`Status penawaran berhasil diubah menjadi "${newStatus}"`);
        
        // Refresh data untuk memastikan sinkronisasi dengan database
        fetchPenawaranData();
        
      } else {
        throw new Error(result.message || 'Failed to update status');
      }
      
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert(`Gagal mengubah status: ${error.message}`);
    } finally {
      // Close modal regardless of success/failure
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
    
    // Convert numeric discount back to selection value
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
      console.log("📝 User data:", getUserData());
      
      // Call API to update discount
      const userData = getUserData();
      console.log("📝 About to make API call with user data:", userData);
      console.log("📝 Request body:", JSON.stringify({
        discount: newDiscount,
        catatan: `Discount diubah oleh Admin menjadi ${newDiscount}`
      }));
      
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

      console.log("📝 Response status:", response.status);
      console.log("📝 Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error text:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("📝 Response result:", result);
      
      if (result.success) {
        console.log("✅ API Update successful, result:", result);
        
        // Show success message
        alert(`Discount penawaran berhasil diubah menjadi "${newDiscount}"`);
        
        // Close modal first
        setShowDiscountModal(false);
        setSelectedDiscountItem(null);
        setNewDiscount('');
        
        // Refresh data untuk memastikan sinkronisasi dengan database
        console.log("🔄 Refreshing data from database...");
        fetchPenawaranData();
        
      } else {
        throw new Error(result.message || 'Failed to update discount');
      }
      
    } catch (error) {
      console.error("❌ Error updating discount:", error);
      alert(`Gagal mengubah discount: ${error.message}`);
    }
    // Don't close modal here in case user wants to retry
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
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        };
      case 'Disetujui':
        return {
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        };
      case 'Ditolak':
        return {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          color: '#374151',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        };
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Loading State */}
      {isLoading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          fontSize: '16px',
          color: '#6B7280'
        }}>
          Memuat data penawaran...
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '1px solid #FECACA',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          color: '#DC2626'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchPenawaranData}
            style={{
              marginLeft: '16px',
              padding: '8px 16px',
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Main Content - hanya tampil jika tidak loading dan tidak error */}
      {!isLoading && !error && (
        <>
      {/* Filter Section */}  
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        alignItems: 'end',
        marginBottom: '20px'
      }}>
        {/* Left side - Filters */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'end',
          flexWrap: 'wrap'
        }}>
          {/* Filter by Date */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <label style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Filter by Tanggal
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
            />
          </div>

          {/* Filter by Status */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <label style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
            >
              <option value="">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Right side - Reset Filter Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          paddingRight: '24px'
        }}>
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
              padding: '10px 20px',
              backgroundColor: '#00AEEF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#0097A7';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#00AEEF';
            }}
          >
            <RotateCcw style={{ width: '16px', height: '16px' }} />
            Reset Filter
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>No</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Tanggal</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Nama Pelanggan</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Sales</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Nomor Kontrak/BAKB</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Kontrak Ke-</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Referensi</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Discount</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Durasi Kontrak (in thn)</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Status</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id} style={{
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {startIndex + index + 1}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.tanggal}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.namaPelanggan}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.namaSales}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.nomorKontrak}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.kontrakKe}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.referensi}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    <button
                      onClick={() => handleDiscountClick(item)}
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #D1D5DB',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#E5E7EB';
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#F3F4F6';
                        e.target.style.transform = 'scale(1)';
                      }}
                      title="Klik untuk mengubah discount"
                    >
                      {convertDiscountToPercentage(item.diskon)} {/* Changed from 'discount' to 'diskon' */}
                    </button>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.durasi}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    <button
                      onClick={() => handleStatusClick(item)}
                      style={{
                        ...getStatusStyle(item.status),
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
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
                    padding: '12px 16px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => handleDetailData(item)}
                        style={{
                          backgroundColor: '#e0f2fe',
                          color: '#0284c7',
                          padding: '6px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#bae6fd';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#e0f2fe';
                        }}
                        title="View Details"
                      >
                        <Eye style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
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
          padding: '16px',
          backgroundColor: '#F9FAFB',
          borderTop: '1px solid #E5E7EB'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#6B7280'
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
                padding: '8px 12px',
                backgroundColor: currentPage === 1 ? '#F3F4F6' : '#FFFFFF',
                color: currentPage === 1 ? '#9CA3AF' : '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: page === currentPage ? '#3B82F6' : '#FFFFFF',
                  color: page === currentPage ? '#FFFFFF' : '#374151',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  minWidth: '40px'
                }}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                backgroundColor: currentPage === totalPages ? '#F3F4F6' : '#FFFFFF',
                color: currentPage === totalPages ? '#9CA3AF' : '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

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
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '400px',
            maxWidth: '90vw',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0'
            }}>
              Ubah Status Penawaran
            </h3>
            
            <div style={{
              marginBottom: '16px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '0 0 8px 0'
              }}>
                Pelanggan: <strong>{selectedStatusItem?.namaPelanggan}</strong>
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '0 0 16px 0'
              }}>
                Nomor Kontrak: <strong>{selectedStatusItem?.nomorKontrak}</strong>
              </p>
            </div>

            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Status Baru:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00AEEF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                }}
              >
                <option value="Menunggu">Menunggu</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>

            {newStatus === 'Ditolak' && (
              <div style={{
                marginBottom: '20px'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Catatan Penolakan <span style={{ color: '#DC2626' }}>*</span>:
                </label>
                <textarea
                  value={statusCatatan}
                  onChange={(e) => setStatusCatatan(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    resize: 'vertical',
                    minHeight: '80px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00AEEF';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                  }}
                />
                <p style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  margin: '4px 0 0 0'
                }}>
                  Catatan wajib diisi untuk status Ditolak
                </p>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCloseStatusModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#E5E7EB';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#F3F4F6';
                }}
              >
                Batal
              </button>
              <button
                onClick={handleStatusChange}
                disabled={!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())}
                style={{
                  padding: '10px 20px',
                  backgroundColor: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) ? '#D1D5DB' : '#00AEEF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: (!newStatus || newStatus === selectedStatusItem?.status || (newStatus === 'Ditolak' && !statusCatatan.trim())) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (newStatus && newStatus !== selectedStatusItem?.status && !(newStatus === 'Ditolak' && !statusCatatan.trim())) {
                    e.target.style.backgroundColor = '#0097A7';
                  }
                }}
                onMouseOut={(e) => {
                  if (newStatus && newStatus !== selectedStatusItem?.status && !(newStatus === 'Ditolak' && !statusCatatan.trim())) {
                    e.target.style.backgroundColor = '#00AEEF';
                  }
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Discount */}
      {showDiscountModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseDiscountModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              width: '500px',
              maxWidth: '90vw',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              margin: '0 0 20px 0', 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#1F2937'
            }}>
              Edit Discount
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Pilih Discount:
              </label>
              <select
                value={newDiscount}
                onChange={handleDiscountSelectChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00AEEF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                }}
              >
                <option value="">Pilih discount...</option>
                <option value="0%">0%</option>
                <option value="10%">10% (MB Niaga)</option>
                <option value="20%">20% (GM SBU)</option>
              </select>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={handleCloseDiscountModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#E5E7EB';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#F3F4F6';
                }}
              >
                Batal
              </button>
              <button
                onClick={handleDiscountChange}
                disabled={isDiscountUnchanged()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isDiscountUnchanged() ? '#D1D5DB' : '#00AEEF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isDiscountUnchanged() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!isDiscountUnchanged()) {
                    e.target.style.backgroundColor = '#0097A7';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isDiscountUnchanged()) {
                    e.target.style.backgroundColor = '#00AEEF';
                  }
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default Index;

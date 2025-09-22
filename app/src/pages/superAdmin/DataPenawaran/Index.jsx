import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Eye, RotateCcw } from 'lucide-react';
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
        // Transform data dari API ke format yang digunakan di frontend
        const transformedData = result.data.map(item => {
          try {
            return {
              id: item.id_penawaran,
              id_penawaran: item.id_penawaran, // Add this for Detail component
              tanggal: new Date(item.tanggal_dibuat).toLocaleDateString('id-ID'),
              namaPelanggan: item.nama_pelanggan,
              namaSales: item.data_user?.nama_user || '-', // Get sales name from relasi data_user
              sales: item.data_user?.nama_user || '-', // Get sales name from relasi data_user
              nomorKontrak: item.nomor_kontrak,
              kontrakKe: item.kontrak_tahun,
              referensi: item.wilayah_hjt,
              discount: convertDiscountToPercentage(item.diskon),
              durasi: item.durasi_kontrak,
              targetIRR: item.target_irr || '0',
              status: item.status || 'Menunggu',
              actions: ['view'],
              // Data lengkap untuk detail
              rawData: item
            };
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
        console.log("✅ SuperAdmin penawaran data fetched successfully:", transformedData.length, "records");
      } else {
        throw new Error(result.message || 'Gagal mengambil data penawaran');
      }
    } catch (err) {
      console.error('❌ Error fetching penawaran data:', err);
      setError(err.message);
      setPenawaranData([]);
      
      // If authentication error, redirect to login
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
        finalCatatan = `Status ditolak oleh SuperAdmin. Alasan: ${statusCatatan}`;
      } else {
        finalCatatan = `Status diubah oleh SuperAdmin menjadi ${newStatus}`;
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
    setStatusCatatan(''); // Reset catatan saat modal ditutup
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
        padding: '20px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}>
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
      {isLoading ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          color: '#6B7280'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #E5E7EB',
              borderTop: '3px solid #00AEEF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px'
            }}></div>
            Memuat data penawaran...
          </div>
        </div>
      ) : error ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          color: '#EF4444',
          backgroundColor: '#FEF2F2',
          borderLeft: '4px solid #EF4444'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
              Error memuat data
            </div>
            <div style={{ fontSize: '14px' }}>
              {error}
            </div>
            <button
              onClick={fetchPenawaranData}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : (
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
                }}>Nama Sales</th>
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
                }}>Durasi</th>
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
                    {item.discount}
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
      </div>
    </>
  );
};

export default Index;

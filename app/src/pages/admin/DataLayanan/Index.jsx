import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Plus, RotateCcw } from 'lucide-react';
import TambahLayanan from './TambahLayanan';
import EditLayanan from './EditLayanan';
import DetailLayanan from './DetailLayanan';
import HapusLayanan from './HapusLayanan'; 

const Index = () => {
  const [filterHJT, setFilterHJT] = useState('');
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showHapusModal, setShowHapusModal] = useState(false);

  const [layananData, setLayananData] = useState([]);

  useEffect(() => {
    fetchLayanan();
  }, []);

  const fetchLayanan = async () => {
    try {
      console.log("🔍 Fetching layanan data from API");
      
      const response = await fetch('http://localhost:3000/api/layanan/public');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      console.log("📦 API response:", result);
      
      const data = Array.isArray(result) ? result : result.data || [];
      
      // Map data dari database ke format yang diharapkan UI
      const sanitizedLayanan = data.map(item => ({
        id: item.id_layanan || item.id,
        hjt: item.wilayah_hjt || item.hjt,
        namaLayanan: item.nama_layanan || item.namaLayanan,
        satuan: item.satuan,
        backbone: item.backbone?.toString() || '0',
        port: item.port?.toString() || '0',
        tarifAkses: item.tarif_akses?.toString() || '0',
        tarif: item.tarif?.toString() || '0'
      }));

      console.log("✅ Sanitized layanan data:", sanitizedLayanan);
      setLayananData(sanitizedLayanan);
    } catch (error) {
      console.error("❌ Gagal mengambil data layanan:", error);
      // Fallback ke data static jika API gagal
      setLayananData([]);
    }
  };

  const handleOpenModal = () => {
    setShowTambahModal(true);
  };

  const handleCloseModal = () => {
    setShowTambahModal(false);
  };

  const handleSaveData = async (newData) => {
    try {
      console.log("💾 Saving new layanan:", newData);
      
      const response = await fetch('http://localhost:3000/api/layanan/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_layanan: newData.namaLayanan,
          wilayah_hjt: newData.hjt,
          satuan: newData.satuan,
          backbone: parseFloat(newData.backbone) || 0,
          port: parseFloat(newData.port) || 0,
          tarif_akses: parseFloat(newData.tarifAkses) || 0,
          tarif: parseFloat(newData.tarif) || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Layanan created:", result);

      // Refresh data
      await fetchLayanan();
      
      // Don't close modal here - let TambahLayanan handle success modal first
      // handleCloseModal(); // Commented out to allow success modal to show
    } catch (error) {
      console.error("❌ Gagal menyimpan layanan:", error);
      // Re-throw error so TambahLayanan can handle it  
      throw error;
    }
  };

  const handleOpenEditModal = (layanan) => {
    setSelectedLayanan(layanan);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedLayanan(null);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      console.log("📝 Updating layanan:", selectedLayanan?.id, "with data:", updatedData);
      
      if (!selectedLayanan?.id) {
        throw new Error("Layanan ID tidak ditemukan");
      }

      const response = await fetch(`http://localhost:3000/api/layanan/public/${selectedLayanan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_layanan: updatedData.namaLayanan,
          wilayah_hjt: updatedData.hjt,
          satuan: updatedData.satuan,
          backbone: parseFloat(updatedData.backbone) || 0,
          port: parseFloat(updatedData.port) || 0,
          tarif_akses: parseFloat(updatedData.tarifAkses) || 0,
          tarif: parseFloat(updatedData.tarif) || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Layanan updated:", result);

      // Refresh data
      await fetchLayanan();
      handleCloseEditModal();
    } catch (error) {
      console.error("❌ Gagal mengupdate layanan:", error);
      alert(`Gagal mengupdate layanan: ${error.message}`);
    }
  };

  const handleOpenDetailModal = (layanan) => {
    setSelectedLayanan(layanan);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLayanan(null);
  };

  const handleOpenDeleteModal = (layanan) => {
    setSelectedLayanan(layanan);
    setShowHapusModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowHapusModal(false);
    setSelectedLayanan(null);
  };

  const handleDeleteConfirm = async (layananId) => {
    try {
      console.log("🗑️ Deleting layanan with ID:", layananId);
      
      const response = await fetch(`http://localhost:3000/api/layanan/public/${layananId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Layanan deleted:", result);

      // Refresh data
      await fetchLayanan();
      
      // Don't close modal here - let HapusLayanan handle success modal first
      // handleCloseDeleteModal(); // Commented out to allow success modal to show
    } catch (error) {
      console.error("❌ Gagal menghapus layanan:", error);
      // Re-throw error so HapusLayanan can handle it
      throw error;
    }
  };

  const handleReset = () => {
    setFilterHJT('');
  };

  // Filter dan pagination logic
  const filteredData = layananData.filter(item => {
    const hjtMatch = filterHJT === '' || item.hjt === filterHJT;
    return hjtMatch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get unique HJT values for filter
  const uniqueHJT = [...new Set(layananData.map(item => item.hjt))];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <select
                  value={filterHJT}
                  onChange={(e) => setFilterHJT(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    minWidth: '150px'
                  }}
                >
                  <option value="">Semua HJT</option>
                  {uniqueHJT.map(hjt => (
                    <option key={hjt} value={hjt}>{hjt}</option>
                  ))}
                </select>

                <button
                  onClick={handleReset}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>

              <button
                onClick={handleOpenModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#00AEEF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0088CC'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#00AEEF'}
              >
                <Plus size={16} />
                Tambah Layanan
              </button>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  No
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  HJT
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Nama Layanan
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Satuan
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Backbone
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Port
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Tarif Akses
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Tarif
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id} style={{
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
                >
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
                    {item.hjt}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.namaLayanan}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.satuan}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.backbone}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.port}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.tarifAkses}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {item.tarif}
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
                        onClick={() => handleOpenDetailModal(item)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                        title="Lihat Detail"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(item)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
              color: currentPage === 1 ? '#9ca3af' : '#374151',
              fontSize: '14px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            &lt; Previous
          </button>

          {(() => {
            const maxVisiblePages = 17;
            const halfVisible = Math.floor(maxVisiblePages / 2);
            let startPage = Math.max(1, currentPage - halfVisible);
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            // Adjust start page if we're near the end
            if (endPage - startPage < maxVisiblePages - 1) {
              startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            const pages = [];
            
            // Add first page and ellipsis if needed
            if (startPage > 1) {
              pages.push(
                <button
                  key={1}
                  onClick={() => handlePageChange(1)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 1 === currentPage ? '#00AEEF' : 'white',
                    color: 1 === currentPage ? 'white' : '#374151',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '40px'
                  }}
                >
                  1
                </button>
              );
              
              if (startPage > 2) {
                pages.push(
                  <span
                    key="ellipsis-start"
                    style={{
                      padding: '8px 4px',
                      color: '#6b7280',
                      fontSize: '14px'
                    }}
                  >
                    ...
                  </span>
                );
              }
            }

            // Add visible page range
            for (let page = startPage; page <= endPage; page++) {
              if (page === 1 && startPage === 1) continue; // Skip if already added
              
              const isCurrentPage = page === currentPage;
              pages.push(
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: isCurrentPage ? '#00AEEF' : 'white',
                    color: isCurrentPage ? 'white' : '#374151',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '40px'
                  }}
                >
                  {page}
                </button>
              );
            }

            // Add ellipsis and last page if needed
            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pages.push(
                  <span
                    key="ellipsis-end"
                    style={{
                      padding: '8px 4px',
                      color: '#6b7280',
                      fontSize: '14px'
                    }}
                  >
                    ...
                  </span>
                );
              }
              
              pages.push(
                <button
                  key={totalPages}
                  onClick={() => handlePageChange(totalPages)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: totalPages === currentPage ? '#00AEEF' : 'white',
                    color: totalPages === currentPage ? 'white' : '#374151',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '40px'
                  }}
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
              color: currentPage === totalPages ? '#9ca3af' : '#374151',
              fontSize: '14px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Next &gt;
          </button>
        </div>
      </div>

      {showTambahModal && (
        <TambahLayanan
          isOpen={showTambahModal}
          onClose={handleCloseModal}
          onSave={handleSaveData}
        />
      )}
      {showEditModal && (
        <EditLayanan
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          initialData={selectedLayanan} 
        />
      )}
      {showDetailModal && (
        <DetailLayanan
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          initialData={selectedLayanan} 
        />
      )}
      {showHapusModal && (
        <HapusLayanan
          isOpen={showHapusModal}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteConfirm}
          initialData={selectedLayanan}
        />
      )}
    </div>
  );
};

export default Index;

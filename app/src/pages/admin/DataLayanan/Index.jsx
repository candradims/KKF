import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Plus, RotateCcw } from 'lucide-react';
import TambahLayanan from './TambahLayanan';
import EditLayanan from './EditLayanan';
import DetailLayanan from './DetailLayanan';

const Index = () => {
  const [filterHJT, setFilterHJT] = useState('');
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [layananData, setLayananData] = useState([
    {
        id: 1,
        hjt: 'Sumatra',
        namaLayanan: 'IP VPN (1 sd 10 Mbps)',
        satuan: 'Mbps',
        backbone: '76600',
        port: '0',
        tarifAkses: '1585000',
        tarif: '0'
    },
    {
        id: 2,
        hjt: 'Jawa Bali',
        namaLayanan: 'IP VPN (1 sd 10 Mbps)',
        satuan: 'Mbps',
        backbone: '33800',
        port: '0',
        tarifAkses: '1151000',
        tarif: '0'
    },
    {
        id: 3,
        hjt: 'Jabodetabek',
        namaLayanan: 'IP VPN (1 sd 10 Mbps)',
        satuan: 'Mbps',
        backbone: '18700',
        port: '0',
        tarifAkses: '872000',
        tarif: '0'
    },
    {
        id: 4,
        hjt: 'Intim',
        namaLayanan: 'IP VPN (1 sd 10 Mbps)',
        satuan: 'Mbps',
        backbone: '112700',
        port: '0',
        tarifAkses: '1742000',
        tarif: '0'
    },
    {
        id: 5,
        hjt: 'Sumatra',
        namaLayanan: 'IP VPN (11 sd 50 Mbps)',
        satuan: 'Mbps',
        backbone: '73300',
        port: '0',
        tarifAkses: '1585000',
        tarif: '0'
    },
    {
        id: 6,
        hjt: 'Jawa Bali',
        namaLayanan: 'IP VPN (11 sd 50 Mbps)',
        satuan: 'Mbps',
        backbone: '32400',
        port: '0',
        tarifAkses: '1151000',
        tarif: '0'
    },
    {
        id: 7,
        hjt: 'Jabodetabek',
        namaLayanan: 'IP VPN (11 sd 50 Mbps)',
        satuan: 'Mbps',
        backbone: '17900',
        port: '0',
        tarifAkses: '872000',
        tarif: '0'
    },
    {
        id: 8,
        hjt: 'Intim',
        namaLayanan: 'IP VPN (11 sd 50 Mbps)',
        satuan: 'Mbps',
        backbone: '107900',
        port: '0',
        tarifAkses: '1742000',
        tarif: '0'
    },
    {
        id: 9,
        hjt: 'Sumatra',
        namaLayanan: 'IP VPN Premium (2 Mbps)',
        satuan: 'Units',
        backbone: '0',
        port: '0',
        tarifAkses: '0',
        tarif: '11610000'
    },
    {
        id: 10,
        hjt: 'Jawa Bali',
        namaLayanan: 'IP VPN Premium (2 Mbps)',
        satuan: 'Units',
        backbone: '0',
        port: '0',
        tarifAkses: '0',
        tarif: '11610000'
    },
    {
        id: 11,
        hjt: 'Jabodetabek',
        namaLayanan: 'IP VPN Premium (2 Mbps)',
        satuan: 'Units',
        backbone: '0',
        port: '0',
        tarifAkses: '0',
        tarif: '11610000'
    },
    {
        id: 12,
        hjt: 'Intim',
        namaLayanan: 'IP VPN Premium (2 Mbps)',
        satuan: 'Units',
        backbone: '0',
        port: '0',
        tarifAkses: '0',
        tarif: '11610000'
    }
    ]);


  const handleOpenModal = () => {
    setShowTambahModal(true);
  };

  const handleCloseModal = () => {
    setShowTambahModal(false);
  };

  const handleOpenEditModal = (layanan) => {
    setSelectedLayanan(layanan);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedLayanan(null);
  };

  const handleOpenDetailModal = (layanan) => {
    setSelectedLayanan(layanan);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLayanan(null);
  };

  const handleSaveEdit = (updatedLayanan) => {
    setLayananData(prev => 
      prev.map(layanan => 
        layanan.id === updatedLayanan.id ? updatedLayanan : layanan
      )
    );
    setShowEditModal(false);
    setSelectedLayanan(null);
  };

  const handleSaveData = (newDataLayanan) => {
    const newId = layananData.length > 0 ? Math.max(...layananData.map(item => item.id)) + 1 : 1;
    
    const newLayanan = {id: newId,...newDataLayanan,};
    setLayananData(prev => [...prev, newLayanan]);
    setShowTambahModal(false);
  };


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLayanan = layananData.filter(layanan => {
    if (filterHJT && layanan.hjt !== filterHJT) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredLayanan.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLayanan = filteredLayanan.slice(startIndex, endIndex);

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

  const handleRefresh = () => {
    setFilterHJT('');
    setCurrentPage(1);
  };

   const formatCurrency = (value) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numericValue) && numericValue !== null) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(numericValue);
    }
    return value;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px',
      fontFamily: 'Inter, sans-serif'
    }} className="min-h-screen bg-gray-50 p-6 font-inter">
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto'
      }} className="max-w-7xl mx-auto">
        <div style={{
          marginBottom: '24px'
        }} className="mb-6">
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
            <button
            onClick={handleOpenModal} 
              style={{
                backgroundColor: '#00AEEF',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap'
              }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2 transition-colors">
              <Plus style={{ width: '16px', height: '16px' }} className="w-4 h-4" />
              Tambah Layanan
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          marginBottom: '24px'
        }} className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            alignItems: 'end'
          }} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

            {/* Filter By HJT */}
            <div>
            <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
            }} className="block text-sm font-medium text-gray-700 mb-1.5">
                Filter By HJT
            </label>
            <select
                value={filterHJT}
                onChange={(e) => setFilterHJT(e.target.value)}
                style={{
                width: '50%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">-- Pilih HJT --</option>
                <option value="Jawa Bali">Jawa Bali</option>
                <option value="Jabodetabek">Jabodetabek</option>
                <option value="Sumatra">Sumatra</option>
                <option value="Intim">Intim</option>
            </select>
            </div>

            {/* Refresh Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleRefresh}
                style={{
                  backgroundColor: '#00AEEF',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap'
                }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2 transition-colors">
                <RotateCcw style={{ width: '16px', height: '16px' }} className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }} className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div style={{ overflowX: 'auto' }} className="overflow-x-auto">
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #e5e7eb'
            }} className="w-full">
              <thead style={{ backgroundColor: '#e0f2fe' }} className="bg-blue-50">
                <tr>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    width: '10px'
                  }}>
                    No.
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }}>
                    Wilayah HJT
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }}>
                    Nama Layanan
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }}>
                    Satuan
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }}>
                    Backbone
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }}>
                    Port
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }}>
                    Tarif Akses
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }}>
                    Tarif
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }}>
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentLayanan.map((layanan, index) => (
                  <tr key={layanan.id} style={{
                    borderBottom: '1px solid #f3f4f6'
                  }} className="border-b border-gray-100 hover:bg-gray-50">
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }}>
                      {startIndex + index + 1}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }}>
                      {layanan.hjt}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }}>
                      {layanan.namaLayanan}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }}>
                      {layanan.satuan}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }}>
                      {layanan.backbone}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }}>
                      {layanan.port}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }}>
                      {formatCurrency(layanan.tarifAkses)}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }}>
                      {formatCurrency(layanan.tarif)}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }} className="flex items-center justify-center gap-2">
                        {/* Tombol Detail/View */}
                        <button
                          onClick={() => handleOpenDetailModal(layanan)}
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
                          }}>
                          <Eye style={{ width: '14px', height: '14px' }} />
                        </button>
                        {/* Tombol Edit */}
                        <button
                          onClick={() => handleOpenEditModal(layanan)}
                          style={{
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                            padding: '6px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                          }}>
                          <Edit2 style={{ width: '14px', height: '14px' }} />
                        </button>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleOpenDeleteModal(layanan)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            padding: '6px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                          }}>
                          <Trash2 style={{ width: '14px', height: '14px' }} />
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

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;

              return (
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
            })}

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
    </div>
  );
};

export default Index;

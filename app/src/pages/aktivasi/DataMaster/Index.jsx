import React, { useState, useEffect } from 'react';
import { getAuthHeaders, getUserData } from '../../../utils/api';
import { Eye, Edit2, Trash2, Plus, FileSpreadsheet, RotateCcw, Search, Package, Filter, Calendar } from 'lucide-react';
import TambahData from './Tambah';
import EditData from './Edit';
import DetailData from './Detail';
import HapusData from './Hapus';
import ImportData from './Import';

const Index = () => {
  const [filterSatuan, setFilterSatuan] = useState('');
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingData, setDeletingData] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [masterData, setMasterData] = useState([]);

  // Derived history lists for select options (unique values)
  const satuanOptions = Array.from(new Set(masterData.map(d => d.satuan).filter(Boolean)));
  const pemasanganOptions = Array.from(new Set(masterData.map(d => d.pemasangan).filter(Boolean)));

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

  useEffect(() => {
    fetchMasterData();
  }, []);

  // Listen for fallback events from child components (in case onUpdate prop is missing after a merge)
  useEffect(() => {
    const onFallbackUpdate = async (e) => {
      try {
        console.log('🟡 Fallback update event received, detail:', e.detail);
        await handleUpdateData(e.detail);
      } catch (err) {
        console.error('Fallback update failed:', err);
        alert(`Gagal mengupdate data (fallback): ${err.message}`);
      }
    };

    window.addEventListener('aktivasi:update', onFallbackUpdate);
    return () => window.removeEventListener('aktivasi:update', onFallbackUpdate);
  }, []);

  const fetchMasterData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/master-aktivasi');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      
      const data = Array.isArray(result) ? result : result.data || [];

      const sortedData = data.sort((a, b) => {
      const idA = a.id_master_aktivasi || a.id_master || a.id;
      const idB = b.id_master_aktivasi || b.id_master || b.id;
        return idB - idA;
      });
      const sanitizedData = data.map(item => ({
        id: item.id_master_aktivasi || item.id_master || item.id,
        service: item.service || '',
        satuan: item.satuan || '',
        // harga_satuan is numeric in the DB; display formatted currency
        harga_satuan: formatCurrency(item.harga_satuan) || '0',
        pemasangan: item.pemasangan || '0',
        originalHargaSatuan: item.harga_satuan || 0,
        originalPemasangan: item.pemasangan || '',
        actions: ['view', 'edit', 'delete'],
      }));
      
      setMasterData(sanitizedData);
    } catch (error) {
      console.error("Gagal mengambil data master:", error);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
  };


  const handleOpenModal = () => {
    setShowTambahModal(true);
  };

  const handleCloseModal = () => {
    setShowTambahModal(false);
  };

  const handleOpenEditModal = (data) => {
    console.log('Opening Edit modal with data:', data);
    setEditingData(data);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingData(null);
  };

  const handleOpenDetailModal = (data) => {
    setDetailData(data);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailData(null);
  };

  const handleOpenDeleteModal = (data) => {
    setDeletingData(data);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingData(null);
  };

  const handleSaveData = async (newData) => {
    try {
      console.log("📝 Frontend - Creating new master data:", newData);
      
      const parseNumberField = (val) => {
        if (val === null || val === undefined || val === '') return 0;
        if (typeof val === 'number') return Math.floor(val);
        if (typeof val === 'string') return parseInt(val.replace(/[^\d]/g, '')) || 0;
        const n = Number(val);
        return Number.isFinite(n) ? Math.floor(n) : 0;
      };

      const requestBody = {
        service: newData.service,
        satuan: newData.satuan,
        pemasangan: newData.pemasangan,
        harga_satuan: parseNumberField(newData.harga_satuan),
      };

      console.log("📝 Frontend - Final request body:", requestBody);

      // Ensure user is authenticated and include auth headers
      const userData = getUserData();
      if (!userData) {
        throw new Error('Pengguna belum terotentikasi');
      }
      const headers = getAuthHeaders();

      const response = await fetch('http://localhost:3000/api/master-aktivasi', {
        method: 'POST',
        headers: {
          ...headers
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      console.log("📝 Frontend - Create response:", result);

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        const addedData = result.data;

        const formattedData = {
          id: addedData.id_master_aktivasi || addedData.id_master || addedData.id,
          service: addedData.service,
          satuan: addedData.satuan,
          harga_satuan: formatCurrency(addedData.harga_satuan),
          pemasangan: addedData.pemasangan,
          actions: ['view', 'edit', 'delete']
        };

        setMasterData(prevData => [...prevData, formattedData]);
        setShowTambahModal(false);
        
        // Refresh data
        fetchMasterData();
        
        return result;
      } else {
        throw new Error(result.message || 'Gagal menambah data master');
      }
    } catch (error) {
      console.error('Gagal menambah data master:', error);
      throw error;
    }
  };

  const handleUpdateData = async (updatedData) => {
    try {
      console.log("📝 Frontend - Updating master data:", editingData);
      console.log("📝 Frontend - Update data received:", updatedData);

      // Accept id either from parent editingData state or from updatedData (fallback dispatched event)
  const idToUse = (editingData && editingData.id) || updatedData.id || updatedData.id_master || updatedData.id_master_aktivasi || (updatedData.initialData && (updatedData.initialData.id || updatedData.initialData.id_master || updatedData.initialData.id_master_aktivasi));
      if (!idToUse) {
        throw new Error("Data ID tidak ditemukan");
      }

      const parseNumberField2 = (val) => {
        if (val === null || val === undefined || val === '') return 0;
        if (typeof val === 'number') return Math.floor(val);
        if (typeof val === 'string') return parseInt(val.replace(/[^\d]/g, '')) || 0;
        const n = Number(val);
        return Number.isFinite(n) ? Math.floor(n) : 0;
      };

      const hargaCandidate =
        (updatedData && (updatedData.harga_satuan ?? updatedData.hargaSatuan)) ||
        (updatedData && updatedData.initialData && (updatedData.initialData.harga_satuan ?? updatedData.initialData.hargaSatuan ?? updatedData.initialData.originalHargaSatuan)) ||
        (editingData && (editingData.originalHargaSatuan ?? editingData.harga_satuan)) ||
        0;

      const updatePayload = {
        service: updatedData.service ?? (editingData && editingData.service) ?? '',
        satuan: updatedData.satuan ?? (editingData && editingData.satuan) ?? '',
        pemasangan: updatedData.pemasangan ?? (editingData && editingData.pemasangan) ?? '',
        harga_satuan: parseNumberField2(hargaCandidate),
      };

      console.log('📝 Frontend - Resolved hargaCandidate:', hargaCandidate, '-> harga_satuan:', updatePayload.harga_satuan);

      console.log("📝 Frontend - Final payload:", updatePayload);

      // Ensure user is authenticated and include auth headers
      const userData = getUserData();
      if (!userData) {
        throw new Error('Pengguna belum terotentikasi');
      }
      const headers = getAuthHeaders();

      const response = await fetch(`http://localhost:3000/api/master-aktivasi/${idToUse}`, {
        method: 'PUT',
        headers: {
          ...headers
        },
        body: JSON.stringify(updatePayload),
      });

      console.log("📝 Frontend - Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Frontend - API Error:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Frontend - Update response:", result);

      // Refresh data from server to get latest state
      await fetchMasterData();

      // Tutup modal
      setShowEditModal(false);
      setEditingData(null);
      
      console.log("✅ Data master berhasil diupdate");
    } catch (error) {
      console.error("❌ Gagal mengupdate data master:", error);
      alert(`Gagal mengupdate data master: ${error.message}`);
    }
  };

  const handleDeleteData = async (dataId) => {
    try {
      console.log("🗑️ Deleting master data with ID:", dataId);
      
      // Ensure authenticated
      const userData = getUserData();
      if (!userData) {
        throw new Error('Pengguna belum terotentikasi');
      }
      const headers = getAuthHeaders();

      const response = await fetch(`http://localhost:3000/api/master-aktivasi/${dataId}`, {
        method: 'DELETE',
        headers: {
          ...headers
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Delete response:", result);

      // Update UI dengan menghapus data dari state
      setMasterData(prevData => prevData.filter(data => data.id !== dataId));
      
      // Tutup modal
      handleCloseDeleteModal();
      
      console.log("✅ Data master berhasil dihapus dari database dan UI");
    } catch (error) {
      console.error("❌ Gagal menghapus data master:", error);
      alert(`Gagal menghapus data master: ${error.message}`);
    }
  };

  const handleOpenImportModal = () => {
    setShowImportModal(true);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleImportData = async () => {
    try {
      console.log('✅ Import berhasil! Melakukan refresh data dari database...');
      
      // Fetch ulang semua data dari database
      await fetchMasterData();
      
      // Tutup modal import
      setShowImportModal(false);
      
      console.log('✅ Data berhasil di-refresh dan ditampilkan!');
    } catch (error) {
      console.error('❌ Error saat refresh data setelah import:', error);
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = masterData.filter(data => {
    // Search filter
    const matchesSearch = !searchTerm || 
      data.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.satuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.harga_satuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.pemasangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.originalHargaSatuan.toString().includes(searchTerm);

    // Satuan filter (values come from DB column master_aktivasi.satuan)
    const matchesSatuan = !filterSatuan || (data.satuan || '').toLowerCase().includes(filterSatuan.toLowerCase());

    return matchesSearch && matchesSatuan;
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

  const handleRefresh = () => {
    setFilterSatuan('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getPemasanganBadgeStyle = (pemasangan) => {
  const normalizedPemasangan = pemasangan ? pemasangan.toString().toLowerCase().trim() : '';
  
    switch(normalizedPemasangan) {
      case 'konvensional':
        return {
          backgroundColor: `${colors.primary}15`,
          color: colors.primary,
          border: `1px solid ${colors.primary}`
        };
      case 'ftth':
        return {
          backgroundColor: `${colors.secondary}15`,
          color: colors.secondary,
          border: `1px solid ${colors.secondary}`
        };
      default:
        return {
          backgroundColor: `${colors.gray400}15`,
          color: colors.gray600,
          border: `1px solid ${colors.gray400}`
        };
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#e7f3f5ff',
      padding: '60px 48px 10px 48px',
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
          color: ${colors.gray550};
          font-family: 'Open Sans', sans-serif;
        }
        
        .search-input::-webkit-input-placeholder {
          color: ${colors.gray550};
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

      <div style={{ maxWidth: '1800px', margin: '0 auto', position: 'relative' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px', marginTop: '0' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: `0 4px 20px ${colors.primary}10`,
              border: '1px solid #035b71',
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
                  <Package size={24} />
                </div>
                <div>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: colors.primary,
                    margin: '0 0 4px 0'
                  }}>
                    {masterData.length}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: colors.gray600,
                    margin: 0
                  }}>
                    Total Data Master
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: `0 4px 20px ${colors.primary}10`,
              border: '1px solid #035b71',
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

        {/* Filter Section */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
          borderRadius: '20px',
          padding: '28px',
          boxShadow: `0 8px 32px ${colors.primary}08`,
          border: '1px solid #035b71',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(20px, 1fr))',
            gap: '24px',
            alignItems: 'end',
            position: 'relative',
          }}>
            {/* Filter Search */}
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
                Cari Data
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari sesuatu..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border:'1px solid #035b71',
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
                  e.target.style.borderColor = colors.secondary;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Filter By Service */}
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
                Filter By Satuan
              </label>
              <select
                value={filterSatuan}
                onChange={(e) => setFilterSatuan(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px ',
                  border:'1px solid #035b71',
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
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.secondary;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.secondary;
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Semua Satuan</option>
                {satuanOptions.length === 0 && (
                  <option value="" disabled>Tidak ada data</option>
                )}
                {satuanOptions.map((satuan, idx) => (
                  <option key={idx} value={satuan}>{satuan}</option>
                ))}
              </select>
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

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end', 
          marginBottom: '24px'
        }}>
          <button 
            onClick={handleOpenImportModal}
            style={{
              background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.accent1} 100%)`,
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
              boxShadow: `0 4px 15px ${colors.tertiary}30`,
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 6px 20px ${colors.tertiary}40`;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 15px ${colors.tertiary}30`;
            }}
          >
            <FileSpreadsheet size={16} />
            Import Data Master
          </button>
          
          <button
            onClick={handleOpenModal}
            style={{
              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
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
              boxShadow: `0 4px 15px ${colors.secondary}30`,
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 6px 20px ${colors.secondary}40`;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 15px ${colors.secondary}30`;
            }}
          >
            <Plus size={16} />
            Tambah Data Master
          </button>
        </div>

        {/* Table Section */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: `0 12px 40px ${colors.primary}08`,
          border: '1px solid #035b71',
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
              Data Master Aktivasi
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
                    borderBottom: `2px solid #035b71`,
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
                    borderBottom: `2px solid #035b71`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={16} />
                      Service
                    </div>
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71`,
                  }}>
                    Satuan
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71`,
                  }}>
                    Harga Satuan
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71`,
                  }}>
                    Pemasangan
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71`,
                    width: '150px'
                  }}>
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
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
                        <Package size={48} style={{ color: colors.gray300 }} />
                        <span>Tidak ada data yang ditemukan</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((data, index) => (
                    <tr
                      key={data.id}
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
                        borderBottom: `2px solid #035b71`,
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
                        borderBottom: `2px solid #035b71`,
                      }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}>
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                              {data.service}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.primary,
                        borderBottom: `2px solid #035b71`,
                      }}>
                        <span style={{
                          background: `${colors.gray100}`,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontFamily: "'Open Sans', sans-serif !important",
                          border: `1px solid ${colors.primary}`,
                          display: 'inline-block'
                        }}>
                          {data.satuan}
                        </span>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.primary,
                        borderBottom: `2px solid #035b71`,
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
                          {data.harga_satuan}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.primary,
                        borderBottom: `2px solid #035b71`,
                      }}>
                        <div style={{
                           ...getPemasanganBadgeStyle(data.pemasangan),
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          <div style={{
                            width: '6px',
                            height: '6px',
                            background: colors.success,
                            borderRadius: '50%'
                          }} />
                          {data.pemasangan}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        textAlign: 'center',
                        borderBottom: `2px solid #035b71`,
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}>
                          {/* Tombol Detail/View */}
                          <button
                            onClick={() => handleOpenDetailModal(data)}
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
                          >
                            <Eye size={16} />
                          </button>
                          
                          {/* Tombol Edit */}
                          <button
                            onClick={() => handleOpenEditModal(data)}
                            style={{
                              background: `linear-gradient(135deg, ${colors.tertiary}15 0%, ${colors.tertiary}25 100%)`,
                              color: colors.tertiary,
                              padding: '8px',
                              borderRadius: '8px',
                              border: `1px solid ${colors.tertiary}90`,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease',
                              boxShadow: `0 2px 8px ${colors.tertiary}20`
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
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          {/* Tombol Hapus */}
                          <button
                            onClick={() => handleOpenDeleteModal(data)}
                            style={{
                              background: 'linear-gradient(135deg, #ef444415 0%, #ef444425 100%)',
                              color: '#ef4444',
                              padding: '8px',
                              borderRadius: '8px',
                              border: '1px solid #ef444490',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 8px #ef444420'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#ef4444';
                              e.target.style.color = 'white';
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px #ef444440';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #ef444415 0%, #ef444425 100%)';
                              e.target.style.color = '#ef4444';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px #ef444420';
                            }}
                          >
                            <Trash2 size={16} />
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
                border: '1px solid #035b71',
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
                  border: `2px solid ${currentPage === 1 ? '#035b71' : colors.secondary}`,
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
                  border: `2px solid ${currentPage === totalPages ?  '#035b71'  : colors.secondary}`,
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
      </div>

      <TambahData
        isOpen={showTambahModal}
        onClose={handleCloseModal}
        onSave={handleSaveData}
        satuanOptions={satuanOptions}
        pemasanganOptions={pemasanganOptions}
      />
      <EditData
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        initialData={editingData}
        satuanOptions={satuanOptions}
        pemasanganOptions={pemasanganOptions}
      />
      <DetailData
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        initialData={detailData}
      />
      <HapusData
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteData}
        initialData={deletingData}
      />
      <ImportData
        isOpen={showImportModal}
        onClose={handleCloseImportModal}
        onImport={handleImportData}
      />
    </div>
  );
};

export default Index;
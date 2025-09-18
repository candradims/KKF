import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Plus, RotateCcw, Filter, Calendar, FileSpreadsheet } from 'lucide-react';
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
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [layananData, setLayananData] = useState([]);

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
    } catch (error) {
      console.error("❌ Gagal menyimpan layanan:", error);
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
    } catch (error) {
      console.error("❌ Gagal mengupdate layanan:", error);
      alert(`Gagal mengupdate layanan: ${error.message}`);
      throw error;
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
    } catch (error) {
      console.error("❌ Gagal menghapus layanan:", error);
      throw error;
    }
  };

  const handleReset = () => {
    setFilterHJT('');
    setSearchTerm('');
  };

  const handleOpenImportModal = () => {
    setShowImportModal(true);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleImportData = async (file) => {
    console.log('Mulai mengimpor file:', file.name);
    // Implementasi import data
  };

  // Filter dan pagination logic
  const filteredData = layananData.filter(item => {
    const hjtMatch = filterHJT === '' || item.hjt === filterHJT;
    const searchMatch = !searchTerm || 
      item.namaLayanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hjt.toLowerCase().includes(searchTerm.toLowerCase());
    return hjtMatch && searchMatch;
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                  <Filter size={24} />
                </div>
                <div>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: colors.primary,
                    margin: '0 0 4px 0'
                  }}>
                    {layananData.length}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: colors.gray600,
                    margin: 0
                  }}>
                    Total Layanan
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            alignItems: 'end',
            position: 'relative',
          }}>
            {/* Search Input */}
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
                Cari Layanan
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
                  color: colors.gray700
                }}
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

            {/* Filter By HJT */}
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
                Filter By HJT
              </label>
              <select
                value={filterHJT}
                onChange={(e) => setFilterHJT(e.target.value)}
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
                  cursor: 'pointer'
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
                <option value="" disabled hidden>-- Semua HJT --</option>
                {uniqueHJT.map(hjt => (
                  <option key={hjt} value={hjt}>{hjt}</option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
              <button
                onClick={handleReset}
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

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
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
              whiteSpace: 'nowrap',
              marginBottom: '16px'
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
            Import Excel
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
              whiteSpace: 'nowrap',
              marginBottom: '16px'
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
            Tambah Layanan
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
              Daftar Layanan
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
                    borderBottom: `2px solid #035b71 `,
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
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    HJT
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    Nama Layanan
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    Satuan
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    Backbone
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    Port
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    Tarif Akses
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    Tarif
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
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
                      colSpan="9"
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
                        borderBottom: `2px solid #035b71 `,
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
                        color: colors.gray700,
                        borderBottom: `2px solid #035b71 `,
                      }}>
                        <div style={{
                          background: `${colors.gray100}`,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontFamily: "'Open Sans', sans-serif !important",
                          border: `1px solid ${colors.gray200}`,
                          display: 'inline-block',
                          fontWeight: '600',
                          color: colors.primary
                        }}>
                          {item.hjt}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.gray700,
                        borderBottom: `2px solid #035b71 `,
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
                            {item.namaLayanan.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                              {item.namaLayanan}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: colors.gray500 
                            }}>
                              Layanan
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.gray700,
                        borderBottom: `2px solid #035b71 `,
                      }}>
                        <div style={{
                          background: `${colors.gray100}`,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontFamily: "'Open Sans', sans-serif !important",
                          border: `1px solid ${colors.gray200}`,
                          display: 'inline-block'
                        }}>
                          {item.satuan}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.gray700,
                        borderBottom: `2px solid #035b71 `,
                      }}>
                        <div style={{
                          background: `${colors.gray100}`,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontFamily: "'Open Sans', sans-serif !important",
                          border: `1px solid ${colors.gray200}`,
                          display: 'inline-block'
                        }}>
                          {item.backbone}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.gray700,
                        borderBottom: `2px solid #035b71 `,
                      }}>
                        <div style={{
                          background: `${colors.gray100}`,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontFamily: "'Open Sans', sans-serif !important",
                          border: `1px solid ${colors.gray200}`,
                          display: 'inline-block'
                        }}>
                          {item.port}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.gray700,
                        borderBottom: `2px solid #035b71 `,
                      }}>
                        <div style={{
                          background: `${colors.gray100}`,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontFamily: "'Open Sans', sans-serif !important",
                          border: `1px solid ${colors.gray200}`,
                          display: 'inline-block'
                        }}>
                          {item.tarifAkses}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.gray700,
                        borderBottom: `2px solid #035b71 `,
                      }}>
                        <div style={{
                          background: `${colors.gray100}`,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontFamily: "'Open Sans', sans-serif !important",
                          border: `1px solid ${colors.gray200}`,
                          display: 'inline-block'
                        }}>
                          {item.tarif}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        textAlign: 'center',
                        borderBottom: `2px solid #035b71 `,
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}>
                          {/* Tombol Detail/View */}
                          <button
                            onClick={() => handleOpenDetailModal(item)}
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
                            onClick={() => handleOpenEditModal(item)}
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
                            onClick={() => handleOpenDeleteModal(item)}
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
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;

                  return (
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
                })}
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

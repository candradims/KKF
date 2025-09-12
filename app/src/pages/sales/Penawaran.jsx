import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Plus, RotateCcw, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Tambah from './crud-penawaran/Tambah';
import Edit from './crud-penawaran/Edit';
import Hapus from './crud-penawaran/Hapus';
import Detail from './crud-penawaran/Detail';
import { penawaranAPI, getUserData } from '../../utils/api';

const Penawaran = () => {
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEditData, setSelectedEditData] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState(null);
  const [showHapusModal, setShowHapusModal] = useState(false);
  const [selectedDeleteData, setSelectedDeleteData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State untuk data dari API
  const [penawaranData, setPenawaranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token from localStorage (assuming it's stored there after login)
  // This function is now imported from utils/api.js

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
      
      console.log("📋 Fetching penawaran data for user:", userData.email_user);

      const result = await penawaranAPI.getAll();
      
      if (result.success) {
        // Transform data dari API ke format yang digunakan di frontend
        const transformedData = result.data.map(item => ({
          id: item.id_penawaran,
          id_penawaran: item.id_penawaran, // Add this for Detail component
          tanggal: new Date(item.tanggal_dibuat).toLocaleDateString('id-ID'),
          namaPelanggan: item.nama_pelanggan,
          namaSales: item.data_user?.nama_user || "-",
          sales: item.data_user?.nama_user || "-",
          nomorKontrak: item.nomor_kontrak,
          kontrakKe: item.kontrak_tahun,
          referensi: item.wilayah_hjt,
          discount: item.diskon || '0%',
          durasi: item.durasi_kontrak,
          targetIRR: item.target_irr || '0',
          status: item.status || 'Menunggu',
          actions: ['view', 'edit', 'delete'],
          // Data lengkap untuk detail
          rawData: item
        }));
        
        setPenawaranData(transformedData);
        setError(null);
        console.log("✅ Penawaran data fetched successfully:", transformedData.length, "records");
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

  const handleTambahData = () => {
    setShowTambahModal(true);
  };

  const handleCloseModal = () => {
    setShowTambahModal(false);
  };

  const handleEditData = (item) => {
    setSelectedEditData(item);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEditData(null);
  };

  const handleSaveEditData = async (updatedData) => {
    try {
      // Check if user is authenticated
      const userData = getUserData();
      if (!userData) {
        alert('User tidak terautentikasi. Silakan login kembali.');
        return;
      }

      console.log('🔄 Updating penawaran data:', updatedData);
      console.log('🔍 Selected edit data ID:', selectedEditData.id);
      console.log('👤 Current user data:', userData);

      // Map the updated data to match API format
      const apiData = {
        tanggal: updatedData.tanggal,
        pelanggan: updatedData.pelanggan,
        nomorKontrak: updatedData.nomorKontrak,
        kontrakTahunKe: updatedData.kontrakTahunKe,
        referensiHJT: updatedData.referensiHJT,
        durasiKontrak: updatedData.durasiKontrak,
        item: updatedData.item,
        keterangan: updatedData.keterangan,
        harga: updatedData.harga,
        jumlah: updatedData.jumlah,
        discount: updatedData.discount
      };

      console.log('📤 Sending API data:', apiData);

      const result = await penawaranAPI.update(selectedEditData.id, apiData);
      
      console.log('📬 API Response:', result);
      
      if (result.success) {
        // Handle pengeluaran updates if the form had pengeluaran data
        const hasPengeluaranData = updatedData.item && updatedData.keterangan && 
                                  (updatedData.hasrat !== undefined && updatedData.hasrat !== '') && 
                                  (updatedData.jumlah !== undefined && updatedData.jumlah !== '');
        
        console.log('💰 Checking pengeluaran data:', {
          item: updatedData.item,
          keterangan: updatedData.keterangan,
          hasrat: updatedData.hasrat,
          jumlah: updatedData.jumlah,
          hasPengeluaranData
        });
        
        if (hasPengeluaranData) {
          console.log('💰 Handling pengeluaran update for penawaran ID:', selectedEditData.id);
          
          try {
            // Check if there's existing pengeluaran data
            const hasExistingPengeluaran = updatedData._hasExistingPengeluaran;
            const existingPengeluaranId = updatedData._existingPengeluaranId;
            
            const pengeluaranData = {
              id_penawaran: selectedEditData.id,
              item: updatedData.item,
              keterangan: updatedData.keterangan,
              hasrat: parseFloat(updatedData.hasrat) || 0,
              jumlah: parseInt(updatedData.jumlah) || 0
            };
            
            console.log('💰 Pengeluaran data to save:', pengeluaranData);
            console.log('💰 Has existing pengeluaran:', hasExistingPengeluaran);
            console.log('💰 Existing pengeluaran ID:', existingPengeluaranId);
            
            if (hasExistingPengeluaran && existingPengeluaranId) {
              // Update existing pengeluaran
              console.log('🔄 Updating existing pengeluaran ID:', existingPengeluaranId);
              
              const pengeluaranResult = await fetch(`http://localhost:3000/api/pengeluaran/${existingPengeluaranId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'X-User-ID': userData.id_user.toString(),
                  'X-User-Role': userData.role_user,
                  'X-User-Email': userData.email_user
                },
                body: JSON.stringify(pengeluaranData)
              });
              
              const pengeluaranResponse = await pengeluaranResult.json();
              console.log('📋 Pengeluaran update response:', pengeluaranResponse);
              
              if (pengeluaranResult.ok && pengeluaranResponse.success) {
                console.log('✅ Pengeluaran updated successfully');
              } else {
                console.error('❌ Failed to update pengeluaran:', pengeluaranResponse);
                alert(`Gagal memperbarui pengeluaran: ${pengeluaranResponse.message || 'Unknown error'}`);
              }
            } else {
              // Create new pengeluaran
              console.log('➕ Creating new pengeluaran');
              
              const pengeluaranResult = await fetch('http://localhost:3000/api/pengeluaran', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-User-ID': userData.id_user.toString(),
                  'X-User-Role': userData.role_user,
                  'X-User-Email': userData.email_user
                },
                body: JSON.stringify(pengeluaranData)
              });
              
              const pengeluaranResponse = await pengeluaranResult.json();
              console.log('📋 Pengeluaran create response:', pengeluaranResponse);
              
              if (pengeluaranResult.ok && pengeluaranResponse.success) {
                console.log('✅ Pengeluaran created successfully');
              } else {
                console.error('❌ Failed to create pengeluaran:', pengeluaranResponse);
                alert(`Gagal membuat pengeluaran: ${pengeluaranResponse.message || 'Unknown error'}`);
              }
            }
          } catch (pengeluaranError) {
            console.error('❌ Error handling pengeluaran:', pengeluaranError);
            // Don't fail the whole operation for pengeluaran errors
          }
        } else if (updatedData._hasExistingPengeluaran && updatedData._existingPengeluaranId) {
          // If pengeluaran fields are cleared, delete existing pengeluaran
          console.log('🗑️ Deleting existing pengeluaran (fields cleared)');
          
          try {
            const deleteResult = await fetch(`http://localhost:3000/api/pengeluaran/${updatedData._existingPengeluaranId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'X-User-ID': userData.id_user.toString(),
                'X-User-Role': userData.role_user,
                'X-User-Email': userData.email_user
              }
            });
            
            if (deleteResult.ok) {
              console.log('✅ Pengeluaran deleted successfully');
            } else {
              console.error('❌ Failed to delete pengeluaran');
            }
          } catch (deleteError) {
            console.error('❌ Error deleting pengeluaran:', deleteError);
          }
        }
        
        alert('Data penawaran berhasil diperbarui');
        // Refresh data setelah update
        await fetchPenawaranData();
        // Trigger refresh of detail data if modal is open
        triggerDetailRefresh();
        setShowEditModal(false);
        setSelectedEditData(null);
      } else {
        console.error('❌ API Error:', result.error);
        alert(`Gagal memperbarui data: ${result.message}\n\nDetail: ${result.error || 'Tidak ada detail error'}`);
      }
    } catch (error) {
      console.error('❌ Error updating penawaran:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        alert('Authentication data tidak valid. Silakan login kembali.');
      } else if (error.response?.status === 403) {
        alert('Anda tidak memiliki izin untuk melakukan aksi ini.');
      } else if (error.response?.status === 500) {
        alert('Terjadi kesalahan server. Silakan coba lagi.');
      } else {
        alert(`Terjadi kesalahan saat memperbarui data:\n${error.message}`);
      }
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

  // Function to trigger refresh of detail data
  const triggerDetailRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteData = (item) => {
    setSelectedDeleteData(item);
    setShowHapusModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowHapusModal(false);
    setSelectedDeleteData(null);
  };

  const handleConfirmDelete = async (deleteData) => {
    try {
      // Check if user is authenticated
      const userData = getUserData();
      if (!userData) {
        alert('User tidak terautentikasi. Silakan login kembali.');
        return;
      }

      console.log('🗑️ Deleting penawaran:', deleteData);
      console.log('🔍 Delete data ID:', deleteData.id);

      const result = await penawaranAPI.delete(deleteData.id);
      
      console.log('📬 Delete API Response:', result);
      
      if (result.success) {
        alert('Data penawaran berhasil dihapus');
        // Refresh data setelah delete
        await fetchPenawaranData();
        setShowHapusModal(false);
        setSelectedDeleteData(null);
      } else {
        console.error('❌ Delete API Error:', result.error);
        alert(`Gagal menghapus data: ${result.message}\n\nDetail: ${result.error || 'Tidak ada detail error'}`);
      }
    } catch (error) {
      console.error('❌ Error deleting penawaran:', error);
      alert(`Terjadi kesalahan saat menghapus data:\n${error.message}`);
    }
  };

  const handleSaveData = async (newData) => {
    try {
      // Check if user is authenticated
      const userData = getUserData();
      if (!userData) {
        alert('User tidak terautentikasi. Silakan login kembali.');
        return false;
      }

      console.log('💾 User data:', userData);
      console.log('💾 Sending penawaran data:', newData);

      const result = await penawaranAPI.create(newData);
      
      console.log('📬 API Response:', result);
      
      if (result.success) {
        alert('Data penawaran berhasil disimpan');
        // Refresh data setelah save
        await fetchPenawaranData();
        // Trigger refresh of detail data if modal is open
        triggerDetailRefresh();
        setShowTambahModal(false);
        
        // Reset form di komponen Tambah akan dilakukan oleh callback
        return true;
      } else {
        console.error('❌ API Error:', result.error);
        alert(`Gagal menyimpan data: ${result.message}\n\nDetail: ${result.error || 'Tidak ada detail error'}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving penawaran:', error);
      console.error('❌ Error details:', error.message);
      alert(`Terjadi kesalahan saat menyimpan data:\n${error.message}`);
      return false;
    }
  };

  const handleExportPDF = () => {
    try {
      console.log('Starting PDF export...');
      console.log('Filtered data:', filteredData);
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Data Penawaran', 14, 22);
      
      // Add current date
      doc.setFontSize(10);
      const currentDate = new Date().toLocaleDateString('id-ID');
      doc.text(`Tanggal Export: ${currentDate}`, 14, 32);
      
      // Prepare table data
      const tableColumns = [
        'No',
        'Tanggal',
        'Nama Pelanggan', 
        'Nomor Kontrak/BAKB',
        'Kontrak Ke-',
        'Referensi',
        'Durasi',
        'Status'
      ];
      
      const tableRows = filteredData.map((item, index) => [
        (index + 1).toString(),
        item.tanggal || '',
        item.namaPelanggan || '',
        item.nomorKontrak || '',
        item.kontrakKe ? item.kontrakKe.toString() : '',
        item.referensi || '',
        item.durasi ? item.durasi.toString() : '',
        item.status || ''
      ]);
      
      console.log('Table columns:', tableColumns);
      console.log('Table rows:', tableRows);
      
      // Add table with autoTable function
      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 40,
        margin: { top: 40, right: 10, bottom: 20, left: 10 },
        styles: {
          fontSize: 7,
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'left',
          valign: 'middle'
        },
        headStyles: {
          fillColor: [0, 174, 239], // PLN blue color
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 7
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 12 }, // No
          1: { cellWidth: 25 }, // Tanggal
          2: { cellWidth: 35 }, // Nama Pelanggan
          3: { cellWidth: 35 }, // Nomor Kontrak
          4: { halign: 'center', cellWidth: 20 }, // Kontrak Ke
          5: { cellWidth: 30 }, // Referensi
          6: { halign: 'center', cellWidth: 20 }, // Durasi
          7: { halign: 'center', cellWidth: 25 } // Status
        },
        tableWidth: 'wrap'
      });
      
      // Create safe filename
      const safeDate = currentDate.replace(/[\/\\:*?"<>|]/g, '-');
      const filename = `Data_Penawaran_${safeDate}.pdf`;
      
      console.log('Saving PDF with filename:', filename);
      
      // Save the PDF
      doc.save(filename);
      
      console.log('PDF exported successfully');
      alert('PDF berhasil diexport!');
    } catch (error) {
      console.error('Detailed error exporting PDF:', error);
      console.error('Error stack:', error.stack);
      alert(`Terjadi kesalahan saat mengexport PDF: ${error.message}`);
    }
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
          minHeight: '200px',
          fontSize: '16px',
          color: '#666'
        }}>
          Memuat data penawaran...
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
          <button
            onClick={fetchPenawaranData}
            style={{
              marginLeft: '10px',
              padding: '4px 8px',
              backgroundColor: '#721c24',
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

      {/* Content - Only show when not loading */}
      {!isLoading && (
        <>
      {/* Header Section with Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {/* Export PDF Button */}
        <button
          onClick={handleExportPDF}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#00AEEF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#0097A7';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#00AEEF';
          }}
        >
          <Download style={{ width: '16px', height: '16px' }} />
          Export PDF
        </button>

        {/* Tambah Data Button */}
        <button
          onClick={handleTambahData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#00AEEF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#0097A7';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#00AEEF';
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Tambah Data
        </button>
      </div>

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
                }}>Nama Sales</th>
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
                    {item.namaSales}
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
                    <span style={getStatusStyle(item.status)}>
                      {item.status}
                    </span>
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
                        title="View Details"
                      >
                        <Eye style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button
                        onClick={() => handleEditData(item)}
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
                        }}
                        title="Edit"
                      >
                        <Edit2 style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button
                        onClick={() => handleDeleteData(item)}
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
                        }}
                        title="Delete"
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
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
      <Tambah
        isOpen={showTambahModal}
        onClose={handleCloseModal}
        onSave={handleSaveData}
      />
      
      <Edit
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditData}
        editData={selectedEditData}
      />
      
      <Detail
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        detailData={selectedDetailData}
        refreshTrigger={refreshTrigger}
      />
      
      <Hapus
        isOpen={showHapusModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleteData={selectedDeleteData}
      />
        </>
      )}
    </div>
  );
};

export default Penawaran;
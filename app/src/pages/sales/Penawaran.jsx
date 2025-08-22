import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Plus, RotateCcw, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Tambah from './crud-penawaran/Tambah';
import Edit from './crud-penawaran/Edit';
import Hapus from './crud-penawaran/Hapus';
import Detail from './crud-penawaran/Detail';

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

  // Sample data for penawaran with status
  const penawaranData = [
    {
      id: 1,
      tanggal: '16/06/04',
      namaPelanggan: 'Audrey',
      nomorKontrak: '20301231',
      kontrakKe: 3,
      referensi: 'Sumatera',
      discount: '5.00%',
      durasi: 2,
      targetIRR: '76.600',
      status: 'Menunggu',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 2,
      tanggal: '02/06/02',
      namaPelanggan: 'Riki',
      nomorKontrak: '19237843',
      kontrakKe: 1,
      referensi: 'Kalimantan',
      discount: '3.50%',
      durasi: 2,
      targetIRR: '73.300',
      status: 'Disetujui',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 3,
      tanggal: '17/12/02',
      namaPelanggan: 'Hasian',
      nomorKontrak: '19093412',
      kontrakKe: 4,
      referensi: 'Kalimantan',
      discount: '4.74%',
      durasi: 2,
      targetIRR: '31.400',
      status: 'Ditolak',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 4,
      tanggal: '28/06/24',
      namaPelanggan: 'Hisyam',
      nomorKontrak: '28903123',
      kontrakKe: 3,
      referensi: 'Intim',
      discount: '6.02%',
      durasi: 2,
      targetIRR: '29.200',
      status: 'Disetujui',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 5,
      tanggal: '15/08/24',
      namaPelanggan: 'Sari',
      nomorKontrak: '30412567',
      kontrakKe: 2,
      referensi: 'Jawa-Bali',
      discount: '7.25%',
      durasi: 3,
      targetIRR: '82.100',
      status: 'Menunggu',
      actions: ['view', 'edit', 'delete']
    }
  ];

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

  const handleSaveEditData = (updatedData) => {
    console.log('Saving edited data:', updatedData);
    // Add your save logic here
  };

  const handleDetailData = (item) => {
    setSelectedDetailData(item);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedDetailData(null);
  };

  const handleDeleteData = (item) => {
    setSelectedDeleteData(item);
    setShowHapusModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowHapusModal(false);
    setSelectedDeleteData(null);
  };

  const handleConfirmDelete = (deleteData) => {
    console.log('Deleting data:', deleteData);
    // Add your delete logic here
  };

  const handleSaveData = (newData) => {
    console.log('Saving new data:', newData);
    // Add your save logic here
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
      />
      
      <Hapus
        isOpen={showHapusModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleteData={selectedDeleteData}
      />
    </div>
  );
};

export default Penawaran;
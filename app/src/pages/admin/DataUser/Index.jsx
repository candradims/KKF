import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Plus, FileSpreadsheet, RotateCcw } from 'lucide-react';
import TambahData from './TambahData';
import EditData from './EditData';
import DetailData from './DetailData';
import HapusData from './HapusData';
import ImportData from './ImportData';

const Index = () => {
  const [filterRole, setFilterRole] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      
      const data = Array.isArray(result) ? result : result.data || [];
      
      const sanitizedUsers = data.map(user => ({
        id: user.id_user || user.id,
        date: formatDateToDDMMYYYY(user.tanggal) || user.date,
        email: user.email_user || user.email,
        role: user.role_user || user.role,
        actions: ['view', 'edit', 'delete'],
        originalDate: user.tanggal 
      }));

      setUsersData(sanitizedUsers);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    }
  };
  
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return '';
    
    try {
      const [day, month, year] = dateString.split('-');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error converting to YYYY-MM-DD:", error);
      return dateString;
    }
  };

  const handleOpenModal = () => {
    setShowTambahModal(true);
  };

  const handleCloseModal = () => {
    setShowTambahModal(false);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleOpenDetailModal = (user) => {
    setDetailUser(user);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailUser(null);
  };

  const handleOpenDeleteModal = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const handleSaveData = async (newUserData) => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_user: newUserData.email_user,
          kata_sandi: newUserData.kata_sandi,
          role_user: newUserData.role_user
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        const addedUser = result.data;

        const formattedUser = {
          id: addedUser.id_user,
          date: formatDateToDDMMYYYY(addedUser.tanggal),
          email: addedUser.email_user,
          role: addedUser.role_user,
          actions: ['view', 'edit', 'delete']
        };

        setUsersData(prevUsers => [...prevUsers, formattedUser]);
        setShowTambahModal(false);
        
        // Refresh data
        fetchUsers();
        
        return result;
      } else {
        throw new Error(result.message || 'Gagal menambah pengguna');
      }
    } catch (error) {
      console.error('Gagal menambah pengguna:', error);
      throw error;
    }
  };

  const handleUpdateData = (updatedData) => {
    setUsersData(prevUsers =>
      prevUsers.map(user =>
        user.id === editingUser.id
          ? {
              ...user,
              email: updatedData.email,
              password: updatedData.password,
              role: updatedData.role,
            }
          : user
      )
    );
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleDeleteData = (userId) => {
    setUsersData(prevUsers => prevUsers.filter(user => user.id !== userId));
    handleCloseDeleteModal();
  };

  const handleOpenImportModal = () => {
    setShowImportModal(true);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleImportData = async (file) => {
    setIsImporting(true);
    console.log('Mulai mengimpor file:', file.name);

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const importedUsers = [
            { id: 10, date: '01/06/2023', email: 'budi@example.com', password: 'budi_pass', role: 'Sales', actions: ['view', 'edit', 'delete'] },
            { id: 11, date: '01/06/2023', email: 'siti@example.com', password: 'siti_pass', role: 'Sales', actions: ['view', 'edit', 'delete'] },
        ];
        
        const maxId = usersData.length > 0 ? Math.max(...usersData.map(user => user.id)) : 0;
        const newUsersWithId = importedUsers.map((user, index) => ({
            ...user,
            id: maxId + index + 1,
        }));

        setUsersData(prevUsers => [...prevUsers, ...newUsersWithId]);
        console.log('Data berhasil diimpor!');

    } catch (error) {
        console.error('Gagal mengimpor file:', error);
    } finally {
        setIsImporting(false);
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = usersData.filter(user => {
    if (filterRole && user.role.toLowerCase() !== filterRole.toLowerCase()) return false;

    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      
      let userDateObj;
      if (user.originalDate) {
        userDateObj = new Date(user.originalDate);
      } else {
        const [day, month, year] = user.date.split('-');
        userDateObj = new Date(`${year}-${month}-${day}`);
      }
      
      filterDateObj.setHours(0, 0, 0, 0);
      userDateObj.setHours(0, 0, 0, 0);
      
      if (userDateObj.getTime() !== filterDateObj.getTime()) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

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
    setFilterRole('');
    setFilterDate('');
    setCurrentPage(1);
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
            onClick={handleOpenImportModal}
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
              <FileSpreadsheet style={{ width: '16px', height: '16px' }} className="w-4 h-4" />
              Import Excel
            </button>
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
              Tambah User
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

            {/* Filter By Role */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }} className="block text-sm font-medium text-gray-700 mb-1.5">
                Filter By Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih --</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Admin">Admin</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            {/* Filter By Tanggal */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }} className="block text-sm font-medium text-gray-700 mb-1.5">
                Filter By Tanggal
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="dd/mm/yyyy"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                    border: '1px solid #e5e7eb',
                    width: '120px'
                  }}>
                    Tanggal
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }} className="px-4 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Email User
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }} className="px-4 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Kata Sandi
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }} className="px-4 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Role
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    border: '1px solid #e5e7eb'
                  }} className="px-4 py-4 text-center text-sm font-semibold text-gray-700 border-b">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id} style={{
                    borderBottom: '1px solid #f3f4f6'
                  }} className="border-b border-gray-100 hover:bg-gray-50">
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }} className="px-4 py-4 text-sm text-gray-700">
                      {startIndex + index + 1}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }} className="px-4 py-4 text-sm text-gray-700">
                      {user.date}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }} className="px-4 py-4 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }} className="px-4 py-4 text-sm text-gray-700">
                      ********
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151',
                      border: '1px solid #e5e7eb'
                    }} className="px-4 py-4 text-sm text-gray-700">
                      <span style={{
                        backgroundColor: user.role === 'Admin' ? '#dbeafe' : '#dcfce7',
                        color: user.role === 'Admin' ? '#1e40af' : '#166534',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }} className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      border: '1px solid #e5e7eb'
                    }} className="px-4 py-4 text-center">
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }} className="flex items-center justify-center gap-2">
                        {/* Tombol Detail/View */}
                        <button
                          onClick={() => handleOpenDetailModal(user)} 
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
                          }} className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-1.5 rounded-md transition-colors">
                          <Eye style={{ width: '14px', height: '14px' }} className="w-3.5 h-3.5" />
                        </button>
                        {/* Tombol Edit */}
                        <button
                          onClick={() => handleOpenEditModal(user)} 
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
                          }} className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 p-1.5 rounded-md transition-colors">
                          <Edit2 style={{ width: '14px', height: '14px' }} className="w-3.5 h-3.5" />
                        </button>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
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
                          }} className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-md transition-colors">
                          <Trash2 style={{ width: '14px', height: '14px' }} className="w-3.5 h-3.5" />
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
          }} className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
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
              className={`px-3 py-2 border border-gray-300 rounded-md text-sm transition-colors ${
                currentPage === 1
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
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
                  className={`px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[40px] transition-colors ${
                    isCurrentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
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
              className={`px-3 py-2 border border-gray-300 rounded-md text-sm transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>
      <TambahData
        isOpen={showTambahModal}
        onClose={handleCloseModal}
        onSave={handleSaveData}
      />
        <EditData
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateData}
        initialData={editingUser}
      />
      <DetailData
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        initialData={detailUser}
      />
      <HapusData
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteData}
        initialData={deletingUser}
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

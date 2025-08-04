import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Plus, FileText, RotateCcw } from 'lucide-react';

const DataUser = () => {
  const [filterRole, setFilterRole] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Sample data for users
  const usersData = [
    {
      id: 1,
      email: 'maulana@gmail.com',
      password: '••••••••',
      role: 'Admin',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 2,
      email: 'ahmadazaki@gmail.com',
      password: '••••••••',
      role: 'Sales',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 3,
      email: 'sonimasako@gmail.com',
      password: '••••••••',
      role: 'Sales',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 4,
      email: 'marywarwati01@gmail.com',
      password: '••••••••',
      role: 'Sales',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 5,
      email: 'ovnza8@gmail.com',
      password: '••••••••',
      role: 'Sales',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 6,
      email: 'dimasuindrudi@gmail.com',
      password: '••••••••',
      role: 'Sales',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 7,
      email: 'penhimathan@gmail.com',
      password: '••••••••',
      role: 'Sales',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 8,
      email: 'astilkellina@gmail.com',
      password: '••••••••',
      role: 'Sales',
      actions: ['view', 'edit', 'delete']
    },
    {
      id: 9,
      email: 'markusukuai@gmail.com',
      password: '••••••••',
      role: 'Sales',
      actions: ['view', 'edit', 'delete']
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = usersData.filter(user => {
    if (filterRole && user.role !== filterRole) return false;
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px'
    }} className="min-h-screen bg-gray-50 p-6">
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto'
      }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div style={{
          marginBottom: '24px'
        }} className="mb-6">
          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
            <button style={{
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
              <FileText style={{ width: '16px', height: '16px' }} className="w-4 h-4" />
              Import PDF
            </button>
            <button style={{
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
            gridTemplateColumns: '2fr 2fr 1fr',
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
              <button style={{
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }} className="w-full">
              {/* Table Header */}
              <thead style={{ backgroundColor: '#e0f2fe' }} className="bg-blue-50">
                <tr>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }} className="px-4 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Email User
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }} className="px-4 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Kata Sandi
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }} className="px-4 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Role
                  </th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }} className="px-4 py-4 text-center text-sm font-semibold text-gray-700 border-b">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id} style={{
                    borderBottom: '1px solid #f3f4f6'
                  }} className="border-b border-gray-100 hover:bg-gray-50">
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151'
                    }} className="px-4 py-4 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151'
                    }} className="px-4 py-4 text-sm text-gray-700">
                      {user.password}
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#374151'
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
                      textAlign: 'center'
                    }} className="px-4 py-4 text-center">
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }} className="flex items-center justify-center gap-2">
                        {/* View Button */}
                        <button style={{
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

                        {/* Edit Button */}
                        <button style={{
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

                        {/* Delete Button */}
                        <button style={{
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

          {/* Pagination */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }} className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
            {/* Previous Button */}
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

            {/* Page Numbers */}
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

            {/* Next Button */}
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
    </div>
  );
};

export default DataUser;

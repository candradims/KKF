import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Plus, FileSpreadsheet, RotateCcw, Search, Users, Calendar, Filter } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const [usersData, setUsersData] = useState([]);

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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      
      const data = Array.isArray(result) ? result : result.data || [];
      
      // Function to format role for display
      const formatRoleForDisplay = (role) => {
        switch(role) {
          case 'superAdmin': return 'Super Admin';
          case 'admin': return 'Admin';
          case 'sales': return 'Sales';
          default: return role;
        }
      };
      
      const sanitizedUsers = data.map(user => ({
        id: user.id_user || user.id,
        date: formatDateToDDMMYYYY(user.tanggal) || user.date,
        nama: user.nama_user || user.nama,
        email: user.email_user || user.email,
        kata_sandi: user.kata_sandi || user.password,
        role: formatRoleForDisplay(user.role_user || user.role), // Format for display
        originalRole: user.role_user || user.role, // Keep original for API calls
        actions: ['view', 'edit', 'delete'],
        originalDate: user.tanggal 
      }));

      sanitizedUsers.sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));
      
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
    // Convert database role to display format for editing
    const roleForEdit = user.originalRole || user.role;
    const userForEdit = {
      ...user,
      role: roleForEdit
    };
    setEditingUser(userForEdit);
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
          nama_user: newUserData.nama_user,
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
          nama: addedUser.nama_user,
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

  const handleUpdateData = async (updatedData) => {
    try {
      console.log("📝 Frontend - Updating user:", editingUser);
      console.log("📝 Frontend - Update data received:", updatedData);
      
      if (!editingUser || !editingUser.id) {
        throw new Error("User ID tidak ditemukan");
      }

      // Function to convert role from form to database format
      const convertRoleToDatabase = (displayRole) => {
        switch(displayRole) {
          case 'Super Admin': return 'superAdmin';
          case 'Admin': return 'admin';
          case 'Sales': return 'sales';
          default: return displayRole;
        }
      };

      // Prepare data for API
      const updatePayload = {
        nama_user: updatedData.nama,
        email_user: updatedData.email,
        role_user: convertRoleToDatabase(updatedData.role),
      };

      // Hanya tambahkan password jika ada dan tidak kosong
      if (updatedData.password && updatedData.password.trim() !== '') {
        updatePayload.kata_sandi = updatedData.password;
        console.log("📝 Frontend - Password akan diupdate");
      } else {
        console.log("📝 Frontend - Password tidak diupdate (kosong)");
      }

      console.log("📝 Frontend - Final payload:", updatePayload);

      const response = await fetch(`http://localhost:3000/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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

      // Update UI dengan data yang baru
      setUsersData(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id
            ? {
                ...user,
                nama: updatedData.nama,
                email: updatedData.email,
                role: updatedData.role,
                // Tidak menampilkan password di UI
              }
            : user
        )
      );

      // Tutup modal
      setShowEditModal(false);
      setEditingUser(null);
      
      console.log("✅ User berhasil diupdate");
    } catch (error) {
      console.error("❌ Gagal mengupdate user:", error);
      alert(`Gagal mengupdate user: ${error.message}`);
    }
  };

  const handleDeleteData = async (userId) => {
    try {
      console.log("🗑️ Deleting user with ID:", userId);
      
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
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
      console.log("✅ Delete response:", result);

      // Update UI dengan menghapus user dari state
      setUsersData(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Tutup modal
      handleCloseDeleteModal();
      
      console.log("✅ User berhasil dihapus dari database dan UI");
    } catch (error) {
      console.error("❌ Gagal menghapus user:", error);
      alert(`Gagal menghapus user: ${error.message}`);
    }
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
    // Search filter
    const matchesSearch = !searchTerm || 
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const matchesRole = !filterRole || user.role.toLowerCase() === filterRole.toLowerCase();

    // Date filter
    let matchesDate = true;
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
      
      matchesDate = userDateObj.getTime() === filterDateObj.getTime();
    }

    return matchesSearch && matchesRole && matchesDate;
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
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getRoleBadgeStyle = (role) => {
    switch(role.toLowerCase()) {
      case 'super admin':
        return {
          backgroundColor: `${colors.secondary}15`,
          color: colors.secondary,
          border: `1px solid ${colors.secondary}30`
        };
      case 'admin':
        return {
          backgroundColor: `${colors.tertiary}15`,
          color: colors.tertiary,
          border: `1px solid ${colors.tertiary}30`
        };
      case 'sales':
        return {
          backgroundColor: `${colors.success}15`,
          color: colors.success,
          border: `1px solid ${colors.success}30`
        };
      default:
        return {
          backgroundColor: `${colors.gray400}15`,
          color: colors.gray600,
          border: `1px solid ${colors.gray400}30`
        };
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#e7f3f5ff',
      padding: '24px',
      fontFamily: 'Inter, sans-serif',
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
                  <Users size={24} />
                </div>
                <div>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: colors.primary,
                    margin: '0 0 4px 0'
                  }}>
                    {usersData.length}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: colors.gray600,
                    margin: 0
                  }}>
                    Total User
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
                    {filteredUsers.length}
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
            {/* Filter By Role */}
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
                <Users size={16} />
                Filter By Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
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
                  e.target.style.borderColor = colors.gray200;
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">-- Semua Role --</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            {/* Filter By Tanggal */}
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
                <Calendar size={16} />
                Filter By Tanggal
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #035b71',
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
                  e.target.style.borderColor = colors.gray200;
                  e.target.style.boxShadow = 'none';
                }}
              />
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
                  marginBottom: '16px',
                  marginTop: '35px'
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
                  marginBottom: '16px',
                  marginTop: '35px'
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
                Tambah User
              </button>
        </div>

        {/* Table Section */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50} 100%)`,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: `0 12px 40px ${colors.primary}08`,
          border: '1px solid #035b71',
          position: 'relative',
          marginTop: '15px'
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
                    width: '140px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} />
                      Tanggal
                    </div>
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={16} />
                      Nama User
                    </div>
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    Email User
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    Kata Sandi
                  </th>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: colors.primary,
                    borderBottom: `2px solid #035b71 `,
                  }}>
                    Role
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
                {currentUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
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
                        <Users size={48} style={{ color: colors.gray300 }} />
                        <span>Tidak ada data yang ditemukan</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user.id}
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
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}>
                          <span style={{ fontWeight: '600' }}>{user.date}</span>
                          <span style={{ 
                            fontSize: '12px', 
                            color: colors.gray500 
                          }}>
                            Registered
                          </span>
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
                            {user.nama.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                              {user.nama}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: colors.gray500 
                            }}>
                              User Profile
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
                          fontFamily: 'monospace',
                          border: `1px solid ${colors.gray200}`,
                          display: 'inline-block'
                        }}>
                          {user.email}
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
                          fontFamily: 'monospace',
                          border: `1px solid ${colors.gray200}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: colors.gray500
                        }}>
                          <span>••••••••</span>
                          <div style={{
                            width: '6px',
                            height: '6px',
                            background: colors.success,
                            borderRadius: '50%'
                          }} />
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '14px',
                        color: colors.gray700,
                        borderBottom: `2px solid #035b71 `,
                      }}>
                        <span style={{
                          ...getRoleBadgeStyle(user.role),
                          padding: '6px 16px',
                          borderRadius: '20px',
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
                            borderRadius: '50%',
                            backgroundColor: 'currentColor'
                          }} />
                          {user.role}
                        </span>
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
                            onClick={() => handleOpenDetailModal(user)}
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
                            onClick={() => handleOpenEditModal(user)}
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
                            onClick={() => handleOpenDeleteModal(user)}
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
                {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} dari {filteredUsers.length} data
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

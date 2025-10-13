import React, { useState } from 'react';
import { Upload, Check, X, FileSpreadsheet } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import * as XLSX from 'xlsx'; 

const ImportData = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Color palette
  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel' ||
        selectedFile.type === 'text/csv'
      ) {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Format file tidak didukung. Harap pilih file .xlsx, .xls, atau .csv.');
      }
    } else {
      setFile(null);
      setError('');
    }
  };

  // Fungsi parsing Excel
  const parseExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          console.log('🔍 Starting Excel parsing...');
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { 
            type: 'array',
            cellDates: true,
            cellText: false,
            raw: false
          });
          
          console.log('📊 Sheet names:', workbook.SheetNames);
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log('📋 Raw Excel data:', jsonData);
          
          if (jsonData.length === 0) {
            resolve([]);
            return;
          }
          
          // Process data
          const mappedData = jsonData.map((row, index) => {
            console.log(`🔍 Raw row ${index}:`, row);
            const rowLower = {};
            Object.keys(row).forEach(key => {
              rowLower[key.toLowerCase()] = row[key];
            });
            
            const mappedRow = {
              nama_user: 
                row.nama_user || row.nama || row.name || 
                rowLower.nama_user || rowLower.nama || rowLower.name || 
                row['Nama User'] || row['nama user'] || '',
              
              email_user: 
                row.email_user || row.email || 
                rowLower.email_user || rowLower.email || 
                row['Email User'] || row['email user'] || '',
              
              kata_sandi: 
                row.kata_sandi || row.password || 
                rowLower.kata_sandi || rowLower.password || 
                row['Kata Sandi'] || row['kata sandi'] || 'default123',
              
              role_user: 
                row.role_user || row.role || 
                rowLower.role_user || rowLower.role || 
                row['Role User'] || row['role user'] || '',
              
              target_nr: null
            };

            if (row.target_nr !== undefined && row.target_nr !== null && row.target_nr !== '') {
              const numValue = Number(String(row.target_nr).replace(/[^\d]/g, ''));
              mappedRow.target_nr = isNaN(numValue) ? null : numValue;
            } else if (row.target !== undefined && row.target !== null && row.target !== '') {
              const numValue = Number(String(row.target).replace(/[^\d]/g, ''));
              mappedRow.target_nr = isNaN(numValue) ? null : numValue;
            } else if (rowLower.target_nr !== undefined && rowLower.target_nr !== null && rowLower.target_nr !== '') {
              const numValue = Number(String(rowLower.target_nr).replace(/[^\d]/g, ''));
              mappedRow.target_nr = isNaN(numValue) ? null : numValue;
            } else if (rowLower.target !== undefined && rowLower.target !== null && rowLower.target !== '') {
              const numValue = Number(String(rowLower.target).replace(/[^\d]/g, ''));
              mappedRow.target_nr = isNaN(numValue) ? null : numValue;
            }
            
            console.log(`✅ Mapped row ${index}:`, mappedRow);
            return mappedRow;
          });
          
          console.log('🎯 Final mapped data:', mappedData);
          resolve(mappedData);
          
        } catch (error) {
          console.error('❌ Excel parsing error:', error);
          reject(new Error(`Gagal memparsing file Excel: ${error.message}`));
        }
      };
      
      reader.onerror = (error) => {
        console.error('❌ File reading error:', error);
        reject(new Error('Gagal membaca file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  // Fungsi parsing CSV
  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          console.log('🔍 Starting CSV parsing...');
          const csvText = e.target.result;
          const lines = csvText.split('\n').filter(line => line.trim() !== '');
          
          console.log('📄 CSV lines:', lines.length);
          
          if (lines.length <= 1) {
            resolve([]);
            return;
          }
          
          // Parse header
          const headers = lines[0].split(',').map(h => 
            h.toLowerCase().trim().replace(/\s+/g, '_')
          );
          console.log('📝 CSV headers:', headers);
          
          const results = [];
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Simple CSV parsing
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            
            headers.forEach((header, index) => {
              const value = values[index] || '';
              
              if (header.includes('nama')) {
                row.nama_user = value;
              } else if (header.includes('email')) {
                row.email_user = value.toLowerCase();
              } else if (header.includes('password') || header.includes('kata_sandi') || header.includes('sandi')) {
                row.kata_sandi = value || 'default123';
              } else if (header.includes('role')) {
                row.role_user = value;
              } else if (header.includes('target')) {
                const numValue = value ? Number(value.replace(/[^\d]/g, '')) : null;
                row.target_nr = isNaN(numValue) ? null : numValue;
              }
            });
            
            console.log(`📝 CSV Row ${i} parsed:`, row);
            
            if (row.nama_user && row.email_user && row.role_user) {
              results.push(row);
            }
          }
          
          console.log('✅ Final CSV results:', results);
          resolve(results);
          
        } catch (error) {
          console.error('❌ CSV parsing error:', error);
          reject(new Error(`Gagal memparsing file CSV: ${error.message}`));
        }
      };
      
      reader.onerror = (error) => {
        console.error('❌ File reading error:', error);
        reject(new Error('Gagal membaca file'));
      };
      
      reader.readAsText(file, 'UTF-8');
    });
  };

  // Fungsi utama untuk parse file
  const parseFileToUsers = async (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    console.log('📁 Parsing file:', file.name, 'Type:', fileExtension);
    
    try {
      let users = [];
      
      if (fileExtension === 'csv') {
        users = await parseCSV(file);
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        users = await parseExcel(file);
      } else {
        throw new Error('Format file tidak didukung');
      }
      
      const validUsers = users.filter(user => 
        user.nama_user && 
        user.email_user && 
        user.role_user &&
        ['superAdmin', 'admin', 'sales'].includes(user.role_user)
      );
      
      console.log('✅ Valid users for import:', validUsers);
      return validUsers;
      
    } catch (error) {
      console.error('❌ Parse file error:', error);
      throw error;
    }
  };

  // Fungsi untuk validasi dan normalisasi data
  const validateAndNormalizeUsers = (users) => {
    return users.map(user => {
      let normalizedRole = user.role_user.toLowerCase().trim();
      if (normalizedRole === 'superadmin') normalizedRole = 'superAdmin';
      if (normalizedRole === 'administrator') normalizedRole = 'admin';
      
      const validatedUser = {
        nama_user: user.nama_user.trim(),
        email_user: user.email_user.trim().toLowerCase(),
        kata_sandi: user.kata_sandi || 'default123',
        role_user: normalizedRole,
        target_nr: user.target_nr && !isNaN(user.target_nr) ? parseInt(user.target_nr) : null
      };
      
      // Untuk role non-sales, set target_nr ke null
      if (validatedUser.role_user !== 'sales') {
        validatedUser.target_nr = null;
      }
      
      return validatedUser;
    });
  };

  const handleImportClick = async () => {
    if (file) {
      setIsLoading(true);
      setError('');
      
      try {
        console.log("🚀 Starting import process...", file);
        
        // Parse file
        const users = await parseFileToUsers(file);
        
        console.log("📊 Users parsed:", users);
        
        if (!users || users.length === 0) {
          setError('Tidak ada data yang valid ditemukan dalam file. Pastikan file memiliki data dengan format yang benar.');
          setIsLoading(false);
          return;
        }

        // Validasi dan normalisasi data
        const validUsers = validateAndNormalizeUsers(users);

        if (validUsers.length === 0) {
          setError(`
            Tidak ada data yang valid. Pastikan:
            1. File memiliki header yang benar
            2. Kolom nama, email, dan role terisi
            3. Role harus: superAdmin, admin, atau sales
            4. Format email valid
          `);
          setIsLoading(false);
          return;
        }

        console.log("✅ Valid users ready for import:", validUsers);

        const response = await fetch('http://localhost:3000/api/admin/users/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ users: validUsers }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("📨 Server response:", result);

        if (result.success) {
          setFile(null);
          setShowSuccessModal(true);
          
          // Tampilkan summary
          if (result.data.failed && result.data.failed.length > 0) {
            console.warn('⚠️ Some imports failed:', result.data.failed);
          }
          
          // Tidak langsung memanggil onImport di sini
          // Akan dipanggil saat modal success ditutup
        } else {
          setError(result.message || 'Gagal mengimpor data ke server');
        }
        
      } catch (e) {
        console.error('❌ Import process error:', e);
        setError(`Terjadi kesalahan: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Harap pilih file terlebih dahulu.');
    }
  };

  const handleCloseModal = () => {
    setFile(null);
    setIsLoading(false);
    setError('');
    onClose();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFile(null);
    setError('');
    onClose();
    // Trigger refresh data di parent component
    if (onImport) {
      onImport();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Main Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(3, 91, 113, 0.3)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                rotate: [0, 0.5, -0.5, 0]
              }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                background: '#e7f3f5ff',
                borderRadius: '32px',
                width: '100%',
                maxWidth: '600px',
                padding: '20px',
                boxShadow: `
                  0 12px 30px rgba(0, 0, 0, 0.12), 
                  0 4px 12px rgba(0, 0, 0, 0.08)`,
                border: '1px solid rgba(255, 255, 255, 0.6)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative highlight */}
              <div style={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0))',
                pointerEvents: 'none'
              }} />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(3, 91, 113, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(3, 91, 113, 0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(3, 91, 113, 0.1)'}
              >
                <X size={20} color={colors.primary} />
              </motion.button>

              {/* Header */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  padding: '40px 32px 20px',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: `0 10px 30px rgba(0, 191, 202, 0.3)`
                }}>
                  <FileSpreadsheet size={32} color="white" />
                </div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  Import Data User
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Unggah file Excel/CSV untuk mengimpor data
                </p>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '40px',
                  margin: '0 32px 32px',
                  border: `1px solid rgba(0, 192, 202, 0.68)`,
                  position: 'relative'
                }}
              >
                {/* File Input */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '12px',
                    letterSpacing: '0.02em'
                  }}>
                    Pilih File Excel/CSV
                  </label>
                  <motion.div
                    whileHover={{ y: -2 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px dashed ${file ? colors.success : colors.secondary}40`,
                      borderRadius: '12px',
                      padding: '32px',
                      cursor: 'pointer',
                      position: 'relative',
                      background: file ? `${colors.success}10` : `${colors.secondary}08`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <input
                      type="file"
                      accept=".csv, .xlsx, .xls"
                      onChange={handleFileChange}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      <Upload style={{
                        width: '40px',
                        height: '40px',
                        color: file ? colors.success : colors.secondary,
                        marginBottom: '12px'
                      }} />
                      <p style={{
                        fontSize: '14px',
                        color: file ? colors.success : colors.primary,
                        fontWeight: file ? '600' : '400'
                      }}>
                        {file ? file.name : 'Tarik & letakkan file atau klik di sini'}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: colors.accent1,
                        marginTop: '4px'
                      }}>
                        Format yang didukung: .xlsx, .xls, .csv
                      </p>
                    </div>
                  </motion.div>
                  {error && (
                    <p style={{
                      color: '#ef4444',
                      fontSize: '12px',
                      marginTop: '8px',
                      fontWeight: '500'
                    }}>
                      {error}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '16px',
                  marginTop: '32px'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                      color: '#ffffff',
                      border: 'none',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxShadow: `0 4px 15px rgba(3, 91, 113, 0.3)`,
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.02em'
                    }}
                  >
                    Batal
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleImportClick}
                    disabled={!file || isLoading}
                    style={{
                      background: isLoading
                        ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                        : !file
                          ? `linear-gradient(135deg, ${colors.gray300} 0%, ${colors.gray400} 100%)`
                          : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                      color: '#ffffff',
                      border: 'none',
                      padding: '16px 40px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: (!file || isLoading) ? 'not-allowed' : 'pointer',
                      boxShadow: !file
                        ? 'none'
                        : `0 4px 20px rgba(0, 191, 202, 0.4)`,
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.02em',
                      opacity: (!file || isLoading) ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Mengimpor...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Import Data
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Success Modal */}
          <AnimatePresence>
            {showSuccessModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(3, 91, 113, 0.3)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1001,
                  padding: '20px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  style={{
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    borderRadius: '24px',
                    padding: '40px',
                    textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    position: 'relative',
                    width: '100%',
                    maxWidth: '400px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      margin: '0 auto 24px auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 20px 40px rgba(63, 186, 140, 0.4)`
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 600, damping: 20 }}
                    >
                      <Check style={{
                        width: '48px',
                        height: '48px',
                        color: 'white',
                        strokeWidth: 3
                      }} />
                    </motion.div>
                  </motion.div>

                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                      margin: '0 0 12px 0',
                      fontSize: '24px',
                      fontWeight: '700',
                      background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Berhasil!
                  </motion.h3>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{
                      margin: '0 0 32px 0',
                      fontSize: '16px',
                      color: colors.accent1,
                      lineHeight: '1.5',
                      opacity: 0.9
                    }}
                  >
                    Data user berhasil diimpor ke sistem
                  </motion.p>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseSuccessModal}
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.success} 100%)`,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: `0 8px 25px rgba(63, 186, 140, 0.3)`,
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.02em'
                    }}
                  >
                    Selesai
                  </motion.button>

                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseSuccessModal}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(3, 91, 113, 0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <X size={18} color={colors.primary} />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImportData;
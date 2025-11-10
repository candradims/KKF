import React, { useState } from 'react';
import { Upload, Check, X, FileSpreadsheet, Download } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import * as XLSX from 'xlsx'; 

const Import = ({ isOpen, onClose, onImport }) => {
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

  // Template Excel
  const downloadTemplate = () => {
    // Data contoh untuk template master_aktivasi 
    const templateData = [
      {
        service: 'Fiber Optic',
        satuan: 'Meter',
        pemasangan: 'Pemasangan Baru',
        harga_satuan: 150000
      },
      {
        service: 'Instalasi Router',
        satuan: 'Unit',
        pemasangan: 'Upgrade',
        harga_satuan: 250000
      },
      {
        service: 'Maintenance Jaringan',
        satuan: 'Paket',
        pemasangan: 'Maintenance',
        harga_satuan: 500000
      }
    ];

    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 30 },  // service
      { wch: 15 },  // satuan
      { wch: 20 },  // pemasangan
      { wch: 15 }   // harga_satuan
    ];
    
    // Style for header row (row 0)
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      
      // Add styling to header
      worksheet[cellAddress].s = {
        font: {
          bold: true,
          color: { rgb: "FFFFFF" },
          sz: 12
        },
        fill: {
          fgColor: { rgb: "035b71" }  // Primary color from your palette
        },
        alignment: {
          horizontal: "center",
          vertical: "center"
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }
    
    // Style for data rows with alternating colors
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const isEvenRow = (row % 2) === 0;
      
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = {
          font: {
            sz: 11
          },
          fill: {
            fgColor: { rgb: isEvenRow ? "F8FAFC" : "FFFFFF" }  // Alternating row colors
          },
          alignment: {
            horizontal: col === 3 ? "right" : "left",  // Right align for harga_satuan
            vertical: "center"
          },
          border: {
            top: { style: "thin", color: { rgb: "E2E8F0" } },
            bottom: { style: "thin", color: { rgb: "E2E8F0" } },
            left: { style: "thin", color: { rgb: "E2E8F0" } },
            right: { style: "thin", color: { rgb: "E2E8F0" } }
          }
        };
      }
    }
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Service');
    
    // Write file with styling support
    XLSX.writeFile(workbook, 'Template_Import_Service.xlsx', { 
      bookType: 'xlsx',
      cellStyles: true 
    });
  };

  // Template CSV
  const downloadCSVTemplate = () => {
    // CSV template untuk master_aktivasi dengan pemasangan
    const csvContent = [
      'service,satuan,pemasangan,harga_satuan',
      'Pemasangan Fiber Optic,Meter,Pemasangan Baru,150000',
      'Instalasi Router,Unit,Upgrade,250000',
      'Maintenance Jaringan,Paket,Maintenance,500000'
    ].join('\n');

    // Add BOM for UTF-8 to ensure proper encoding in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'Template_Import_Service.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
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

  // Helper function untuk parse number
  const parseNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const numValue = Number(String(value).replace(/[^\d]/g, ''));
    return isNaN(numValue) ? 0 : numValue;
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
          
          // Process data untuk master_aktivasi
          const mappedData = jsonData.map((row, index) => {
            console.log(`🔍 Raw row ${index}:`, row);
            const rowLower = {};
            Object.keys(row).forEach(key => {
              rowLower[key.toLowerCase()] = row[key];
            });
            
            const mappedRow = {
              service: 
                row.service || 
                rowLower.service || 
                row['Service'] || row['service'] || '',
              
              satuan: 
                row.satuan || 
                rowLower.satuan || 
                row['Satuan'] || row['satuan'] || '',
              
              pemasangan: 
                row.pemasangan || 
                rowLower.pemasangan || 
                row['Pemasangan'] || row['pemasangan'] || '',
              
              harga_satuan: parseNumber(
                row.harga_satuan || 
                rowLower.harga_satuan || 
                row['Harga Satuan'] || 
                row['harga satuan'] ||
                row.harga || 
                rowLower.harga ||
                row['Harga'] ||
                0
              )
            };
            
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
          console.log('🔍 ========== CSV PARSING START ==========');
          const csvText = e.target.result;
          console.log('📄 Raw CSV text:', csvText);
          console.log('📄 CSV text length:', csvText.length);
          
          // Remove BOM if present
          const cleanedText = csvText.replace(/^\uFEFF/, '');
          
          const lines = cleanedText.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '' && !line.startsWith('#'));
          
          console.log('📄 Total CSV lines after filter:', lines.length);
          console.log('📄 Lines:', lines);
          
          if (lines.length <= 1) {
            console.error('❌ Not enough lines in CSV (need header + data)');
            resolve([]);
            return;
          }
          
          // Parse header - keep it simple
          const headerLine = lines[0];
          console.log('📝 Raw header line:', headerLine);
          
          const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
          console.log('📝 Parsed headers:', headers);
          
          const results = [];
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            
            console.log(`\n--- Processing row ${i} ---`);
            console.log(`Raw line: "${line}"`);
            
            const values = line.split(',').map(v => v.trim());
            console.log(`Values:`, values);
            console.log(`Values count: ${values.length}, Headers count: ${headers.length}`);
            
            // Build row object by matching index
            const row = {
              service: '',
              satuan: '',
              pemasangan: '',
              harga_satuan: 0
            };
            
            headers.forEach((header, index) => {
              const value = values[index] || '';
              console.log(`  [${index}] "${header}" = "${value}"`);
              
              // Direct matching
              if (header === 'service') {
                row.service = value;
                console.log(`    ✓ service = "${value}"`);
              } else if (header === 'satuan') {
                row.satuan = value;
                console.log(`    ✓ satuan = "${value}"`);
              } else if (header === 'pemasangan') {
                row.pemasangan = value;
                console.log(`    ✓ pemasangan = "${value}"`);
              } else if (header === 'harga_satuan' || header === 'harga satuan') {
                const parsed = parseNumber(value);
                row.harga_satuan = parsed;
                console.log(`    ✓ harga_satuan = "${value}" → ${parsed}`);
              }
            });
            
            console.log(`Row ${i} final:`, JSON.stringify(row, null, 2));
            
            const isValid = row.service && row.satuan && row.harga_satuan > 0;
            console.log(`Validation:`, {
              hasService: !!row.service,
              hasSatuan: !!row.satuan,
              hasHargaSatuan: row.harga_satuan > 0,
              isValid
            });
            
            if (isValid) {
              console.log(`✅ Row ${i} is VALID`);
              results.push(row);
            } else {
              console.log(`❌ Row ${i} is INVALID`);
            }
          }
          
          console.log('\n========== CSV PARSING COMPLETE ==========');
          console.log('✅ Total valid results:', results.length);
          console.log('✅ Results:', JSON.stringify(results, null, 2));
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
  const parseFileToServices = async (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    console.log('\n� ========== PARSE FILE TO SERVICES START ==========');
    console.log('📁 File name:', file.name);
    console.log('📁 File type:', file.type);
    console.log('📁 File extension:', fileExtension);
    
    try {
      let services = [];
      
      if (fileExtension === 'csv') {
        console.log('📄 Processing as CSV file...');
        services = await parseCSV(file);
        console.log('📄 CSV parsing returned:', services.length, 'items');
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        console.log('📊 Processing as Excel file...');
        services = await parseExcel(file);
        console.log('📊 Excel parsing returned:', services.length, 'items');
      } else {
        throw new Error('Format file tidak didukung');
      }
      
      console.log('📋 Services before filter:', services);
      
      const validServices = services.filter(item => {
        const isValid = item.service && item.satuan && item.harga_satuan && item.harga_satuan > 0;
        console.log(`Filter check:`, {
          service: item.service,
          satuan: item.satuan,
          harga_satuan: item.harga_satuan,
          isValid
        });
        return isValid;
      });
      
      console.log('========== PARSE FILE TO SERVICES COMPLETE ==========');
      console.log('✅ Valid services count:', validServices.length);
      console.log('✅ Valid services:', validServices);
      return validServices;
      
    } catch (error) {
      console.error('❌ Parse file error:', error);
      throw error;
    }
  };

  const handleImportClick = async () => {
    if (file) {
      setIsLoading(true);
      setError('');
      
      try {
        console.log("🚀 Starting import process...", file);
        
        // Dapatkan authentication headers DULU sebelum parsing
        const authHeaders = getAuthHeaders();
        
        // Validasi auth headers
        if (!authHeaders['X-User-ID'] || !authHeaders['X-User-Role'] || !authHeaders['X-User-Email']) {
          setError('Sesi login tidak ditemukan. Silakan login kembali.');
          setIsLoading(false);
          return;
        }
        
        console.log("🔐 Auth headers validated:", authHeaders);
        
        // Parse file
        const services = await parseFileToServices(file);
        
        console.log("📊 Services parsed from parseFileToServices:", services);
        console.log("📊 Services count:", services ? services.length : 0);
        console.log("📊 Services data detail:", JSON.stringify(services, null, 2));
        
        if (!services || services.length === 0) {
          console.error("❌ No services returned from parseFileToServices");
          setError('Tidak ada data yang valid ditemukan dalam file. Pastikan file memiliki data dengan format yang benar.');
          setIsLoading(false);
          return;
        }

        // Validasi dan normalisasi data - services sudah ter-filter di parseFileToServices
        // Jadi kita hanya perlu normalisasi saja
        const validServices = services.map(service => ({
          service: service.service.trim(),
          satuan: service.satuan.trim(),
          pemasangan: service.pemasangan ? service.pemasangan.trim() : '',
          harga_satuan: service.harga_satuan && !isNaN(service.harga_satuan) ? parseInt(service.harga_satuan) : 0
        }));

        console.log("✅ Valid services ready for import:", validServices);
        console.log("✅ Valid services count:", validServices.length);
        console.log("📤 Sending request with headers:", {
          ...authHeaders,
          'Content-Type': 'application/json'
        });

        const response = await fetch('http://localhost:3000/api/master-aktivasi/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify({ items: validServices }),
        });

        console.log("📨 Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Server error response:", errorText);
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

  // Fungsi untuk mendapatkan authentication headers
  const getAuthHeaders = () => {
    try {
      console.log('🔍 Getting auth headers from localStorage...');
      
      // Coba berbagai key yang mungkin digunakan untuk menyimpan user data
      const possibleKeys = ['userData', 'user', 'currentUser', 'authUser'];
      let user = null;
      
      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found user data in key: ${key}`);
          try {
            user = JSON.parse(data);
            if (user && user.id_user && user.role_user && user.email_user) {
              console.log('✅ Valid user data found:', {
                id_user: user.id_user,
                role_user: user.role_user,
                email_user: user.email_user
              });
              break;
            }
          } catch (e) {
            console.warn(`Failed to parse data from ${key}:`, e);
          }
        }
      }
      
      if (!user || !user.id_user || !user.role_user || !user.email_user) {
        console.error('❌ No valid user data found in localStorage');
        console.log('📋 Available localStorage keys:', Object.keys(localStorage));
        return {};
      }
      
      const headers = {
        'X-User-ID': String(user.id_user),
        'X-User-Role': String(user.role_user),
        'X-User-Email': String(user.email_user)
      };
      
      console.log('✅ Auth headers prepared:', headers);
      return headers;
      
    } catch (error) {
      console.error('❌ Error getting auth headers:', error);
      return {};
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
    
    // Trigger refresh data di parent component
    if (onImport) {
      onImport();
    }
    
    // Tutup import modal
    onClose();
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
              fontFamily: "'Open Sans', sans-serif !important",
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
                  Import Data Service
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Unggah file Excel/CSV untuk mengimpor data master aktivasi
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
                {/* Template Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{
                    marginBottom: '32px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(3, 91, 113, 0.05) 0%, rgba(0, 191, 202, 0.03) 100%)',
                    borderRadius: '12px',
                    border: `1px solid ${colors.secondary}30`
                  }}
                >
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Download size={18} />
                    Download Template
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: colors.accent1,
                    marginBottom: '16px',
                    lineHeight: '1.5'
                  }}>
                    Unduh template untuk memastikan format file sesuai
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={downloadTemplate}
                      style={{
                        background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.secondary} 100%)`,
                        color: 'white',
                        border: 'none',
                        padding: '12px 12px',
                        borderRadius: '8px',
                        fontWeight: '500',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: `0 2px 10px rgba(63, 186, 140, 0.3)`
                      }}
                    >
                      <FileSpreadsheet size={16} />
                      Template Excel (.xlsx)
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={downloadCSVTemplate}
                      style={{
                        background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.accent1} 100%)`,
                        color: 'white',
                        border: 'none',
                        padding: '12px 12px',
                        borderRadius: '8px',
                        fontWeight: '500',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: `0 2px 10px rgba(0, 162, 185, 0.3)`
                      }}
                    >
                      <FileSpreadsheet size={16} />
                      Template CSV (.csv)
                    </motion.button>
                  </div>
                </motion.div>

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
                        Format yang didukung: .xlsx, .csv
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
                  fontFamily: "'Open Sans', sans-serif !important",
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
                    Data service berhasil diimpor ke master aktivasi
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

export default Import;
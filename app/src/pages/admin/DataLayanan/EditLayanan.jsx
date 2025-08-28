import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditLayanan = ({ isOpen, onClose, onSave, initialData }) => {
  console.log('🔄 EditLayanan render:', { isOpen, initialData }); // Debug log
  
  // Add custom scrollbar styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 12px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #94a3b8;
        border-radius: 10px;
        border: 2px solid #f1f5f9;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:active {
        background: #475569;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  const [layananOptions, setLayananOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [hjtOptions, setHjtOptions] = useState([]);

  // Form state - sesuaikan dengan struktur data dari Index.jsx
  const [formData, setFormData] = useState({
    namaLayanan: '',
    hjt: '',
    satuan: '',
    backbone: '',
    port: '',
    tarifAkses: '',
    tarif: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  
  // Debug log for showSuccess state changes
  useEffect(() => {
    console.log("🔔 EditLayanan: showSuccess state changed to:", showSuccess);
  }, [showSuccess]);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    layanan: false,
    hjt: false,
    satuan: false
  });

  // Fetch dynamic options from database
  useEffect(() => {
    const fetchOptionsFromDatabase = async () => {
      if (!isOpen) return;
      
      try {
        console.log("🔍 Fetching options from database");
        
        const response = await fetch('http://localhost:3000/api/layanan/public');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        const data = Array.isArray(result) ? result : result.data || [];
        
        // Ambil unique nama_layanan, satuan, dan wilayah_hjt dari database
        const uniqueLayanan = [...new Set(data.map(item => item.nama_layanan).filter(Boolean))];
        const uniqueSatuan = [...new Set(data.map(item => item.satuan).filter(Boolean))];
        const uniqueHjt = [...new Set(data.map(item => item.wilayah_hjt).filter(Boolean))];
        
        setLayananOptions(uniqueLayanan.sort());
        setSatuanOptions(uniqueSatuan.sort());
        setHjtOptions(uniqueHjt.sort());
        
        console.log("✅ Options loaded:", { 
          layanan: uniqueLayanan.length, 
          satuan: uniqueSatuan.length,
          hjt: uniqueHjt.length 
        });
        console.log("🔍 Satuan options:", uniqueSatuan); // Debug log untuk satuan
      } catch (error) {
        console.error("❌ Gagal mengambil data options:", error);
        // Fallback ke data default jika gagal
        setLayananOptions([
          "IP VPN (1 sd 10 Mbps)",
          "IP VPN (11 sd 50 Mbps)",
          "IP VPN (51 sd 100 Mbps)",
          "IP VPN (101 sd 500 Mbps)",
          "IP VPN (501 sd 1000 Mbps)",
          "IP VPN (>1 Gbps)",
          "MPLS",
          "Internet Dedicated",
          "DIA (Dedicated Internet Access)",
          "CoLo (Colocation)",
          "Cloud Service",
          "Dark Fiber"
        ]);
        setSatuanOptions([
          "Mbps",
          "Gbps", 
          "Port",
          "Unit",
          "Rack",
          "Slot",
          "Bandwidth",
          "Connection",
          "License",
          "Instance",
          "TB",
          "GB",
          "User",
          "Device",
          "Site"
        ]);
        setHjtOptions([
          "Jakarta",
          "Sumatra",
          "Kalimantan",
          "Sulawesi",
          "Papua"
        ]);
      }
    };

    fetchOptionsFromDatabase();
  }, [isOpen]);

  // Initialize form with initial data
  useEffect(() => {
    if (initialData && isOpen) {
      console.log('EditLayanan initialData:', initialData); // Debug log
      setFormData({
        namaLayanan: initialData.namaLayanan || '',
        hjt: initialData.hjt || '',
        satuan: initialData.satuan || '',
        backbone: initialData.backbone || '',
        port: initialData.port || '',
        tarifAkses: initialData.tarifAkses || '',
        tarif: initialData.tarif || ''
      });
    }
  }, [initialData, isOpen]);

  // Remove auto-calculate since we're using the existing structure
  // Auto-calculate is not needed for this form structure

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDropdownSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDropdownOpen(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const toggleDropdown = (field) => {
    console.log(`🔄 Toggle dropdown ${field}, current options:`, {
      layanan: layananOptions.length,
      satuan: satuanOptions.length,
      hjt: hjtOptions.length
    });
    if (field === 'satuan') {
      console.log('🔍 Satuan options detail:', satuanOptions);
    }
    setIsDropdownOpen(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.namaLayanan) {
      alert('Nama layanan harus diisi!');
      return;
    }
    if (!formData.hjt) {
      alert('HJT harus dipilih!');
      return;
    }
    if (!formData.satuan) {
      alert('Satuan harus diisi!');
      return;
    }

    try {
      console.log("📝 EditLayanan: Starting save process with data:", formData);
      
      const dataToSave = {
        ...initialData,
        namaLayanan: formData.namaLayanan,
        hjt: formData.hjt,
        satuan: formData.satuan,
        backbone: formData.backbone,
        port: formData.port,
        tarifAkses: formData.tarifAkses,
        tarif: formData.tarif
      };

      console.log("📤 EditLayanan: Calling onSave with:", dataToSave);
      await onSave(dataToSave);
      console.log("✅ EditLayanan: onSave completed successfully");
      setShowSuccess(true);
      console.log("✅ EditLayanan: Success modal should now be visible");
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('❌ EditLayanan: Error updating data:', error);
      alert('Terjadi kesalahan saat mengupdate data: ' + error.message);
    }
  };

  if (!isOpen) return null;

  // Early return dengan pesan loading jika belum ada data
  if (isOpen && !initialData) {
    console.log('⚠️ No initialData provided');
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, color: 'white', fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && !showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', fontFamily: 'Inter, sans-serif'
            }}
          >
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [0, -5, 5, -5, 5, -3, 3, 0], opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                backgroundColor: '#ffffff', borderRadius: '16px', width: '100%',
                maxWidth: '800px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                position: 'relative', padding: '24px', paddingBottom: '32px'
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <h2 style={{
                  fontSize: '26px', fontWeight: '800', color: '#2D3A76', margin: 0
                }}>
                  Edit Layanan
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{
                backgroundColor: '#E9EDF7', borderRadius: '20px', padding: '32px',
                margin: '0 auto', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                maxWidth: '600px', marginBottom: '32px'
              }}>
                {/* Nama Layanan Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B', display: 'block', marginBottom: '8px' }}>
                    Nama Layanan*
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div
                      onClick={() => toggleDropdown('layanan')}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(45, 58, 118, 0.5)',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#2D396B'
                      }}
                    >
                      <span>{formData.namaLayanan || 'Pilih Nama Layanan'}</span>
                      <span style={{ transform: isDropdownOpen.layanan ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                    </div>
                    {isDropdownOpen.layanan && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(45, 58, 118, 0.5)',
                        borderRadius: '10px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#cbd5e0 #f7fafc'
                      }}
                      className="custom-scrollbar"
                      >
                        {layananOptions.map((option) => (
                          <div
                            key={option}
                            onClick={() => handleDropdownSelect('namaLayanan', option)}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f0f0f0',
                              color: '#2D396B'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* HJT Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B', display: 'block', marginBottom: '8px' }}>
                    HJT*
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div
                      onClick={() => toggleDropdown('hjt')}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(45, 58, 118, 0.5)',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#2D396B'
                      }}
                    >
                      <span>{formData.hjt || 'Pilih HJT'}</span>
                      <span style={{ transform: isDropdownOpen.hjt ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                    </div>
                    {isDropdownOpen.hjt && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(45, 58, 118, 0.5)',
                        borderRadius: '10px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#cbd5e0 #f7fafc'
                      }}
                      className="custom-scrollbar"
                      >
                        {hjtOptions.map((option) => (
                          <div
                            key={option}
                            onClick={() => handleDropdownSelect('hjt', option)}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f0f0f0',
                              color: '#2D396B'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Satuan Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B', display: 'block', marginBottom: '8px' }}>
                    Satuan*
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div
                      onClick={() => toggleDropdown('satuan')}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(45, 58, 118, 0.5)',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#2D396B'
                      }}
                    >
                      <span>{formData.satuan || 'Pilih Satuan'}</span>
                      <span style={{ transform: isDropdownOpen.satuan ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                    </div>
                    {isDropdownOpen.satuan && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(45, 58, 118, 0.5)',
                        borderRadius: '10px',
                        maxHeight: '120px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#94a3b8 #f1f5f9'
                      }}
                      className="custom-scrollbar"
                      >
                        {satuanOptions.length === 0 ? (
                          <div style={{
                            padding: '12px 16px',
                            color: '#6b7280',
                            textAlign: 'center'
                          }}>
                            Memuat data satuan...
                          </div>
                        ) : (
                          <>
                            {/* Force scroll indicator */}
                            <div style={{
                              padding: '8px 16px',
                              backgroundColor: '#f8fafc',
                              borderBottom: '1px solid #e2e8f0',
                              fontSize: '12px',
                              color: '#64748b',
                              textAlign: 'center'
                            }}>
                              {satuanOptions.length} opsi tersedia - scroll untuk melihat semua
                            </div>
                            {satuanOptions.map((option) => (
                              <div
                                key={option}
                                onClick={() => handleDropdownSelect('satuan', option)}
                                style={{
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #f0f0f0',
                                  color: '#2D396B'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              >
                                {option}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Backbone Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B', display: 'block', marginBottom: '8px' }}>
                    Backbone
                  </label>
                  <input
                    type="text"
                    name="backbone"
                    value={formData.backbone}
                    onChange={handleInputChange}
                    placeholder="Masukkan backbone"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      color: '#2D396B'
                    }}
                  />
                </div>

                {/* Port Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B', display: 'block', marginBottom: '8px' }}>
                    Port
                  </label>
                  <input
                    type="number"
                    name="port"
                    value={formData.port}
                    onChange={handleInputChange}
                    placeholder="Masukkan port"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      color: '#2D396B'
                    }}
                  />
                </div>

                {/* Tarif Akses Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B', display: 'block', marginBottom: '8px' }}>
                    Tarif Akses
                  </label>
                  <input
                    type="number"
                    name="tarifAkses"
                    value={formData.tarifAkses}
                    onChange={handleInputChange}
                    placeholder="Masukkan tarif akses"
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      color: '#2D396B'
                    }}
                  />
                </div>

                {/* Tarif Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B', display: 'block', marginBottom: '8px' }}>
                    Tarif
                  </label>
                  <input
                    type="number"
                    name="tarif"
                    value={formData.tarif}
                    onChange={handleInputChange}
                    placeholder="Masukkan tarif"
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      color: '#2D396B'
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: '32px' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      backgroundColor: '#6c757d',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 32px',
                      borderRadius: '50px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#035b71',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 32px',
                      borderRadius: '50px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px',
                width: '90%'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#00a2b9',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Check size={30} color="#ffffff" />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#035b71',
                margin: '0 0 10px',
                fontFamily: 'Inter, sans-serif'
              }}>
                Berhasil!
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Data layanan berhasil diperbarui
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditLayanan;

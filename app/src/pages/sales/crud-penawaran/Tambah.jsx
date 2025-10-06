import React, { useState, useEffect } from "react";
import { X, Plus, Calculator, Check, User, FileText, ClipboardList, BarChart3, DollarSign, Package, Settings } from "lucide-react";
import { getUserData } from "../../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const layananOptions = [
  "IP VPN (1 sd 10 Mbps)",
  "IP VPN (11 sd 50 Mbps)",
];

// Helper untuk format tanggal yyyy-mm-dd
const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const Tambah = ({ isOpen, onClose, onSave }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAdditionalSection, setShowAdditionalSection] = useState(false);
  const [layananData, setLayananData] = useState([]);
  const [filteredLayananData, setFilteredLayananData] = useState([]);
  const [availableHjtWilayah, setAvailableHjtWilayah] = useState([]);
  const [availableNamaLayanan, setAvailableNamaLayanan] = useState([]);
  const [availableDetailLayanan, setAvailableDetailLayanan] = useState([]);
  const [loadingLayanan, setLoadingLayanan] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [availableReferensiHJT, setAvailableReferensiHJT] = useState([]);
  const [focusedField, setFocusedField] = useState('');
  const [showPengeluaranButton, setShowPengeluaranButton] = useState(true);

  // Color palette from the second example
  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  const [formData, setFormData] = useState({
    sales: "",
    tanggal: getTodayDate(),
    pelanggan: "",
    nomorKontrak: "",
    kontrakTahunKe: "",
    referensiHJT: "",
    durasiKontrak: "",
    namaLayanan: "",
    detailLayanan: "",
    kapasitas: "",
    qty: "",
    aksesExisting: "",
    marginPercent: "",
    discount: "",
  });

  // State for multiple layanan items
  const [layananItems, setLayananItems] = useState([
    {
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      qty: "",
      aksesExisting: "",
      marginPercent: ""
    }
  ]);

  // Separate state for multiple pengeluaran items
  const [pengeluaranItems, setPengeluaranItems] = useState([
    { item: "", keterangan: "", hasrat: "", jumlah: "" }
  ]);

  // Input style function
  const inputStyle = (fieldName) => ({
    padding: '16px 16px 16px 48px',
    borderRadius: '12px',
    border: `2px solid ${focusedField === fieldName ? colors.secondary : 'rgba(3, 91, 113, 0.38)'}`,
    fontSize: '14px',
    backgroundColor: focusedField === fieldName ? 'rgba(0, 191, 202, 0.05)' : '#ffffff',
    color: colors.primary,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    boxShadow: focusedField === fieldName 
      ? `0 0 0 3px rgba(0, 191, 202, 0.1)` 
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    fontFamily: "'Open Sans', sans-serif !important"
  });

  const selectStyle = (fieldName) => ({
    ...inputStyle(fieldName),
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(focusedField === fieldName ? colors.secondary : colors.primary)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '20px',
    cursor: 'pointer',
    paddingRight: '48px'
  });

  const iconContainerStyle = (fieldName) => ({
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: focusedField === fieldName ? colors.secondary : colors.primary,
    transition: 'color 0.3s ease',
    zIndex: 1
  });

  // Auto-fill sales field dengan nama user yang login
  useEffect(() => {
    const userData = getUserData();
    if (userData && userData.nama_user) {
      setFormData(prev => ({
        ...prev,
        sales: userData.nama_user
      }));
    }
  }, []);

  // Load data layanan when component first mounts
  useEffect(() => {
    console.log('🚀 Component mounted, loading layanan data...');
    loadLayananData();
  }, []);

  // Reset form and load data when modal opens
  useEffect(() => {
    console.log('🎭 useEffect triggered - isOpen:', isOpen);
    if (isOpen) {
      console.log('✅ isOpen is true, resetting form and loading layanan data...');
      const userData = getUserData();
      setFormData({
        sales: userData?.nama_user || "",
        tanggal: getTodayDate(),
        pelanggan: "",
        nomorKontrak: "",
        kontrakTahunKe: "",
        referensiHJT: "",
        durasiKontrak: "",
        namaLayanan: "",
        detailLayanan: "",
        kapasitas: "",
        satuan: "",
        qty: "",
        aksesExisting: "",
        marginPercent: "",
        discount: "",
        backbone: "",
        port: "",
        tarifAkses: "",
        tarif: "",
      });
      
      setLayananItems([{
        namaLayanan: "",
        detailLayanan: "",
        kapasitas: "",
        qty: "",
        aksesExisting: "",
        marginPercent: ""
      }]);
      
      setPengeluaranItems([{ item: "", keterangan: "", hasrat: "", jumlah: "" }]);
      
      setSelectedLayanan(null);
      setAvailableNamaLayanan([]);
      setAvailableDetailLayanan([]);
      setShowAdditionalSection(false);
      setShowConfirmModal(false);
      setIsSaving(false);
      setShowPengeluaranButton(true);
      
      loadLayananData();
    } else {
      console.log('❌ isOpen is false, not loading layanan data');
    }
  }, [isOpen]);

  // Function to load layanan data from API
  const loadLayananData = async () => {
    try {
      setLoadingLayanan(true);
      console.log('🔄 Starting to load layanan data...');
      
      const userData = getUserData();
      console.log('👤 User data:', userData);
      
      if (!userData) {
        console.error('❌ No user data found');
        return;
      }
      
      const response = await fetch('http://localhost:3000/api/layanan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userData.id_user.toString(),
          'X-User-Role': userData.role_user,
          'X-User-Email': userData.email_user
        }
      });

      console.log('📡 API Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setLayananData(result.data);

          const uniqueWilayah = [...new Set(result.data.map(item => item.wilayah_hjt))].filter(Boolean);
          setAvailableHjtWilayah(uniqueWilayah);
          setAvailableReferensiHJT(uniqueWilayah); 
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to load layanan data. Status:', response.status, 'Response:', errorText);
      }
    } catch (error) {
      console.error('❌ Error loading layanan data:', error);
    } finally {
      setLoadingLayanan(false);
    }
  };

  // Function to get the correct dropdown value for display
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'referensiHJT') {
      setFormData((prev) => ({
        ...prev,
        referensiHJT: value,
        namaLayanan: "",
        detailLayanan: "",
      }));
      const filtered = layananData.filter(layanan => layanan.wilayah_hjt === value);
      setFilteredLayananData(filtered);
      const uniqueNamaLayanan = [...new Set(filtered.map(item => item.nama_layanan))].filter(Boolean);
      setAvailableNamaLayanan(uniqueNamaLayanan);
      setAvailableDetailLayanan([]);
      setSelectedLayanan(null);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper functions for managing multiple pengeluaran items
  const handlePengeluaranItemChange = (index, field, value) => {
    const updatedItems = [...pengeluaranItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setPengeluaranItems(updatedItems);
  };

  const addPengeluaranItem = () => {
    setPengeluaranItems([...pengeluaranItems, { item: "", keterangan: "", hasrat: "", jumlah: "" }]);
  };

  const removePengeluaranItem = (index) => {
    if (pengeluaranItems.length > 1) {
      const updatedItems = pengeluaranItems.filter((_, i) => i !== index);
      setPengeluaranItems(updatedItems);
    }
  };

  const getTotalPengeluaran = () => {
    return pengeluaranItems.reduce((total, item) => {
      const hasrat = parseFloat(item.hasrat || 0);
      const jumlah = parseInt(item.jumlah || 0);
      return total + (hasrat * jumlah);
    }, 0);
  };

  // Helper function to get detail layanan options specific to each layanan item
  const getDetailLayananOptions = (referensiHJT, namaLayanan) => {
    if (!layananData || !referensiHJT || !namaLayanan) {
      return [];
    }
    
    const filtered = layananData.filter(layanan =>
      layanan.wilayah_hjt === referensiHJT && layanan.nama_layanan === namaLayanan
    );
    const uniqueDetailLayanan = [...new Set(filtered.map(item => item.jenis_layanan))].filter(Boolean);
    
    console.log(`📋 Tambah: Detail layanan options for "${namaLayanan}":`, uniqueDetailLayanan);
    return uniqueDetailLayanan;
  };

  // Helper functions for layanan items
  const handleLayananItemChange = (index, field, value) => {
    const updatedItems = [...layananItems];
    updatedItems[index][field] = value;

    if (field === 'namaLayanan') {
      console.log(`📊 Tambah: Nama Layanan selected for layanan #${index + 1}:`, value);
      updatedItems[index].detailLayanan = '';
      console.log(`📋 Tambah: Detail layanan will be filtered dynamically for layanan #${index + 1}`);
    }
    
    if (field === 'detailLayanan') {
      const selectedLayanan = layananData.find(layanan => 
        layanan.wilayah_hjt === formData.referensiHJT && 
        layanan.nama_layanan === updatedItems[index].namaLayanan && 
        layanan.jenis_layanan === value
      );

      if (selectedLayanan) {
        console.log('🎯 Tambah: Found selected layanan:', selectedLayanan);
        setSelectedLayanan(selectedLayanan);
        
        if (!updatedItems[index].kapasitas) {
          updatedItems[index].kapasitas = selectedLayanan.kapasitas || '';
        }
      }
    }
    
    setLayananItems(updatedItems);
  };

  const addLayananItem = () => {
    const newItem = {
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      qty: "",
      aksesExisting: "",
      marginPercent: ""
    };
    setLayananItems([...layananItems, newItem]);
  };

  const removeLayananItem = (index) => {
    if (layananItems.length > 1) {
      const updatedItems = layananItems.filter((_, i) => i !== index);
      setLayananItems(updatedItems);
    }
  };

  // Get available nama layanan options for specific layanan item
  const getAvailableNamaLayanan = (index) => {
    return availableNamaLayanan;
  };

  // Override the existing getDetailLayananOptions for specific layanan item  
  const getDetailLayananOptionsForItem = (index) => {
    const item = layananItems[index];
    if (!formData.referensiHJT || !item.namaLayanan) {
      return [];
    }
    
    const filtered = layananData.filter(layanan =>
      layanan.wilayah_hjt === formData.referensiHJT && 
      layanan.nama_layanan === item.namaLayanan
    );
    
    return [...new Set(filtered.map(item => item.jenis_layanan))].filter(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const requiredFields = [
      'pelanggan',
      'nomorKontrak',
      'durasiKontrak',
      'referensiHJT'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    const invalidLayananItems = [];
    layananItems.forEach((item, index) => {
      const missingLayananFields = [];
      if (!item.namaLayanan) missingLayananFields.push('Nama Layanan');
      if (!item.detailLayanan) missingLayananFields.push('Detail Layanan');
      if (!item.kapasitas) missingLayananFields.push('Kapasitas');
      if (!item.qty) missingLayananFields.push('QTY');
      if (!item.aksesExisting) missingLayananFields.push('Akses Existing');
      if (!item.marginPercent) missingLayananFields.push('Margin %');
      
      if (missingLayananFields.length > 0) {
        invalidLayananItems.push(`Layanan #${index + 1}: ${missingLayananFields.join(', ')}`);
      }
    });
    
    if (missingFields.length > 0) {
      const fieldNames = {
        'pelanggan': 'Pelanggan',
        'nomorKontrak': 'Nomor Kontrak',
        'durasiKontrak': 'Durasi Kontrak',
        'referensiHJT': 'Referensi HJT'
      };
      const translatedFields = missingFields.map(field => fieldNames[field] || field);
      console.log('❌ Tambah: Global validation failed. Missing fields:', missingFields);
      alert(`Harap isi field yang wajib: ${translatedFields.join(', ')}`);
      return;
    }

    if (invalidLayananItems.length > 0) {
      console.log('❌ Tambah: Layanan validation failed. Invalid items:', invalidLayananItems);
      alert(`Harap isi field layanan yang wajib:\n${invalidLayananItems.join('\n')}`);
      return;
    }

    if (showAdditionalSection) {
      const invalidItems = [];
      pengeluaranItems.forEach((item, index) => {
        const missingFields = [];
        if (!item.item) missingFields.push('Item');
        if (!item.keterangan) missingFields.push('Keterangan');
        if (!item.hasrat) missingFields.push('Harga Satuan');
        if (!item.jumlah) missingFields.push('Jumlah');
        
        if (missingFields.length > 0) {
          invalidItems.push(`Item #${index + 1}: ${missingFields.join(', ')}`);
        }
      });
      
      if (invalidItems.length > 0) {
        alert(`Harap isi field pengeluaran yang wajib:\n${invalidItems.join('\n')}`);
        return;
      }
    }

    console.log('🚀 Submitting form data:', formData);
    console.log('📦 Layanan items:', layananItems);

    setIsSaving(true);
    
    const dataToSend = {
      ...formData,
      layananItems: layananItems,
      selectedLayananId: selectedLayanan?.id_layanan,
      satuan: formData.satuan,
      backbone: formData.backbone,
      port: formData.port,
      tarif_akses: formData.tarifAkses,
      tarif: formData.tarif,
      piliLayanan: layananItems.map(item => `${item.namaLayanan} - ${item.detailLayanan}`).join('; '),
      pengeluaranItems: showAdditionalSection ? pengeluaranItems : [],
      total_pengeluaran_lain_lain: showAdditionalSection ? getTotalPengeluaran() : 0
    };
    
    onSave(dataToSend);
  };

  // Reset form state completely
  const resetFormState = () => {
    console.log('🔄 Resetting form state...');
    
    const userData = getUserData();
    setFormData({
      sales: userData?.nama_user || "",
      tanggal: getTodayDate(),
      pelanggan: "",
      nomorKontrak: "",
      kontrakTahunKe: "",
      referensiHJT: "",
      durasiKontrak: "",
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      satuan: "",
      qty: "",
      aksesExisting: "",
      marginPercent: "",
      discount: "",
      backbone: "",
      port: "",
      tarifAkses: "",
      tarif: "",
    });
    
    setLayananItems([{
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      qty: "",
      aksesExisting: "",
      marginPercent: ""
    }]);
    
    setPengeluaranItems([{ item: "", keterangan: "", hasrat: "", jumlah: "" }]);
    
    setSelectedLayanan(null);
    setAvailableNamaLayanan([]);
    setAvailableDetailLayanan([]);
    setFilteredLayananData([]);
    setShowAdditionalSection(false);
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    setLoadingLayanan(false);
    setIsSaving(false);
    setShowPengeluaranButton(true);
    
    console.log('✅ Form state reset complete');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    resetFormState();
    onClose();
  };

  const handleCancel = () => {
    resetFormState();
    onClose();
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowAdditionalSection(true);
    setShowPengeluaranButton(false); // Sembunyikan tombol setelah dikonfirmasi Ya
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    // Tetap tampilkan tombol jika diklik Tidak
  };

  if (!isOpen && !showSuccessModal && !showConfirmModal) return null;

  return (
    <>
      <style>
        {`
          input::placeholder {
            color: ${colors.accent1};
            opacity: 0.6;
            fontFamily: "'Open Sans', sans-serif !important";
          }
          select:invalid {
            color: ${colors.accent1};
            opacity: 0.6;
            fontFamily: "'Open Sans', sans-serif !important";
          }
          select option {
            color: ${colors.primary};
            background-color: #e7f3f5ff;
            fontFamily: "'Open Sans', sans-serif !important";
          }
        `}
      </style>

      <AnimatePresence>
        {isOpen && !showSuccessModal && (
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
              padding: '20px'
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
                maxWidth: '900px',
                padding: '20px',
                boxShadow: `
                  0 12px 30px rgba(0, 0, 0, 0.12), 
                  0 4px 12px rgba(0, 0, 0, 0.08)`,
                border: '1px solid rgba(255, 255, 255, 0.6)',
                position: 'relative',
                overflow: 'hidden',
                maxHeight: '90vh',
                overflowY: 'auto'
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
                onClick={onClose}
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
                  <FileText size={32} color="white" />
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
                  Tambah Data Penawaran
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Lengkapi informasi penawaran baru
                </p>
              </motion.div>

              {/* Form */}
              <motion.form 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                id="form-tambah-penawaran" 
                onSubmit={handleSubmit} 
                style={{
                  background: 'linear-gradient(145deg, rgba(0, 191, 202, 0.03) 0%, rgba(3, 91, 113, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '40px',
                  margin: '0 32px 32px',
                  border: `1px solid rgba(0, 192, 202, 0.68)`,
                  position: 'relative'
                }}
              >
                {/* Sales Field */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Sales *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('sales')}>
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="sales"
                      value={formData.sales}
                      readOnly
                      placeholder="Auto-filled from login"
                      style={{
                        ...inputStyle('sales'),
                        backgroundColor: '#f8f9fa',
                        cursor: 'not-allowed',
                        color: '#6c757d'
                      }}
                    />
                  </div>
                </motion.div>

                {/* Tanggal */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Tanggal *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('tanggal')}>
                      <ClipboardList size={18} />
                    </div>
                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      readOnly
                      disabled
                      required
                      style={{
                        ...inputStyle('tanggal'),
                        backgroundColor: '#f5f5f5',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>
                </motion.div>

                {/* Pelanggan */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Nama Pelanggan *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('pelanggan')}>
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="pelanggan"
                      value={formData.pelanggan}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      placeholder="Masukkan nama pelanggan"
                      required
                      onFocus={() => setFocusedField('pelanggan')}
                      onBlur={() => setFocusedField('')}
                      style={inputStyle('pelanggan')}
                    />
                  </div>
                </motion.div>

                {/* Nomor Kontrak */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Nomor Kontrak / BAKB *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('nomorKontrak')}>
                      <FileText size={18} />
                    </div>
                    <input
                      type="text"
                      name="nomorKontrak"
                      value={formData.nomorKontrak}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      placeholder="Masukkan nomor kontrak"
                      required
                      onFocus={() => setFocusedField('nomorKontrak')}
                      onBlur={() => setFocusedField('')}
                      style={inputStyle('nomorKontrak')}
                    />
                  </div>
                </motion.div>

                {/* Kontrak Tahun Ke */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Kontrak Tahun ke- *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('kontrakTahunKe')}>
                      <BarChart3 size={18} />
                    </div>
                    <input
                      type="text"
                      name="kontrakTahunKe"
                      value={formData.kontrakTahunKe}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      placeholder="Masukkan kontrak tahun ke berapa"
                      required
                      onFocus={() => setFocusedField('kontrakTahunKe')}
                      onBlur={() => setFocusedField('')}
                      style={inputStyle('kontrakTahunKe')}
                    />
                  </div>
                </motion.div>

                {/* Referensi HJT */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Referensi HJT *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('referensiHJT')}>
                      <Settings size={18} />
                    </div>
                    <select
                      name="referensiHJT"
                      value={formData.referensiHJT}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      required
                      onFocus={() => setFocusedField('referensiHJT')}
                      onBlur={() => setFocusedField('')}
                      style={selectStyle('referensiHJT')}
                    >
                      <option value="" disabled hidden>Pilih HJT</option>
                      {availableReferensiHJT.map((wilayah, idx) => (
                        <option key={idx} value={wilayah}>{wilayah}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {/* Durasi Kontrak */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  style={{
                    marginBottom: '24px',
                    position: 'relative'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '8px',
                    letterSpacing: '0.02em'
                  }}>
                    Durasi Kontrak (in thn) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconContainerStyle('durasiKontrak')}>
                      <BarChart3 size={18} />
                    </div>
                    <select
                      name="durasiKontrak"
                      value={formData.durasiKontrak}
                      onChange={handleInputChange}
                      required
                      onFocus={() => setFocusedField('durasiKontrak')}
                      onBlur={() => setFocusedField('')}
                      style={selectStyle('durasiKontrak')}
                    >
                      <option value="">Durasi Kontrak</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </motion.div>

                {/* Multiple Layanan Items */}
                <div style={{ marginBottom: "32px" }}>
                  {/* Header Section untuk Layanan */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      backgroundColor: "rgba(0, 191, 202, 0.08)",
                      borderRadius: "20px",
                      padding: "28px",
                      marginBottom: "68px",
                      border: `2px solid rgba(0, 192, 202, 0.25)`,
                      position: 'relative',
                      overflow: 'hidden',
                      top: '40px'
                    }}
                  >
                    {/* Decorative corner accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '120px',
                      height: '120px',
                      background: `linear-gradient(135deg, ${colors.secondary}20 0%, ${colors.tertiary}20 100%)`,
                      borderBottomLeftRadius: '100%',
                      zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Header Section dengan icon - CENTERED */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '28px',
                        paddingBottom: '16px',
                        borderBottom: `3px solid ${colors.secondary}30`,
                        textAlign: 'center'
                      }}>
                        {/* Icon Container */}
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 6px 20px rgba(0, 191, 202, 0.4)`,
                          marginBottom: '16px'
                        }}>
                          <Package size={28} color="white" />
                        </div>
                        
                        {/* Text Content */}
                        <div>
                          <h4 style={{
                            margin: 0,
                            fontSize: '22px',
                            fontWeight: '700',
                            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '8px'
                          }}>
                            Data Layanan
                          </h4>
                          <p style={{
                            margin: 0,
                            fontSize: '15px',
                            color: colors.accent1,
                            opacity: 0.8,
                            lineHeight: '1.4'
                          }}>
                            Kelola layanan untuk penawaran ini
                          </p>
                        </div>
                      </div>
                      
                      {/* Multiple Layanan Items */}
                      <div style={{
                        display: 'grid',
                        gap: '20px',
                        marginBottom: '28px'
                      }}>
                        {layananItems.map((item, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ 
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 300,
                              damping: 20
                            }}
                            style={{
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(189, 231, 225, 0.6) 100%)',
                              border: `2px solid ${colors.secondary}20`,
                              borderRadius: '18px',
                              padding: '24px',
                              position: 'relative',
                              backdropFilter: 'blur(10px)',
                              boxShadow: `
                                0 4px 20px rgba(0, 0, 0, 0.08),
                                0 2px 8px rgba(0, 0, 0, 0.04)
                              `,
                              overflow: 'hidden'
                            }}
                          >
                            {/* Background Pattern */}
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              width: '80px',
                              height: '80px',
                              background: `radial-gradient(circle, ${colors.secondary}08 0%, transparent 70%)`,
                              zIndex: 0
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                              {/* Header dengan nomor item dan tombol hapus */}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                paddingBottom: '16px',
                                borderBottom: `2px solid ${colors.secondary}15`
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '700'
                                  }}>
                                    {index + 1}
                                  </div>
                                  <span style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: colors.primary
                                  }}>
                                    Layanan
                                  </span>
                                </div>
                                
                                {layananItems.length > 1 && (
                                  <motion.button
                                    whileHover={{ scale: 1.05, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => removeLayananItem(index)}
                                    style={{
                                      background: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`,
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '10px',
                                      padding: '8px 16px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                                    }}
                                  >
                                    <X size={14} />
                                    Hapus
                                  </motion.button>
                                )}
                              </div>

                              {/* Grid Layout untuk Input Fields Layanan */}
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px',
                                marginBottom: '20px'
                              }}>
                                {/* Nama Layanan */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    📦 Nama Layanan *
                                  </label>
                                  <div style={{ position: "relative" }}>
                                    <div style={iconContainerStyle(`namaLayanan-${index}`)}>
                                      <Package size={18} />
                                    </div>
                                    <select
                                      value={item.namaLayanan}
                                      onChange={(e) => handleLayananItemChange(index, 'namaLayanan', e.target.value)}
                                      required
                                      disabled={loadingLayanan || !formData.referensiHJT}
                                      onFocus={() => setFocusedField(`namaLayanan-${index}`)}
                                      onBlur={() => setFocusedField('')}
                                      style={{
                                        ...selectStyle(`namaLayanan-${index}`),
                                        padding: '14px 16px 14px 48px',
                                        fontSize: '14px'
                                      }}
                                    >
                                      <option value="" disabled hidden>
                                        {loadingLayanan 
                                          ? "Memuat layanan..." 
                                          : !formData.referensiHJT 
                                            ? "Pilih Referensi HJT terlebih dahulu" 
                                            : "Pilih Nama Layanan"}
                                      </option>
                                      {getAvailableNamaLayanan(index).map((namaLayanan, namaIndex) => (
                                        <option key={namaIndex} value={namaLayanan}>
                                          {namaLayanan}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </motion.div>

                                {/* Detail Layanan */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    🔧 Detail Layanan *
                                  </label>
                                  <div style={{ position: "relative" }}>
                                    <div style={iconContainerStyle(`detailLayanan-${index}`)}>
                                      <Settings size={18} />
                                    </div>
                                    <select
                                      value={item.detailLayanan}
                                      onChange={(e) => handleLayananItemChange(index, 'detailLayanan', e.target.value)}
                                      required
                                      disabled={loadingLayanan || !item.namaLayanan}
                                      onFocus={() => setFocusedField(`detailLayanan-${index}`)}
                                      onBlur={() => setFocusedField('')}
                                      style={{
                                        ...selectStyle(`detailLayanan-${index}`),
                                        padding: '14px 16px 14px 48px',
                                        fontSize: '14px'
                                      }}
                                    >
                                      <option value="" disabled hidden>
                                        {loadingLayanan 
                                          ? "Memuat detail layanan..." 
                                          : !item.namaLayanan 
                                            ? "Pilih Nama Layanan terlebih dahulu" 
                                            : "Pilih Detail Layanan"}
                                      </option>
                                      {getDetailLayananOptionsForItem(index).map((detailLayanan, detailIndex) => (
                                        <option key={detailIndex} value={detailLayanan}>
                                          {detailLayanan}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </motion.div>

                                {/* Kapasitas */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    📊 Kapasitas *
                                  </label>
                                  <div style={{ position: 'relative' }}>
                                    <div style={iconContainerStyle(`kapasitas-${index}`)}>
                                      <BarChart3 size={18} />
                                    </div>
                                    <input
                                      type="text"
                                      value={item.kapasitas}
                                      onChange={(e) => handleLayananItemChange(index, 'kapasitas', e.target.value)}
                                      placeholder="Masukkan kapasitas"
                                      required
                                      onFocus={() => setFocusedField(`kapasitas-${index}`)}
                                      onBlur={() => setFocusedField('')}
                                      style={{
                                        ...inputStyle(`kapasitas-${index}`),
                                        padding: '14px 16px 14px 48px',
                                        fontSize: '14px'
                                      }}
                                    />
                                  </div>
                                </motion.div>

                                {/* QTY */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    🔢 QTY *
                                  </label>
                                  <div style={{ position: 'relative' }}>
                                    <div style={iconContainerStyle(`qty-${index}`)}>
                                      <Calculator size={18} />
                                    </div>
                                    <input
                                      type="number"
                                      value={item.qty}
                                      onChange={(e) => handleLayananItemChange(index, 'qty', e.target.value)}
                                      placeholder="Masukkan quantity"
                                      required
                                      onFocus={() => setFocusedField(`qty-${index}`)}
                                      onBlur={() => setFocusedField('')}
                                      style={{
                                        ...inputStyle(`qty-${index}`),
                                        padding: '14px 16px 14px 48px',
                                        fontSize: '14px'
                                      }}
                                    />
                                  </div>
                                </motion.div>

                                {/* Akses Existing */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    🔌 Akses Existing *
                                  </label>
                                  <div style={{ position: "relative" }}>
                                    <div style={iconContainerStyle(`aksesExisting-${index}`)}>
                                      <Settings size={18} />
                                    </div>
                                    <select
                                      value={item.aksesExisting}
                                      onChange={(e) => handleLayananItemChange(index, 'aksesExisting', e.target.value)}
                                      required
                                      onFocus={() => setFocusedField(`aksesExisting-${index}`)}
                                      onBlur={() => setFocusedField('')}
                                      style={{
                                        ...selectStyle(`aksesExisting-${index}`),
                                        padding: '14px 16px 14px 48px',
                                        fontSize: '14px'
                                      }}
                                    >
                                      <option value="">Pilih akses existing</option>
                                      <option value="ya">Ya</option>
                                      <option value="tidak">Tidak</option>
                                    </select>
                                  </div>
                                </motion.div>

                                {/* Margin % */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    💰 Margin % *
                                  </label>
                                  <div style={{ position: 'relative' }}>
                                    <div style={iconContainerStyle(`marginPercent-${index}`)}>
                                      <DollarSign size={18} />
                                    </div>
                                    <input
                                      type="number"
                                      value={item.marginPercent}
                                      onChange={(e) => handleLayananItemChange(index, 'marginPercent', e.target.value)}
                                      placeholder="Masukkan margin dalam persen"
                                      min="0"
                                      max="100"
                                      step="0.01"
                                      required
                                      onFocus={() => setFocusedField(`marginPercent-${index}`)}
                                      onBlur={() => setFocusedField('')}
                                      style={{
                                        ...inputStyle(`marginPercent-${index}`),
                                        padding: '14px 48px 14px 48px',
                                        fontSize: '14px'
                                      }}
                                    />
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        pointerEvents: "none",
                                        fontSize: "14px",
                                        color: focusedField === `marginPercent-${index}` ? colors.secondary : colors.primary,
                                        fontWeight: "600",
                                      }}
                                    >
                                      %
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Tombol Tambah Layanan dengan desain yang lebih menarik */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{
                          textAlign: 'center',
                          padding: '20px',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(189, 210, 231, 0.6) 100%)',
                          borderRadius: '16px',
                          border: `2px dashed ${colors.secondary}40`,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Background effect */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${colors.secondary}05 0%, ${colors.tertiary}05 100%)`,
                          zIndex: 0
                        }} />
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <motion.button
                            whileHover={{ 
                              scale: 1.05, 
                              y: -2,
                              boxShadow: `0 8px 25px rgba(63, 186, 140, 0.4)`
                            }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={addLayananItem}
                            disabled={isSaving}
                            style={{
                              background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.secondary} 100%)`,
                              color: 'white',
                              border: 'none',
                              borderRadius: '14px',
                              padding: '16px 32px',
                              fontSize: '15px',
                              fontWeight: '700',
                              cursor: isSaving ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              margin: '0 auto',
                              boxShadow: `0 6px 20px rgba(63, 186, 140, 0.3)`,
                              position: 'relative',
                              overflow: 'hidden',
                              opacity: isSaving ? 0.7 : 1
                            }}
                          >
                            {/* Animated background effect */}
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                              transition: 'left 0.5s ease'
                            }} />
                            
                            <motion.div
                              animate={{ rotate: [0, 180] }}
                              transition={{ duration: 0.5 }}
                            >
                              <Plus style={{ width: '20px', height: '20px' }} />
                            </motion.div>
                            <span>Tambah Layanan</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Add Pengeluaran Button */}
                {showPengeluaranButton && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "24px",
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={handleShowConfirmModal}
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: colors.secondary,
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        boxShadow: `0 6px 20px rgba(0, 191, 202, 0.4)`,
                      }}
                    >
                      <Plus style={{ width: "24px", height: "24px" }} />
                    </motion.button>
                  </motion.div>
                )}

                {/* Section dengan background biru muda untuk informasi tambahan */}
                {showAdditionalSection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      backgroundColor: "rgba(0, 191, 202, 0.08)",
                      borderRadius: "20px",
                      padding: "28px",
                      marginBottom: "28px",
                      border: `2px solid rgba(0, 192, 202, 0.25)`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Decorative corner accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '120px',
                      height: '120px',
                      background: `linear-gradient(135deg, ${colors.secondary}20 0%, ${colors.tertiary}20 100%)`,
                      borderBottomLeftRadius: '100%',
                      zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Header Section dengan icon */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '28px',
                        paddingBottom: '16px',
                        borderBottom: `3px solid ${colors.secondary}30`,
                        textAlign: 'center'
                      }}>
                        {/* Icon Container */}
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 6px 20px rgba(0, 191, 202, 0.4)`,
                          marginBottom: '16px'
                        }}>
                          <DollarSign size={28} color="white" />
                        </div>
                        
                        {/* Text Content */}
                        <div>
                          <h4 style={{
                            margin: 0,
                            fontSize: '22px',
                            fontWeight: '700',
                            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '8px'
                          }}>
                            Pengeluaran Lain-lain
                          </h4>
                          <p style={{
                            margin: 0,
                            fontSize: '15px',
                            color: colors.accent1,
                            opacity: 0.8,
                            lineHeight: '1.4'
                          }}>
                            Kelola biaya tambahan untuk penawaran ini
                          </p>
                        </div>

                        {/* Total Display - MODIFIED POSITION */}
                        {pengeluaranItems.some(item => item.hasrat && item.jumlah) && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                              background: `linear-gradient(135deg, ${colors.success}15 0%, ${colors.secondary}15 100%)`,
                              border: `2px solid ${colors.success}30`,
                              borderRadius: '16px',
                              padding: '16px 24px',
                              textAlign: 'center',
                              minWidth: '200px',
                              marginTop: '16px'
                            }}
                          >
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: colors.success,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '6px'
                            }}>
                              Total Pengeluaran
                            </div>
                            <div style={{
                              fontSize: '22px',
                              fontWeight: '700',
                              color: colors.success,
                              background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>
                              Rp {getTotalPengeluaran().toLocaleString('id-ID')}
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Multiple Pengeluaran Items */}
                      <div style={{
                        display: 'grid',
                        gap: '20px',
                        marginBottom: '28px'
                      }}>
                        {pengeluaranItems.map((item, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ 
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 300,
                              damping: 20
                            }}
                            style={{
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(189, 231, 225, 0.6) 100%)',
                              border: `2px solid ${colors.secondary}20`,
                              borderRadius: '18px',
                              padding: '24px',
                              position: 'relative',
                              backdropFilter: 'blur(10px)',
                              boxShadow: `
                                0 4px 20px rgba(0, 0, 0, 0.08),
                                0 2px 8px rgba(0, 0, 0, 0.04)
                              `,
                              overflow: 'hidden'
                            }}
                          >
                            {/* Background Pattern */}
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              width: '80px',
                              height: '80px',
                              background: `radial-gradient(circle, ${colors.secondary}08 0%, transparent 70%)`,
                              zIndex: 0
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                              {/* Header dengan nomor item dan tombol hapus */}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                paddingBottom: '16px',
                                borderBottom: `2px solid ${colors.secondary}15`
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '700'
                                  }}>
                                    {index + 1}
                                  </div>
                                  <span style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: colors.primary
                                  }}>
                                    Item Pengeluaran
                                  </span>
                                </div>
                                
                                {pengeluaranItems.length > 1 && (
                                  <motion.button
                                    whileHover={{ scale: 1.05, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => removePengeluaranItem(index)}
                                    style={{
                                      background: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`,
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '10px',
                                      padding: '8px 16px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                                    }}
                                  >
                                    <X size={14} />
                                    Hapus
                                  </motion.button>
                                )}
                              </div>

                              {/* Grid Layout untuk Input Fields */}
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px',
                                marginBottom: '20px'
                              }}>
                                {/* Item */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    📦 Item *
                                  </label>
                                  <input
                                    type="text"
                                    value={item.item}
                                    onChange={(e) => handlePengeluaranItemChange(index, 'item', e.target.value)}
                                    disabled={isSaving}
                                    placeholder="Nama item pengeluaran"
                                    onFocus={() => setFocusedField(`pengeluaran-item-${index}`)}
                                    onBlur={() => setFocusedField('')}
                                    style={{
                                      ...inputStyle(`pengeluaran-item-${index}`),
                                      padding: '14px 16px',
                                      paddingLeft: '16px',
                                      fontSize: '14px'
                                    }}
                                  />
                                </motion.div>

                                {/* Keterangan */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    📝 Keterangan *
                                  </label>
                                  <input
                                    type="text"
                                    value={item.keterangan}
                                    onChange={(e) => handlePengeluaranItemChange(index, 'keterangan', e.target.value)}
                                    disabled={isSaving}
                                    placeholder="Deskripsi pengeluaran"
                                    onFocus={() => setFocusedField(`pengeluaran-keterangan-${index}`)}
                                    onBlur={() => setFocusedField('')}
                                    style={{
                                      ...inputStyle(`pengeluaran-keterangan-${index}`),
                                      padding: '14px 16px',
                                      paddingLeft: '16px',
                                      fontSize: '14px'
                                    }}
                                  />
                                </motion.div>

                                {/* Harga Satuan */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    💰 Harga Satuan *
                                  </label>
                                  <div style={{ position: 'relative' }}>
                                    <div style={{
                                      position: 'absolute',
                                      left: '14px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      color: focusedField === `pengeluaran-hasrat-${index}` ? colors.secondary : colors.primary,
                                      fontWeight: '600',
                                      fontSize: '14px'
                                    }}>
                                      Rp
                                    </div>
                                    <input
                                      type="number"
                                      value={item.hasrat}
                                      onChange={(e) => handlePengeluaranItemChange(index, 'hasrat', e.target.value)}
                                      disabled={isSaving}
                                      placeholder="0"
                                      onFocus={() => setFocusedField(`pengeluaran-hasrat-${index}`)}
                                      onBlur={() => setFocusedField('')}
                                      style={{
                                        ...inputStyle(`pengeluaran-hasrat-${index}`),
                                        padding: '14px 16px',
                                        paddingLeft: '50px',
                                        fontSize: '14px'
                                      }}
                                    />
                                  </div>
                                </motion.div>

                                {/* Jumlah */}
                                <motion.div 
                                  whileHover={{ y: -2 }}
                                  style={{ position: 'relative' }}
                                >
                                  <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: '8px',
                                    letterSpacing: '0.02em'
                                  }}>
                                    🔢 Jumlah *
                                  </label>
                                  <input
                                    type="number"
                                    value={item.jumlah}
                                    onChange={(e) => handlePengeluaranItemChange(index, 'jumlah', e.target.value)}
                                    disabled={isSaving}
                                    placeholder="0"
                                    onFocus={() => setFocusedField(`pengeluaran-jumlah-${index}`)}
                                    onBlur={() => setFocusedField('')}
                                    style={{
                                      ...inputStyle(`pengeluaran-jumlah-${index}`),
                                      padding: '14px 16px',
                                      paddingLeft: '16px',
                                      fontSize: '14px'
                                    }}
                                  />
                                </motion.div>
                              </div>
                              
                              {/* Display calculated total untuk item ini */}
                              {item.hasrat && item.jumlah && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  style={{
                                    padding: '16px 20px',
                                    background: `linear-gradient(135deg, ${colors.success}08 0%, ${colors.secondary}08 100%)`,
                                    border: `2px solid ${colors.success}20`,
                                    borderRadius: '14px',
                                    fontSize: '15px',
                                    color: colors.success,
                                    textAlign: 'center',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                  }}
                                >
                                  <Calculator size={16} />
                                  <span>Subtotal Item #{index + 1}:</span>
                                  <span style={{ 
                                    fontSize: '16px',
                                    background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                  }}>
                                    Rp {(parseFloat(item.hasrat || 0) * parseInt(item.jumlah || 0)).toLocaleString('id-ID')}
                                  </span>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Tombol Tambah Item dengan desain yang lebih menarik */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{
                          textAlign: 'center',
                          padding: '20px',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(189, 210, 231, 0.6) 100%)',
                          borderRadius: '16px',
                          border: `2px dashed ${colors.secondary}40`,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Background effect */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${colors.secondary}05 0%, ${colors.tertiary}05 100%)`,
                          zIndex: 0
                        }} />
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <motion.button
                            whileHover={{ 
                              scale: 1.05, 
                              y: -2,
                              boxShadow: `0 8px 25px rgba(63, 186, 140, 0.4)`
                            }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={addPengeluaranItem}
                            disabled={isSaving}
                            style={{
                              background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.secondary} 100%)`,
                              color: 'white',
                              border: 'none',
                              borderRadius: '14px',
                              padding: '16px 32px',
                              fontSize: '15px',
                              fontWeight: '700',
                              cursor: isSaving ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              margin: '0 auto',
                              boxShadow: `0 6px 20px rgba(63, 186, 140, 0.3)`,
                              position: 'relative',
                              overflow: 'hidden',
                              opacity: isSaving ? 0.7 : 1
                            }}
                          >
                            {/* Animated background effect */}
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                              transition: 'left 0.5s ease'
                            }} />
                            
                            <motion.div
                              animate={{ rotate: [0, 180] }}
                              transition={{ duration: 0.5 }}
                            >
                              <Plus style={{ width: '20px', height: '20px' }} />
                            </motion.div>
                            <span>Tambah Item Pengeluaran</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
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
                      onClick={handleCancel}
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
                      type="submit"
                      form="form-tambah-penawaran"
                      disabled={isSaving}
                      style={{
                        background: isSaving 
                          ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                          : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                        color: '#ffffff',
                        border: 'none',
                        padding: '16px 40px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        boxShadow: `0 4px 20px rgba(0, 191, 202, 0.4)`,
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.02em',
                        opacity: isSaving ? 0.8 : 1
                      }}
                    >
                      {isSaving ? 'Menyimpan...' : 'Simpan Data'}
                    </motion.button>
                  </div>
                </motion.form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Modal untuk Pengeluaran */}
        <AnimatePresence>
          {showConfirmModal && (
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
                padding: '20px'
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
                  padding: '32px',
                  textAlign: 'center',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '400px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: colors.primary
                  }}
                >
                  Konfirmasi
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    margin: '0 0 28px 0',
                    fontSize: '15px',
                    color: colors.accent1,
                    lineHeight: '1.5',
                    opacity: 0.9
                  }}
                >
                  Apakah anda ingin menambahkan pengeluaran lain-lain?
                </motion.p>
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmNo}
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 28px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: `0 4px 15px rgba(3, 91, 113, 0.3)`,
                    }}
                  >
                    Tidak
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmYes}
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 28px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: `0 4px 15px rgba(0, 191, 202, 0.3)`,
                    }}
                  >
                    Iya
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                padding: '20px'
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
                  Data penawaran telah berhasil disimpan ke sistem
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
    );
};

export default Tambah;

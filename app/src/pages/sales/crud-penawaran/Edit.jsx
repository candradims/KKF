import React, { useState, useEffect } from "react";
import { X, Plus, Calculator, Check } from "lucide-react";
import { getUserData, getAuthHeaders } from '../../../utils/api';

const layananOptions = [
  "IP VPN (1 sd 10 Mbps)",
  "IP VPN (11 sd 50 Mbps)",
  "IP VPN (51 sd 100 Mbps)",
  "IP VPN (101 sd 500 Mbps)",
  "IP VPN (501 sd 1000 Mbps)",
  "IP VPN Premium (2 Mbps)",
  "IP VPN Premium (3 Mbps)",
  "IP VPN Premium (4 Mbps)",
  "IP VPN Premium (5 Mbps)",
  "IP VPN Premium (6 Mbps)",
  "IP VPN Premium (7 Mbps)",
  "IP VPN Premium (8 Mbps)",
  "IP VPN Premium (9 Mbps)",
  "IP VPN Premium (10 Mbps)",
  "IP VPN Premium (15 Mbps)",
  "IP VPN Premium (20 Mbps)",
  "IP VPN Premium (40 Mbps)",
  "Metronet (1 sd 10 Mbps)",
  "Metronet (11 sd 50 Mbps)",
  "Metronet (51 sd 100 Mbps)",
  "Metronet (101 sd 500 Mbps)",
  "Metronet (501 sd 1000 Mbps)",
  "Inet Corp IX&IIX (1 sd 10 Mbps)",
  "Inet Corp IX&IIX (11 sd 50 Mbps)",
  "Inet Corp IX&IIX (51 sd 100 Mbps)",
  "Inet Corp IX&IIX (101 sd 500 Mbps)",
  "Inet Corp IX&IIX (501 sd 1 Gbps)",
  "Inet Corp IX&IIX (1.01 sd 5 Gbps)",
  "Inet Corp IX&IIX (5.01 sd 10 Gbps)",
  "Inet Corp IIX (1 sd 10 Mbps)",
  "Inet Corp IIX (11 sd 50 Mbps)",
  "Inet Corp IIX (51 sd 100 Mbps)",
  "Inet Corp IIX (101 sd 500 Mbps)",
  "Inet Corp IIX (501 sd 1 Gbps)",
  "Inet Corp IIX (1.01 sd 5 Gbps)",
  "Inet Corp IIX (5.01 sd 10 Gbps)",
  "Inet Corp IX (1 sd 10 Mbps)",
  "Inet Corp IX (11 sd 50 Mbps)",
  "Inet Corp IX (51 sd 100 Mbps)",
  "Inet Corp IX (101 sd 500 Mbps)",
  "Inet Corp IX (501 sd 1.000 Mbps)",
  "Inet Corp IX (1.01 sd 5 Gbps)",
  "Inet Corp IX (5.01 sd 10 Gbps)",
  "IP Transit (1 sd 10 Mbps)",
  "IP Transit (11 sd 50 Mbps)",
  "IP Transit (51 sd 100 Mbps)",
  "IP Transit (101 sd 500 Mbps)",
  "IP Transit (501 sd 1 Gbps)",
  "IP Transit (1.01 sd 5 Gbps)",
  "IP Transit (5.01 sd 10 Gbps)",
  "IP Transit IIX (1 sd 10 Mbps)",
  "IP Transit IIX (11 sd 50 Mbps)",
  "IP Transit IIX (51 sd 100 Mbps)",
  "IP Transit IIX (101 sd 500 Mbps)",
  "IP Transit IIX (501 sd 1Gbps)",
  "IP Transit IIX (1.01 sd 5 Gbps)",
  "IP Transit IIX (5.01 sd 10 Gbps)",
  "IP Transit IX (1 sd 10 Mbps)",
  "IP Transit IX Only (11 sd 50 Mbps)",
  "IP Transit IX (51 sd 100 Mbps)",
  "IP Transit IX (101 sd 500 Mbps)",
  "IP Transit IX (501 sd 1 Gbps)",
  "IP Transit IX (1.01 sd 5 Gbps)",
  "IP Transit IX (5.01 sd 10 Gbps)",
  "i-WIN Indoor",
  "i-WIN Outdoor",
  "MSR Bronze",
  "MSR Silver (12 Bulan)",
  "MSR Gold (12 Bulan)",
  "MSR Platinum (12 Bulan)",
  "APK I-See (Basic)",
  "APK I-See (Flex)",
  "APK I-See (Ultimate)",
  "Non Analytic CCTV (Basic)",
  "Analytic CCTV (Basic)",
  "Outdoor PTZ (Basic)",
  "Thermal Outdoor (Basic)",
  "Non Analytic CCTV (Flex)",
  "Analytic CCTV (Flex)",
  "Outdoor PTZ (Flex)",
  "Thermal Outdoor (Flex)",
  "Non Analytic CCTV (Ultimate)",
  "Analytic CCTV (Ultimate)",
  "Outdoor PTZ (Ultimate)",
  "Thermal Outdoor (Ultimate)",
  "Biaya Installasi CCTV",
  "Penambahan IPv4 Publik",
  "Lain-lain",
  "IBBC CIR4-BW10 On-Net FTTH",
  "IBBC CIR4-BW15 On-Net FTTH",
  "IBBC CIR4-BW20 On-Net FTTH",
  "IBBC CIR4-BW25 On-Net FTTH",
  "IBBC CIR4-BW30 On-Net FTTH",
  "IBBC CIR4-BW35 On-Net FTTH",
  "IBBC CIR4-BW50 On-Net FTTH",
  "IBBC CIR4-BW75 On-Net FTTH",
  "IBBC CIR4-BW100 On-Net FTTH",
  "IBBC CIR4-BW150 On-Net FTTH",
  "IBBC CIR4-BW200 On-Net FTTH",
  "IBBC CIR4-BW500 On-Net FTTH",
  "IBBC CIR4-BW1000 On-Net FTTH",
  "IBBC CIR8-BW10 On-Net FTTH",
  "IBBC CIR8-BW15 On-Net FTTH",
  "IBBC CIR8-BW20 On-Net FTTH",
  "IBBC CIR8-BW25 On-Net FTTH",
  "IBBC CIR8-BW30 On-Net FTTH",
  "IBBC CIR8-BW35 On-Net FTTH",
  "IBBC CIR10-BW50 On-Net FTTH",
  "IBBC CIR10-BW75 On-Net FTTH",
  "IBBC CIR16-BW100 On-Net FTTH",
  "IBBC CIR16-BW150 On-Net FTTH",
  "IBBC CIR16-BW200 On-Net FTTH",
  "IBBC CIR20-BW500 On-Net FTTH",
  "IBBC CIR20-BW1000 On-Net FTTH",
  "IBBC CIR4-BW10 Off-Net non-FTTH",
  "IBBC CIR4-BW15 Off-Net non-FTTH",
  "IBBC CIR4-BW20 Off-Net non-FTTH",
  "IBBC CIR4-BW25 Off-Net non-FTTH",
  "IBBC CIR4-BW30 Off-Net non-FTTH",
  "IBBC CIR4-BW35 Off-Net non-FTTH",
  "IBBC CIR4-BW50 Off-Net non-FTTH",
  "IBBC CIR4-BW75 Off-Net non-FTTH",
  "IBBC CIR4-BW100 Off-Net non-FTTH",
  "IBBC CIR4-BW150 Off-Net non-FTTH",
  "IBBC CIR4-BW200 Off-Net non-FTTH",
  "IBBC CIR4-BW500 Off-Net non-FTTH",
  "IBBC CIR4-BW1000 Off-Net non-FTTH",
  "IBBC CIR8-BW10 Off-Net non-FTTH",
  "IBBC CIR8-BW15 Off-Net non-FTTH",
  "IBBC CIR8-BW20 Off-Net non-FTTH",
  "IBBC CIR8-BW25 Off-Net non-FTTH",
  "IBBC CIR8-BW30 Off-Net non-FTTH",
  "IBBC CIR8-BW35 Off-Net non-FTTH",
  "IBBC CIR10-BW50 Off-Net non-FTTH",
  "IBBC CIR10-BW75 Off-Net non-FTTH",
  "IBBC CIR16-BW100 Off-Net non-FTTH",
  "IBBC CIR16-BW150 Off-Net non-FTTH",
  "IBBC CIR16-BW200 Off-Net non-FTTH",
  "IBBC CIR20-BW500 Off-Net non-FTTH",
  "IBBC CIR20-BW1000 Off-Net non-FTTH",
  "IBBC CIR4-BW10 On-Net FTTH IP Publik",
  "IBBC CIR4-BW15 On-Net FTTH IP Publik",
  "IBBC CIR4-BW20 On-Net FTTH IP Publik",
  "IBBC CIR4-BW25 On-Net FTTH IP Publik",
  "IBBC CIR4-BW30 On-Net FTTH IP Publik",
  "IBBC CIR4-BW35 On-Net FTTH IP Publik",
  "IBBC CIR4-BW50 On-Net FTTH IP Publik",
  "IBBC CIR4-BW75 On-Net FTTH IP Publik",
  "IBBC CIR4-BW100 On-Net FTTH IP Publik",
  "IBBC CIR4-BW150 On-Net FTTH IP Publik",
  "IBBC CIR4-BW200 On-Net FTTH IP Publik",
  "IBBC CIR4-BW500 On-Net FTTH IP Publik",
  "IBBC CIR4-BW1000 On-Net FTTH IP Publik",
  "IBBC CIR8-BW10 On-Net FTTH IP Publik",
  "IBBC CIR8-BW15 On-Net FTTH IP Publik",
  "IBBC CIR8-BW20 On-Net FTTH IP Publik",
  "IBBC CIR8-BW25 On-Net FTTH IP Publik",
  "IBBC CIR8-BW30 On-Net FTTH IP Publik",
  "IBBC CIR8-BW35 On-Net FTTH IP Publik",
  "IBBC CIR10-BW50 On-Net FTTH IP Publik",
  "IBBC CIR10-BW75 On-Net FTTH IP Publik",
  "IBBC CIR16-BW100 On-Net FTTH IP Publik",
  "IBBC CIR16-BW150 On-Net FTTH IP Publik",
  "IBBC CIR16-BW200 On-Net FTTH IP Publik",
  "IBBC CIR20-BW500 On-Net FTTH IP Publik",
  "IBBC CIR20-BW1000 On-Net FTTH IP Publik",
  "Cloud 1corevCPU 2GB Mem Cap 50GB",
  "Cloud 4corevCPU 16GB Mem Cap 200GB",
  "Cloud 12corevCPU 96Gb Mem Cap 1TB",
];

const Edit = ({ isOpen, onClose, onSave, editData }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAdditionalSection, setShowAdditionalSection] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [loadingPengeluaran, setLoadingPengeluaran] = useState(false);
  const [existingPengeluaran, setExistingPengeluaran] = useState([]);
  
  // Multiple pengeluaran data
  const [pengeluaranItems, setPengeluaranItems] = useState([{
    id: null, // null for new items, will have id for existing items
    item: "",
    keterangan: "",
    hasrat: "",
    jumlah: "",
    isExisting: false
  }]);
  
  const [formData, setFormData] = useState({
    sales: "",
    tanggal: "",
    pelanggan: "",
    nomorKontrak: "",
    kontrakTahunKe: "",
    referensiHJT: "",
    durasiKontrak: "",
    // Remove single pengeluaran fields as we now use pengeluaranItems array
    // item: "",
    // keterangan: "",
    // hasrat: "",
    // jumlah: "",
  });

  // Pre-fill form with existing data when editing and load pengeluaran data
  useEffect(() => {
    if (editData) {
      const initialData = {
        sales: editData.rawData?.sales || editData.sales || editData.namaSales || "",
        tanggal: editData.tanggal || "",
        pelanggan: editData.namaPelanggan || editData.pelanggan || "",
        nomorKontrak: editData.nomorKontrak || "",
        kontrakTahunKe: editData.kontrakKe || editData.kontrakTahunKe || "",
        referensiHJT: editData.referensi || editData.referensiHJT || "",
        durasiKontrak: editData.durasi || editData.durasiKontrak || "",
        item: "",
        keterangan: "",
        hasrat: "",
        jumlah: "",
      };

      setFormData(initialData);
      setOriginalData(initialData);

      // Load pengeluaran data from API
      loadPengeluaranData();
    }
  }, [editData]);

  // Load pengeluaran data for this penawaran
  const loadPengeluaranData = async () => {
    if (!editData?.id_penawaran && !editData?.id) return;

    const penawaranId = editData.id_penawaran || editData.id;
    
    try {
      setLoadingPengeluaran(true);
      console.log('Loading pengeluaran for penawaran ID:', penawaranId);

      // Get auth data using utility function
      const userData = getUserData();
      if (!userData) {
        console.error('No user data found');
        return;
      }

      // Get auth headers using utility function
      const headers = getAuthHeaders();

      const response = await fetch(`http://localhost:3000/api/pengeluaran/penawaran/${penawaranId}`, {
        headers: headers
      });

      if (response.ok) {
        const result = await response.json();
        console.log('API Response result:', result);
        if (result.success && result.data.length > 0) {
          // For Edit, handle multiple pengeluaran items
          const loadedPengeluaranItems = result.data.map(item => ({
            id: item.id_pengeluaran,
            item: item.item || "",
            keterangan: item.keterangan || "",
            hasrat: item.harga_satuan?.toString() || "",
            jumlah: item.jumlah?.toString() || "",
            total: item.total_harga || 0,
            isExisting: true
          }));
          
          setExistingPengeluaran(loadedPengeluaranItems);
          setPengeluaranItems(loadedPengeluaranItems);
          
          // Automatically show the edit section since we have data
          setShowAdditionalSection(true);

          console.log('Pengeluaran data loaded:', pengeluaranItems);
        } else {
          setExistingPengeluaran(null);
          console.log('No pengeluaran data found for this penawaran');
        }
      } else {
        console.error('Failed to load pengeluaran data. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setExistingPengeluaran(null);
      }
    } catch (error) {
      console.error('Error loading pengeluaran data:', error);
      setExistingPengeluaran(null);
    } finally {
      setLoadingPengeluaran(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper functions for multiple pengeluaran items
  const handlePengeluaranItemChange = (index, field, value) => {
    setPengeluaranItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // Calculate total for this item
      if (field === 'hasrat' || field === 'jumlah') {
        const hasrat = parseFloat(field === 'hasrat' ? value : updated[index].hasrat) || 0;
        const jumlah = parseFloat(field === 'jumlah' ? value : updated[index].jumlah) || 0;
        updated[index].total = hasrat * jumlah;
      }
      
      console.log('📝 Pengeluaran item changed:', { index, field, value });
      return updated;
    });
  };

  const addPengeluaranItem = () => {
    setPengeluaranItems(prev => [...prev, {
      id: null,
      item: "",
      keterangan: "",
      hasrat: "",
      jumlah: "",
      isExisting: false
    }]);
    console.log('➕ Added new pengeluaran item');
  };

  const removePengeluaranItem = (index) => {
    if (pengeluaranItems.length > 1) {
      setPengeluaranItems(prev => prev.filter((_, i) => i !== index));
      console.log('🗑️ Removed pengeluaran item at index:', index);
    }
  };

  const getTotalPengeluaran = () => {
    return pengeluaranItems.reduce((total, item) => {
      const hasrat = parseFloat(item.hasrat) || 0;
      const jumlah = parseFloat(item.jumlah) || 0;
      return total + (hasrat * jumlah);
    }, 0);
  };

  // Function to check if form data has changed
  const hasDataChanged = () => {
    // Check if main form data has changed
    const formChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
    
    // Check if pengeluaran items have changed
    const pengeluaranChanged = checkPengeluaranChanges();
    
    console.log('🔍 Change detection:', {
      formChanged,
      pengeluaranChanged,
      hasAnyChanges: formChanged || pengeluaranChanged
    });
    
    return formChanged || pengeluaranChanged;
  };

  // Function to check if pengeluaran items have changed
  const checkPengeluaranChanges = () => {
    // If additional section is shown but wasn't before, that's a change
    if (showAdditionalSection && existingPengeluaran.length === 0) {
      return pengeluaranItems.some(item => item.item || item.keterangan || item.hasrat || item.jumlah);
    }
    
    // If additional section is hidden but there was existing data, that's a change
    if (!showAdditionalSection && existingPengeluaran.length > 0) {
      return true;
    }
    
    // If no additional section shown and no existing data, no change
    if (!showAdditionalSection && existingPengeluaran.length === 0) {
      return false;
    }
    
    // Compare current items with existing data
    if (existingPengeluaran.length !== pengeluaranItems.length) {
      return true;
    }
    
    // Check each item for changes
    for (let i = 0; i < pengeluaranItems.length; i++) {
      const current = pengeluaranItems[i];
      const existing = existingPengeluaran[i];
      
      if (!existing) {
        // New item that has data
        if (current.item || current.keterangan || current.hasrat || current.jumlah) {
          return true;
        }
      } else {
        // Compare with existing item
        if (
          current.item !== (existing.item || '') ||
          current.keterangan !== (existing.keterangan || '') ||
          current.hasrat !== (existing.harga_satuan?.toString() || '') ||
          current.jumlah !== (existing.jumlah?.toString() || '')
        ) {
          return true;
        }
      }
    }
    
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if any data has changed
    if (!hasDataChanged()) {
      return; // Don't proceed if no changes
    }

    // Validasi form - hanya field penawaran yang wajib
    const requiredFields = ['pelanggan', 'nomorKontrak', 'durasiKontrak'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Harap isi field yang wajib: ${missingFields.join(', ')}`);
      return;
    }

    // Validasi pengeluaran items (optional but if filled, must be complete)
    const hasIncompletePengeluaran = pengeluaranItems.some(item => {
      const hasAnyField = item.item || item.keterangan || item.hasrat || item.jumlah;
      const hasAllFields = item.item && item.keterangan && item.hasrat && item.jumlah;
      return hasAnyField && !hasAllFields;
    });

    if (hasIncompletePengeluaran) {
      alert('Jika mengisi pengeluaran lain-lain, harap lengkapi semua field (Item, Keterangan, Harga Satuan, Jumlah) untuk setiap item.');
      return;
    }

    console.log('📝 Updating penawaran data:', formData);
    console.log('📝 Pengeluaran items:', pengeluaranItems);
    console.log('📝 Show additional section:', showAdditionalSection);

    setIsSaving(true);
    
    // Include pengeluaran info for the parent component
    // Do not include the full editData object to avoid carrying extra data
    const updateData = {
      id: editData.id,
      id_penawaran: editData.id_penawaran,
      ...formData,
      // Include pengeluaran items data
      pengeluaranItems: pengeluaranItems.filter(item => 
        item.item && item.keterangan && item.hasrat && item.jumlah
      ),
      // Include total pengeluaran lain-lain
      total_pengeluaran_lain_lain: getTotalPengeluaran(),
      _hasExistingPengeluaran: !!(existingPengeluaran && existingPengeluaran.length > 0),
    };
    
    console.log('📤 Sending update data:', updateData);
    
    onSave(updateData);

    // Immediately transition to success modal
    setShowSuccessModal(true);
    setIsSaving(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      sales: "",
      tanggal: "",
      pelanggan: "",
      nomorKontrak: "",
      kontrakTahunKe: "",
      referensiHJT: "",
      durasiKontrak: "",
      discount: "",
    });
    
    // Reset pengeluaran items
    setPengeluaranItems([{
      id: null,
      item: "",
      keterangan: "",
      hasrat: "",
      jumlah: "",
      isExisting: false
    }]);
    setExistingPengeluaran([]);
    setShowAdditionalSection(false);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      sales: "",
      tanggal: "",
      pelanggan: "",
      nomorKontrak: "",
      kontrakTahunKe: "",
      referensiHJT: "",
      durasiKontrak: "",
      discount: "",
      item: "",
      keterangan: "",
      hasrat: "",
      jumlah: "",
    });
    setShowAdditionalSection(false);
    onClose();
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowAdditionalSection(true);
    console.log('✅ Additional section enabled');
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setShowAdditionalSection(false);
    // Reset pengeluaran items when user chooses No
    setPengeluaranItems([{
      id: null,
      item: "",
      keterangan: "",
      hasrat: "",
      jumlah: "",
      isExisting: false
    }]);
    console.log('❌ Additional section disabled and pengeluaran reset');
  };

  if (!isOpen && !showSuccessModal) return null;

  return (
    <div>
      {/* Main Modal */}
      {isOpen && !showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              width: "600px",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              position: "relative",
              transform: isSaving ? "scale(0.95)" : "scale(1)",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isSaving}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                cursor: isSaving ? "not-allowed" : "pointer",
                padding: "4px",
                color: "#374151",
                zIndex: 10,
                opacity: isSaving ? 0.5 : 1,
              }}
            >
              <X style={{ width: "24px", height: "24px" }} />
            </button>

            {/* Header */}
            <div
              style={{
                padding: "30px 30px 20px 30px",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#2C5282",
                }}
              >
                Edit Data Penawaran
              </h2>
            </div>

            {/* Form */}
            <div style={{ padding: "0 30px 30px 30px" }}>
              {/* Sales Field (Top Right) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "20px",
                }}
              >
                <div style={{ width: "200px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Sales*
                  </label>
                  <input
                    type="text"
                    name="sales"
                    value={formData.sales}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="Masukkan Nama"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "2px solid #B0BEC5",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: isSaving ? "#f5f5f5" : "white",
                      boxSizing: "border-box",
                      cursor: isSaving ? "not-allowed" : "text",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </div>
              </div>

              {/* Main Form Fields */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Tanggal */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Tanggal*
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "2px solid #B0BEC5",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: isSaving ? "#f5f5f5" : "white",
                      boxSizing: "border-box",
                      cursor: isSaving ? "not-allowed" : "text",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </div>

                {/* Pelanggan */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Pelanggan*
                  </label>
                  <input
                    type="text"
                    name="pelanggan"
                    value={formData.pelanggan}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="Masukkan nama Pelanggan"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "2px solid #B0BEC5",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: isSaving ? "#f5f5f5" : "white",
                      boxSizing: "border-box",
                      cursor: isSaving ? "not-allowed" : "text",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </div>

                {/* Nomor Kontrak / BAKB */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Nomor Kontrak / BAKB*
                  </label>
                  <input
                    type="text"
                    name="nomorKontrak"
                    value={formData.nomorKontrak}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="Masukkan nomor kontrak"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "2px solid #B0BEC5",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: isSaving ? "#f5f5f5" : "white",
                      boxSizing: "border-box",
                      cursor: isSaving ? "not-allowed" : "text",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </div>

                {/* Kontrak Tahun Ke */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Kontrak Tahun ke-*
                  </label>
                  <input
                    type="text"
                    name="kontrakTahunKe"
                    value={formData.kontrakTahunKe}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="Masukkan kontrak tahun ke berapa"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "2px solid #B0BEC5",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: isSaving ? "#f5f5f5" : "white",
                      boxSizing: "border-box",
                      cursor: isSaving ? "not-allowed" : "text",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </div>

                {/* Referensi HJT */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Referensi HJT*
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      name="referensiHJT"
                      value={formData.referensiHJT}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "2px solid #B0BEC5",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: isSaving ? "#f5f5f5" : "white",
                        boxSizing: "border-box",
                        appearance: "none",
                        cursor: isSaving ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <option value="">Pilih HJT</option>
                      <option value="sumatera">Sumatera</option>
                      <option value="kalimantan">Kalimantan</option>
                      <option value="jawa-bali">Jawa-Bali</option>
                      <option value="intim">Intim</option>
                    </select>
                    <div
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      ▼
                    </div>
                  </div>
                </div>

                {/* Durasi Kontrak */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Durasi Kontrak (in thn)*
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      name="durasiKontrak"
                      value={formData.durasiKontrak}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "2px solid #B0BEC5",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "white",
                        boxSizing: "border-box",
                        appearance: "none",
                      }}
                    >
                      <option value="">Durasi Kontrak</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <div
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      ▼
                    </div>
                  </div>
                </div>

                {/* Second Section with Light Blue Background */}
                <div
                  style={{
                    backgroundColor: "#F0F9FF",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  {/* Pilih Layanan */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Pilih Layanan*
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        name="piliLayanan"
                        value={formData.piliLayanan}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "2px solid #B0BEC5",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: "white",
                          boxSizing: "border-box",
                          appearance: "none",
                        }}
                      >
                        <option value="">Pilih Layanan</option>
                        {layananOptions.map((layanan, index) => (
                          <option key={index} value={layanan}>
                            {layanan}
                          </option>
                        ))}
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Detail Layanan */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Detail Layanan*
                    </label>
                    <input
                      type="text"
                      name="keterangan"
                      value={formData.keterangan}
                      onChange={handleInputChange}
                      placeholder="Masukkan detail layanan"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "2px solid #B0BEC5",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "white",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Kapasitas */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Kapasitas*
                    </label>
                    <input
                      type="text"
                      name="kapasitas"
                      value={formData.kapasitas}
                      onChange={handleInputChange}
                      placeholder="Masukkan kapasitas"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "2px solid #B0BEC5",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "white",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Qty */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Qty*
                    </label>
                    <input
                      type="text"
                      name="qty"
                      value={formData.qty}
                      onChange={handleInputChange}
                      placeholder="Masukkan qty"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "2px solid #B0BEC5",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "white",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Akses Existing */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Akses Existing*
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        name="aksesExisting"
                        value={formData.aksesExisting}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "2px solid #B0BEC5",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: "white",
                          boxSizing: "border-box",
                          appearance: "none",
                        }}
                      >
                        <option value="">Pilih akses</option>
                        <option value="ya">Ya</option>
                        <option value="tidak">Tidak</option>
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Harga Final (Sebelum PPN) */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Harga Final (Sebelum PPN)*
                    </label>
                    <input
                      type="text"
                      name="hargaFinalSebelumPPN"
                      value={formData.hargaFinalSebelumPPN}
                      onChange={handleInputChange}
                      placeholder="Masukkan harga final sebelum ppn"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "2px solid #B0BEC5",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "white",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Add Button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleShowConfirmModal}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#00BFFF",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Plus style={{ width: "20px", height: "20px" }} />
                  </button>
                </div>

                {/* History/Edit Pengeluaran Lain-lain Section */}
                {(existingPengeluaran || showAdditionalSection) && (
                  <div style={{
                    backgroundColor: '#e3f2fd',
                    borderRadius: '6px',
                    padding: '16px',
                    marginBottom: '20px',
                    border: '1px solid #bbdefb'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                      <h4 style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1565C0'
                      }}>
                        {existingPengeluaran ? '📋 Edit Pengeluaran Lain-lain' : '➕ Tambah Pengeluaran Lain-lain'}
                      </h4>
                      {existingPengeluaran && (
                        <span style={{
                          fontSize: '11px',
                          color: '#666',
                          fontStyle: 'italic'
                        }}>
                          Data dari pengeluaran sebelumnya - Ubah sesuai kebutuhan
                        </span>
                      )}
                    </div>
                    
                    {loadingPengeluaran ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#1565C0',
                        fontSize: '14px'
                      }}>
                        Memuat data pengeluaran...
                      </div>
                    ) : (
                      <div>
                        {/* Multiple Pengeluaran Items */}
                        {pengeluaranItems.map((item, index) => (
                          <div key={index} style={{
                            backgroundColor: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '12px',
                            position: 'relative'
                          }}>
                            {/* Header dengan nomor item dan tombol hapus */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '12px',
                              borderBottom: '1px solid #f0f0f0',
                              paddingBottom: '8px'
                            }}>
                              <span style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#1565C0'
                              }}>
                                Item #{index + 1}
                              </span>
                              {pengeluaranItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePengeluaranItem(index)}
                                  style={{
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Hapus
                                </button>
                              )}
                            </div>

                            {/* Item */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '12px',
                              minHeight: '40px'
                            }}>
                              <label style={{
                                width: '120px',
                                fontSize: '12px',
                                color: '#333',
                                fontWeight: '500',
                                flexShrink: 0
                              }}>
                                Item*
                              </label>
                              <input
                                type="text"
                                value={item.item}
                                onChange={(e) => handlePengeluaranItemChange(index, 'item', e.target.value)}
                                disabled={isSaving}
                                placeholder="Masukkan Item"
                                style={{
                                  flex: 1,
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  outline: 'none',
                                  backgroundColor: isSaving ? '#f5f5f5' : 'white',
                                  cursor: isSaving ? 'not-allowed' : 'text'
                                }}
                              />
                            </div>

                            {/* Keterangan */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '12px',
                              minHeight: '40px'
                            }}>
                              <label style={{
                                width: '120px',
                                fontSize: '12px',
                                color: '#333',
                                fontWeight: '500',
                                flexShrink: 0
                              }}>
                                Keterangan*
                              </label>
                              <input
                                type="text"
                                value={item.keterangan}
                                onChange={(e) => handlePengeluaranItemChange(index, 'keterangan', e.target.value)}
                                disabled={isSaving}
                                placeholder="Masukkan keterangan"
                                style={{
                                  flex: 1,
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  outline: 'none',
                                  backgroundColor: isSaving ? '#f5f5f5' : 'white',
                                  cursor: isSaving ? 'not-allowed' : 'text'
                                }}
                              />
                            </div>

                            {/* Harga Satuan */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '12px',
                              minHeight: '40px'
                            }}>
                              <label style={{
                                width: '120px',
                                fontSize: '12px',
                                color: '#333',
                                fontWeight: '500',
                                flexShrink: 0
                              }}>
                                Harga Satuan*
                              </label>
                              <input
                                type="number"
                                value={item.hasrat}
                                onChange={(e) => handlePengeluaranItemChange(index, 'hasrat', e.target.value)}
                                disabled={isSaving}
                                placeholder="0"
                                style={{
                                  flex: 1,
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  outline: 'none',
                                  backgroundColor: isSaving ? '#f5f5f5' : 'white',
                                  cursor: isSaving ? 'not-allowed' : 'text'
                                }}
                              />
                            </div>

                            {/* Jumlah */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '12px',
                              minHeight: '40px'
                            }}>
                              <label style={{
                                width: '120px',
                                fontSize: '12px',
                                color: '#333',
                                fontWeight: '500',
                                flexShrink: 0
                              }}>
                                Jumlah*
                              </label>
                              <input
                                type="number"
                                value={item.jumlah}
                                onChange={(e) => handlePengeluaranItemChange(index, 'jumlah', e.target.value)}
                                disabled={isSaving}
                                placeholder="0"
                                style={{
                                  flex: 1,
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  outline: 'none',
                                  backgroundColor: isSaving ? '#f5f5f5' : 'white',
                                  cursor: isSaving ? 'not-allowed' : 'text'
                                }}
                              />
                            </div>
                            
                            {/* Display calculated total untuk item ini */}
                            {item.hasrat && item.jumlah && (
                              <div style={{
                                padding: '8px 12px',
                                backgroundColor: '#f0f8ff',
                                border: '1px solid #bbdefb',
                                borderRadius: '4px',
                                fontSize: '12px',
                                color: '#1565C0',
                                textAlign: 'right'
                              }}>
                                <strong>Subtotal: Rp {(parseFloat(item.hasrat || 0) * parseInt(item.jumlah || 0)).toLocaleString('id-ID')}</strong>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Total keseluruhan */}
                        {pengeluaranItems.some(item => item.hasrat && item.jumlah) && (
                          <div style={{
                            padding: '12px',
                            backgroundColor: '#e8f5e8',
                            border: '2px solid #4caf50',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#2e7d32',
                            textAlign: 'right',
                            fontWeight: 'bold',
                            marginBottom: '16px'
                          }}>
                            Total Semua Pengeluaran: Rp {getTotalPengeluaran().toLocaleString('id-ID')}
                          </div>
                        )}

                        {/* Tombol Tambah Item */}
                        <div style={{
                          textAlign: 'center',
                          marginTop: '16px'
                        }}>
                          <button
                            type="button"
                            onClick={addPengeluaranItem}
                            disabled={isSaving}
                            style={{
                              backgroundColor: '#22c55e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              fontSize: '12px',
                              cursor: isSaving ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              margin: '0 auto'
                            }}
                          >
                            <Plus style={{ width: '14px', height: '14px' }} />
                            Tambah Item Pengeluaran
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Add Pengeluaran Button - Show when no existing pengeluaran and section not shown */}
                {!existingPengeluaran && !showAdditionalSection && (
                  <div style={{
                    backgroundColor: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '12px',
                      color: '#0369A1',
                      fontStyle: 'italic'
                    }}>
                      Tidak ada pengeluaran lain-lain untuk penawaran ini
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAdditionalSection(true)}
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: '#0EA5E9',
                        padding: '6px 16px',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        margin: '0 auto'
                      }}
                    >
                      <Plus style={{ width: '14px', height: '14px' }} />
                      Tambah Pengeluaran Lain-lain
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: isSaving ? "#ccc" : "#6B9BD2",
                      color: "white",
                      border: "none",
                      borderRadius: "25px",
                      cursor: isSaving ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      minWidth: "100px",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseOver={(e) => {
                      if (!isSaving) e.target.style.backgroundColor = "#5A8BC2";
                    }}
                    onMouseOut={(e) => {
                      if (!isSaving) e.target.style.backgroundColor = "#6B9BD2";
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving || !hasDataChanged()}
                    style={{
                      padding: "12px 24px",
                      backgroundColor:
                        isSaving || !hasDataChanged() ? "#ccc" : "#00BFFF",
                      color: "white",
                      border: "none",
                      borderRadius: "25px",
                      cursor:
                        isSaving || !hasDataChanged()
                          ? "not-allowed"
                          : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      minWidth: "100px",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseOver={(e) => {
                      if (!isSaving && hasDataChanged())
                        e.target.style.backgroundColor = "#00AAEF";
                    }}
                    onMouseOut={(e) => {
                      if (!isSaving && hasDataChanged())
                        e.target.style.backgroundColor = "#00BFFF";
                    }}
                  >
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
            padding: "20px",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              maxWidth: "400px",
              width: "90%",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Konfirmasi
            </h3>
            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "14px",
                color: "#666",
                lineHeight: "1.4",
              }}
            >
              Apakah anda ingin mengubah pengeluaran lain-lain?
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleConfirmNo}
                style={{
                  backgroundColor: "#6B9BD2",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  minWidth: "80px",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#5A8BC2";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6B9BD2";
                }}
              >
                Tidak
              </button>
              <button
                onClick={handleConfirmYes}
                style={{
                  backgroundColor: "#00BFFF",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  minWidth: "80px",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#00AAEF";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#00BFFF";
                }}
              >
                Iya
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
            padding: "20px",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              maxWidth: "300px",
              width: "90%",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#00AEEF",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
              }}
            >
              <Check
                style={{
                  width: "30px",
                  height: "30px",
                  color: "white",
                }}
              />
            </div>

            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Selamat!
            </h3>

            <p
              style={{
                margin: "0 0 20px 0",
                fontSize: "14px",
                color: "#666",
                lineHeight: "1.4",
              }}
            >
              Data Penawaran Berhasil Diperbarui
            </p>

            <button
              onClick={handleCloseSuccessModal}
              style={{
                backgroundColor: "#00AEEF",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 24px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                minWidth: "80px",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#0088CC";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#00AEEF";
              }}
            >
              Oke
            </button>
          </div>
        </div>
      )}

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            transform: translateY(20px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
      `}
      </style>
    </div>
  );
};

export default Edit;

import React, { useState, useEffect } from "react";
import { X, Plus, Calculator, Check } from "lucide-react";
import { getUserData } from "../../../utils/api";

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
  
  const [formData, setFormData] = useState({
    sales: "",
    tanggal: "",
    pelanggan: "",
    nomorKontrak: "",
    kontrakTahunKe: "",
    referensiHJT: "",
    durasiKontrak: "",
    hjtWilayah: "",
    namaLayanan: "",
    detailLayanan: "",
    kapasitas: "",
    satuan: "",
    qty: "",
    aksesExisting: "",
    discount: "",
  });

  // Separate state for multiple pengeluaran items
  const [pengeluaranItems, setPengeluaranItems] = useState([
    { item: "", keterangan: "", hasrat: "", jumlah: "" }
  ]);

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

  // Load data layanan when modal opens
  useEffect(() => {
    console.log('🎭 useEffect triggered - isOpen:', isOpen);
    if (isOpen) {
      console.log('✅ isOpen is true, calling loadLayananData...');
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
        console.log('✅ Layanan API result:', result);
        if (result.success && result.data) {
          console.log('📋 Raw layanan data:', result.data);
          setLayananData(result.data);
          
          // Extract unique HJT wilayah
          const uniqueWilayah = [...new Set(result.data.map(item => item.wilayah_hjt))];
          const filteredWilayah = uniqueWilayah.filter(Boolean); // Remove null/undefined values
          setAvailableHjtWilayah(filteredWilayah);
          
          console.log('🗺️ Available HJT Wilayah:', filteredWilayah);
          console.log('📊 Total layanan items:', result.data.length);
        } else {
          console.error('❌ API returned error:', result.message);
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
    
    // Handle HJT Wilayah selection and filter nama layanan
    if (name === 'hjtWilayah') {
      // Filter layanan based on selected HJT wilayah
      const filtered = layananData.filter(layanan => layanan.wilayah_hjt === value);
      setFilteredLayananData(filtered);
      
      // Extract unique nama_layanan for the selected wilayah
      const uniqueNamaLayanan = [...new Set(filtered.map(item => item.nama_layanan))];
      const filteredNamaLayanan = uniqueNamaLayanan.filter(Boolean);
      setAvailableNamaLayanan(filteredNamaLayanan);
      
      // Reset dependent selections
      setFormData((prev) => ({
        ...prev,
        hjtWilayah: value,
        namaLayanan: '', // Reset nama layanan selection
        detailLayanan: '' // Reset detail layanan selection
      }));
      setAvailableDetailLayanan([]); // Clear detail layanan options
      setSelectedLayanan(null);
      
      console.log('🗺️ HJT Wilayah selected:', value);
      console.log('📋 Available nama layanan:', filteredNamaLayanan);
    }
    // Handle nama layanan selection and filter detail layanan
    else if (name === 'namaLayanan') {
      // Filter detail layanan (jenis_layanan) based on selected nama_layanan and wilayah
      const filtered = layananData.filter(layanan => 
        layanan.wilayah_hjt === formData.hjtWilayah && layanan.nama_layanan === value
      );
      
      // Extract unique jenis_layanan for the selected nama_layanan
      const uniqueDetailLayanan = [...new Set(filtered.map(item => item.jenis_layanan))];
      const filteredDetailLayanan = uniqueDetailLayanan.filter(Boolean);
      setAvailableDetailLayanan(filteredDetailLayanan);
      
      // Reset detail layanan selection
      setFormData((prev) => ({
        ...prev,
        namaLayanan: value,
        detailLayanan: '' // Reset detail layanan selection
      }));
      
      console.log('🎯 Nama Layanan selected:', value);
      console.log('📝 Available detail layanan:', filteredDetailLayanan);
    }
    // Handle detail layanan selection
    else if (name === 'detailLayanan') {
      // Find the selected layanan data
      const selectedLayananData = layananData.find(layanan => 
        layanan.wilayah_hjt === formData.hjtWilayah && 
        layanan.nama_layanan === formData.namaLayanan && 
        layanan.jenis_layanan === value
      );
      setSelectedLayanan(selectedLayananData);
      
      setFormData((prev) => ({
        ...prev,
        detailLayanan: value
      }));
      
      console.log('📊 Detail Layanan selected:', value);
      console.log('✅ Selected layanan data:', selectedLayananData);
    } 
    // Handle other form fields
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi form - hanya field penawaran yang wajib
    const requiredFields = ['pelanggan', 'nomorKontrak', 'durasiKontrak', 'hjtWilayah', 'namaLayanan', 'detailLayanan', 'kapasitas', 'satuan', 'qty', 'aksesExisting'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      const fieldNames = {
        'pelanggan': 'Pelanggan',
        'nomorKontrak': 'Nomor Kontrak',
        'durasiKontrak': 'Durasi Kontrak',
        'hjtWilayah': 'HJT Wilayah',
        'namaLayanan': 'Nama Layanan',
        'detailLayanan': 'Detail Layanan',
        'kapasitas': 'Kapasitas',
        'satuan': 'Satuan',
        'qty': 'QTY',
        'aksesExisting': 'Akses Existing'
      };
      const translatedFields = missingFields.map(field => fieldNames[field] || field);
      alert(`Harap isi field yang wajib: ${translatedFields.join(', ')}`);
      return;
    }

    // Validasi pengeluaran jika section tambahan ditampilkan
    if (showAdditionalSection) {
      // Validasi setiap item dalam pengeluaranItems
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
    console.log('📦 Pengeluaran items:', pengeluaranItems);
    console.log('📦 Show additional section:', showAdditionalSection);
    console.log('✅ Selected layanan data:', selectedLayanan);

    setIsSaving(true);
    
    // Prepare data to send to parent
    const dataToSend = {
      ...formData,
      // Add selected layanan data for backend reference
      selectedLayananId: selectedLayanan?.id_layanan,
      piliLayanan: `${formData.namaLayanan} - ${formData.detailLayanan}`, // For display/backward compatibility
      pengeluaranItems: showAdditionalSection ? pengeluaranItems : [],
      total_pengeluaran_lain_lain: showAdditionalSection ? getTotalPengeluaran() : 0
    };
    
    // Call parent save function
    onSave(dataToSend);
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
      hjtWilayah: "",
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      satuan: "",
      qty: "",
      aksesExisting: "",
      discount: "",
    });
    setPengeluaranItems([{ item: "", keterangan: "", hasrat: "", jumlah: "" }]);
    setSelectedLayanan(null);
    setAvailableNamaLayanan([]);
    setAvailableDetailLayanan([]);
    setFilteredLayananData([]);
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
      hjtWilayah: "",
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      satuan: "",
      qty: "",
      aksesExisting: "",
    });
    setPengeluaranItems([{ item: "", keterangan: "", hasrat: "", jumlah: "" }]);
    setSelectedLayanan(null);
    setAvailableNamaLayanan([]);
    setAvailableDetailLayanan([]);
    setFilteredLayananData([]);
    setShowAdditionalSection(false);
    onClose();
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowAdditionalSection(true);
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setShowAdditionalSection(false);
    // Reset pengeluaran items when user chooses No
    setPengeluaranItems([{ item: "", keterangan: "", hasrat: "", jumlah: "" }]);
  };

  if (!isOpen && !showSuccessModal && !showConfirmModal) return null;

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
                Tambah Data Penawaran
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
                    readOnly
                    placeholder="Auto-filled from login"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "2px solid #B0BEC5",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#f8f9fa",
                      boxSizing: "border-box",
                      cursor: "not-allowed",
                      transition: "all 0.2s ease-in-out",
                      color: "#6c757d"
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

                {/* Pelanggan sesuai dengan NPWP */}
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
                    Pelanggan sesuai dengan NPWP*
                  </label>
                  <input
                    type="text"
                    name="pelanggan"
                    value={formData.pelanggan}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    placeholder="Masukkan nama pelanggan sesuai NPWP"
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
                  {/* HJT Wilayah Selection */}
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
                      HJT Wilayah*
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        name="hjtWilayah"
                        value={formData.hjtWilayah}
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
                          cursor: "pointer",
                        }}
                      >
                        <option value="">Pilih HJT Wilayah</option>
                        {availableHjtWilayah.map((wilayah, index) => (
                          <option key={index} value={wilayah}>
                            {wilayah}
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

                  {/* Nama Layanan */}
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
                      Nama Layanan*
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        name="namaLayanan"
                        value={formData.namaLayanan}
                        onChange={handleInputChange}
                        required
                        disabled={loadingLayanan || !formData.hjtWilayah}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "2px solid #B0BEC5",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: (loadingLayanan || !formData.hjtWilayah) ? "#F9FAFB" : "white",
                          boxSizing: "border-box",
                          appearance: "none",
                          cursor: (loadingLayanan || !formData.hjtWilayah) ? "not-allowed" : "pointer",
                        }}
                      >
                        <option value="">
                          {loadingLayanan 
                            ? "Memuat layanan..." 
                            : !formData.hjtWilayah 
                              ? "Pilih HJT Wilayah terlebih dahulu" 
                              : "Pilih Nama Layanan"}
                        </option>
                        {availableNamaLayanan.map((namaLayanan, index) => (
                          <option key={index} value={namaLayanan}>
                            {namaLayanan}
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
                    <div style={{ position: "relative" }}>
                      <select
                        name="detailLayanan"
                        value={formData.detailLayanan}
                        onChange={handleInputChange}
                        required
                        disabled={loadingLayanan || !formData.namaLayanan}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "2px solid #B0BEC5",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: (loadingLayanan || !formData.namaLayanan) ? "#F9FAFB" : "white",
                          boxSizing: "border-box",
                          appearance: "none",
                          cursor: (loadingLayanan || !formData.namaLayanan) ? "not-allowed" : "pointer",
                        }}
                      >
                        <option value="">
                          {loadingLayanan 
                            ? "Memuat detail layanan..." 
                            : !formData.namaLayanan 
                              ? "Pilih Nama Layanan terlebih dahulu" 
                              : "Pilih Detail Layanan"}
                        </option>
                        {availableDetailLayanan.map((detailLayanan, index) => (
                          <option key={index} value={detailLayanan}>
                            {detailLayanan}
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

                  {/* Satuan */}
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
                      Satuan*
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        name="satuan"
                        value={formData.satuan}
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
                        <option value="">Pilih satuan</option>
                        <option value="Mbps">Mbps</option>
                        <option value="Units">Units</option>
                        <option value="Lot">Lot</option>
                        <option value="IP">IP</option>
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

                  {/* QTY */}
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
                      QTY*
                    </label>
                    <input
                      type="number"
                      name="qty"
                      value={formData.qty}
                      onChange={handleInputChange}
                      placeholder="Masukkan quantity"
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
                        <option value="">Pilih akses existing</option>
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

                {/* Section dengan background biru muda untuk informasi tambahan */}
                {showAdditionalSection && (
                  <div
                    style={{
                      backgroundColor: "#e3f2fd",
                      borderRadius: "6px",
                      padding: "16px",
                      marginBottom: "20px",
                      border: "1px solid #bbdefb",
                    }}
                  >
                    <h4 style={{
                      margin: "0 0 16px 0",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1565C0"
                    }}>
                      Pengeluaran Lain-lain
                    </h4>
                    
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
                    disabled={isSaving}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: isSaving ? "#ccc" : "#00BFFF",
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
                      if (!isSaving) e.target.style.backgroundColor = "#00AAEF";
                    }}
                    onMouseOut={(e) => {
                      if (!isSaving) e.target.style.backgroundColor = "#00BFFF";
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
              Apakah anda ingin menambahkan pengeluaran lain-lain?
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

      {/* Success Modal */}
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
                backgroundColor: "#00AEEF",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                margin: "0 auto 16px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
              Data Penawaran Berhasil Disimpan
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

export default Tambah;

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

  // Sync layananItems with formData for backward compatibility
  useEffect(() => {
    // Update first layanan item when formData changes
    if (layananItems.length > 0) {
      const updatedItems = [...layananItems];
      updatedItems[0] = {
        ...updatedItems[0],
        namaLayanan: formData.namaLayanan,
        detailLayanan: formData.detailLayanan,
        kapasitas: formData.kapasitas,
        qty: formData.qty,
        aksesExisting: formData.aksesExisting,
        marginPercent: formData.marginPercent
      };
      
      // Only update if there's actually a change to avoid infinite loop
      if (JSON.stringify(updatedItems[0]) !== JSON.stringify(layananItems[0])) {
        setLayananItems(updatedItems);
      }
    }
  }, [formData.namaLayanan, formData.detailLayanan, formData.kapasitas, formData.qty, formData.aksesExisting, formData.marginPercent]);

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
      // Reset form state when modal opens for new penawaran
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
        discount: "",
        backbone: "",
        port: "",
        tarifAkses: "",
        tarif: "",
      });
      
      // Reset layanan items to single empty item
      setLayananItems([{
        namaLayanan: "",
        detailLayanan: "",
        kapasitas: "",
        qty: "",
        aksesExisting: "",
        marginPercent: ""
      }]);
      
      // Reset pengeluaran items
      setPengeluaranItems([{ item: "", keterangan: "", hasrat: "", jumlah: "" }]);
      
      // Reset other states
      setSelectedLayanan(null);
      setAvailableNamaLayanan([]);
      setAvailableDetailLayanan([]);
      setShowAdditionalSection(false);
      setShowConfirmModal(false);
      setIsSaving(false);
      
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

    // Note: Individual layanan handling is now done via handleLayananItemChange
    // This handleInputChange is now only for non-layanan fields

    // Handle other form fields
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

    // Maintain existing logic - update formData untuk compatibility dengan existing logic
    if (index === 0) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Trigger existing logic untuk nama layanan dan detail layanan
      if (field === 'namaLayanan') {
        console.log(`📊 Tambah: Nama Layanan selected for layanan #${index + 1}:`, value);
        // Reset detail layanan when nama layanan changes
        updatedItems[index].detailLayanan = '';
        console.log(`📋 Tambah: Detail layanan will be filtered dynamically for layanan #${index + 1}`);
        
        setFormData(prev => ({
          ...prev,
          namaLayanan: value,
          detailLayanan: '' // Reset detail layanan in formData too
        }));
      }
      
      if (field === 'detailLayanan') {
        // Find the selected layanan untuk auto-populate data
        const selectedLayanan = layananData.find(layanan => 
          layanan.wilayah_hjt === formData.referensiHJT && 
          layanan.nama_layanan === updatedItems[index].namaLayanan && 
          layanan.jenis_layanan === value
        );

        if (selectedLayanan) {
          console.log('🎯 Tambah: Found selected layanan:', selectedLayanan);
          setSelectedLayanan(selectedLayanan);
          
          // Auto-populate kapasitas hanya jika kosong
          if (!updatedItems[index].kapasitas) {
            updatedItems[index].kapasitas = selectedLayanan.kapasitas || '';
            setFormData(prev => ({
              ...prev,
              kapasitas: selectedLayanan.kapasitas || ''
            }));
          }
        }
      }
    }
    
    setLayananItems(updatedItems);
  };

  const addLayananItem = () => {
    // Preserve first layanan item data before reset
    const firstLayanan = layananItems[0] || {};
    
    // Auto reset Referensi HJT dan Durasi Kontrak ketika tambah layanan
    // Tapi preserve nama layanan dan detail layanan di item pertama
    setFormData(prev => ({
      ...prev,
      referensiHJT: "",
      durasiKontrak: "",
      // Preserve layanan data dari item pertama
      namaLayanan: firstLayanan.namaLayanan || "",
      detailLayanan: firstLayanan.detailLayanan || "",
      kapasitas: firstLayanan.kapasitas || "",
      qty: firstLayanan.qty || "",
      aksesExisting: firstLayanan.aksesExisting || "",
      marginPercent: firstLayanan.marginPercent || ""
    }));

    setLayananItems([...layananItems, {
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      qty: "",
      aksesExisting: "",
      marginPercent: ""
    }]);
  };

  const removeLayananItem = (index) => {
    if (layananItems.length > 1) {
      const updatedItems = layananItems.filter((_, i) => i !== index);
      setLayananItems(updatedItems);
      
      // Update formData with first item after removal
      if (index === 0 && updatedItems.length > 0) {
        const newFirstItem = updatedItems[0];
        setFormData(prev => ({
          ...prev,
          namaLayanan: newFirstItem.namaLayanan,
          detailLayanan: newFirstItem.detailLayanan,
          kapasitas: newFirstItem.kapasitas,
          qty: newFirstItem.qty,
          aksesExisting: newFirstItem.aksesExisting,
          marginPercent: newFirstItem.marginPercent
        }));
      }
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
    
    // Validasi form - field penawaran utama yang wajib
    const requiredFields = [
      'pelanggan',
      'nomorKontrak',
      'durasiKontrak',
      'referensiHJT'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    // Validasi layanan items
    const invalidLayananItems = [];
    layananItems.forEach((item, index) => {
      const missingLayananFields = [];
      if (!item.namaLayanan) missingLayananFields.push('Nama Layanan');
      if (!item.detailLayanan) missingLayananFields.push('Detail Layanan');
      if (!item.kapasitas) missingLayananFields.push('Kapasitas');
      if (!item.qty) missingLayananFields.push('QTY');
      if (!item.aksesExisting) missingLayananFields.push('Akses Existing');
      if (!item.marginPercent) missingLayananFields.push('Margin %');
      // Note: durasiKontrak is a global field, not per-layanan-item field
      
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
      console.log('🔍 Tambah: formData.durasiKontrak value:', formData.durasiKontrak);
      alert(`Harap isi field yang wajib: ${translatedFields.join(', ')}`);
      return;
    }

    if (invalidLayananItems.length > 0) {
      console.log('❌ Tambah: Layanan validation failed. Invalid items:', invalidLayananItems);
      console.log('🔍 Tambah: LayananItems data check:', layananItems.map((item, index) => ({
        index: index + 1,
        namaLayanan: !!item.namaLayanan,
        detailLayanan: !!item.detailLayanan,
        kapasitas: !!item.kapasitas,
        qty: !!item.qty,
        aksesExisting: !!item.aksesExisting,
        hasDurasiKontrak: !!item.durasiKontrak // Should be false since it's global
      })));
      alert(`Harap isi field layanan yang wajib:\n${invalidLayananItems.join('\n')}`);
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
    console.log('📦 Layanan items:', layananItems);
    console.log('📦 Layanan items with margin check:', layananItems.map((item, index) => ({ 
      index, 
      namaLayanan: item.namaLayanan, 
      marginPercent: item.marginPercent,
      marginType: typeof item.marginPercent 
    })));
    console.log('📦 Pengeluaran items:', pengeluaranItems);
    console.log('📦 Show additional section:', showAdditionalSection);
    console.log('✅ Selected layanan data:', selectedLayanan);

    setIsSaving(true);
    
    // Prepare data to send to parent
    const dataToSend = {
      ...formData,
      // Add multiple layanan items for backend processing
      layananItems: layananItems,
      // Add selected layanan data for backend reference (from first item for backward compatibility)
      selectedLayananId: selectedLayanan?.id_layanan,
      // Send auto-populated data from formData (first layanan item for backward compatibility)
      satuan: formData.satuan,
      backbone: formData.backbone,
      port: formData.port,
      tarif_akses: formData.tarifAkses, // Note: frontend uses tarifAkses, backend expects tarif_akses
      tarif: formData.tarif,
      // Create piliLayanan from multiple items
      piliLayanan: layananItems.map(item => `${item.namaLayanan} - ${item.detailLayanan}`).join('; '),
      pengeluaranItems: showAdditionalSection ? pengeluaranItems : [],
      total_pengeluaran_lain_lain: showAdditionalSection ? getTotalPengeluaran() : 0
    };
    
    // Call parent save function
    onSave(dataToSend);
  };

  // Reset form state completely
  const resetFormState = () => {
    console.log('🔄 Resetting form state...');
    
    // Reset formData to initial state
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
    
    // Reset layanan items to single empty item
    setLayananItems([{
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      qty: "",
      aksesExisting: "",
      marginPercent: ""
    }]);
    
    // Reset pengeluaran items
    setPengeluaranItems([{ item: "", keterangan: "", hasrat: "", jumlah: "" }]);
    
    // Reset all other states
    setSelectedLayanan(null);
    setAvailableNamaLayanan([]);
    setAvailableDetailLayanan([]);
    setFilteredLayananData([]);
    setShowAdditionalSection(false);
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    setLoadingLayanan(false);
    setIsSaving(false);
    
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
                    readOnly
                    disabled
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
                      {availableReferensiHJT.map((wilayah, idx) => (
                        <option key={idx} value={wilayah}>{wilayah}</option>
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
                {/* Multiple Layanan Items */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Data Layanan
                    </h3>
                    <button
                      type="button"
                      onClick={addLayananItem}
                      style={{
                        backgroundColor: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus style={{ width: '14px', height: '14px' }} />
                      Tambah Layanan
                    </button>
                  </div>

                  {layananItems.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#F0F9FF",
                        padding: "20px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        border: '2px solid #E0F2FE',
                        position: 'relative'
                      }}
                    >
                      {/* Header dengan nomor layanan dan tombol hapus */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        borderBottom: '1px solid #BAE6FD',
                        paddingBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0F172A'
                        }}>
                          Layanan #{index + 1}
                        </span>
                        {layananItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLayananItem(index)}
                            style={{
                              backgroundColor: '#EF4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '11px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            Hapus
                          </button>
                        )}
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
                            value={item.namaLayanan}
                            onChange={(e) => handleLayananItemChange(index, 'namaLayanan', e.target.value)}
                            required
                            disabled={loadingLayanan || !formData.referensiHJT}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: "2px solid #B0BEC5",
                              borderRadius: "8px",
                              fontSize: "14px",
                              outline: "none",
                              backgroundColor: (loadingLayanan || !formData.referensiHJT) ? "#F9FAFB" : "white",
                              boxSizing: "border-box",
                              appearance: "none",
                              cursor: (loadingLayanan || !formData.referensiHJT) ? "not-allowed" : "pointer",
                            }}
                          >
                            <option value="">
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
                            value={item.detailLayanan}
                            onChange={(e) => handleLayananItemChange(index, 'detailLayanan', e.target.value)}
                            required
                            disabled={loadingLayanan || !item.namaLayanan}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: "2px solid #B0BEC5",
                              borderRadius: "8px",
                              fontSize: "14px",
                              outline: "none",
                              backgroundColor: (loadingLayanan || !item.namaLayanan) ? "#F9FAFB" : "white",
                              boxSizing: "border-box",
                              appearance: "none",
                              cursor: (loadingLayanan || !item.namaLayanan) ? "not-allowed" : "pointer",
                            }}
                          >
                            <option value="">
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
                          value={item.kapasitas}
                          onChange={(e) => handleLayananItemChange(index, 'kapasitas', e.target.value)}
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
                          value={item.qty}
                          onChange={(e) => handleLayananItemChange(index, 'qty', e.target.value)}
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
                            value={item.aksesExisting}
                            onChange={(e) => handleLayananItemChange(index, 'aksesExisting', e.target.value)}
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

                      {/* Margin % */}
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
                          Margin %*
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="number"
                            value={item.marginPercent}
                            onChange={(e) => handleLayananItemChange(index, 'marginPercent', e.target.value)}
                            placeholder="Masukkan margin dalam persen"
                            min="0"
                            max="100"
                            step="0.01"
                            required
                            style={{
                              width: "100%",
                              padding: "10px 35px 10px 12px",
                              border: "2px solid #B0BEC5",
                              borderRadius: "8px",
                              fontSize: "14px",
                              outline: "none",
                              backgroundColor: "white",
                              boxSizing: "border-box",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              right: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              pointerEvents: "none",
                              fontSize: "14px",
                              color: "#666",
                              fontWeight: "500",
                            }}
                          >
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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

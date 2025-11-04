import React, { useState, useEffect } from "react";
import { X, Plus, Calculator, Check, User, FileText, ClipboardList, BarChart3, DollarSign, Package, Settings } from "lucide-react";
import { getUserData, getAuthHeaders } from '../../../utils/api';
import { motion, AnimatePresence } from "framer-motion";

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
  console.log("🔧 Edit component mounted with:", { isOpen, editData });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAdditionalSection, setShowAdditionalSection] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [originalLayananItems, setOriginalLayananItems] = useState([]);
  const [loadingPengeluaran, setLoadingPengeluaran] = useState(false);
  const [existingPengeluaran, setExistingPengeluaran] = useState([]);
  const [componentError, setComponentError] = useState(null);
  const [focusedField, setFocusedField] = useState('');
  const [showPengeluaranButton, setShowPengeluaranButton] = useState(true);
  
  // Color palette
  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  // Layanan data states
  const [layananData, setLayananData] = useState([]);
  const [filteredLayananData, setFilteredLayananData] = useState([]);
  const [availableHjtWilayah, setAvailableHjtWilayah] = useState([]);
  const [availableNamaLayanan, setAvailableNamaLayanan] = useState([]);
  const [availableDetailLayanan, setAvailableDetailLayanan] = useState([]);
  const [loadingLayanan, setLoadingLayanan] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  
  // Multiple pengeluaran data - start with empty array
  const [pengeluaranItems, setPengeluaranItems] = useState([]);

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
      
      if (JSON.stringify(updatedItems[0]) !== JSON.stringify(layananItems[0])) {
        setLayananItems(updatedItems);
      }
    }
  }, [formData.namaLayanan, formData.detailLayanan, formData.kapasitas, formData.qty, formData.aksesExisting, formData.marginPercent]);

  // Helper functions to update dropdown filters
  const updateHjtWilayahFilter = () => {
    if (layananData && layananData.length > 0) {
      const uniqueWilayah = [...new Set(layananData.map(item => item.wilayah_hjt))];
      const filteredWilayah = uniqueWilayah.filter(Boolean);
      setAvailableHjtWilayah(filteredWilayah);
      console.log('🗺️ Edit: Updated HJT Wilayah filter:', filteredWilayah);
    }
  };

  const updateNamaLayananFilter = (selectedWilayah) => {
    if (layananData && layananData.length > 0 && selectedWilayah) {
      const filteredByWilayah = layananData.filter(layanan => layanan.wilayah_hjt === selectedWilayah);
      const uniqueNamaLayanan = [...new Set(filteredByWilayah.map(item => item.nama_layanan))];
      const filteredNama = uniqueNamaLayanan.filter(Boolean);
      setAvailableNamaLayanan(filteredNama);
      console.log('📋 Edit: Updated Nama Layanan filter for', selectedWilayah, ':', filteredNama);
    }
  };

  const updateDetailLayananFilter = (selectedWilayah, selectedNamaLayanan) => {
    if (layananData && layananData.length > 0 && selectedWilayah && selectedNamaLayanan) {
      const filteredData = layananData.filter(layanan => 
        layanan.wilayah_hjt === selectedWilayah && layanan.nama_layanan === selectedNamaLayanan
      );
      const uniqueDetailLayanan = [...new Set(filteredData.map(item => item.jenis_layanan))];
      const filteredDetail = uniqueDetailLayanan.filter(Boolean);
      setAvailableDetailLayanan(filteredDetail);
      console.log('📝 Edit: Updated Detail Layanan filter for', selectedWilayah, selectedNamaLayanan, ':', filteredDetail);
    }
  };

  // Pre-fill form with existing data when editing and load penawaran data
  useEffect(() => {
    try {
      console.log("🔧 Edit: Loading data for editData:", editData);
      
      if (editData) {
        // If we don't have complete data, load it from API first
        const needsFullData = !editData.rawData?.data_penawaran_layanan || 
                             editData.rawData.data_penawaran_layanan.length === 0;
        
        if (needsFullData && (editData.id || editData.id_penawaran)) {
          console.log("🔧 Edit: Loading full penawaran data from API...");
          loadFullPenawaranData(editData.id || editData.id_penawaran);
        } else {
          // Use existing data
          initializeFormData(editData);
        }
      }
    } catch (error) {
      console.error("❌ Edit: Error in useEffect:", error);
      setComponentError(`Failed to initialize edit form: ${error.message}`);
    }
  }, [editData]);

  // Function to load full penawaran data with layanan details
  const loadFullPenawaranData = async (penawaranId) => {
    try {
      console.log("🔄 Edit: Loading full data for ID:", penawaranId);
      
      const userData = getUserData();
      if (!userData) {
        throw new Error('No user data found');
      }
      
      const response = await fetch(`http://localhost:3000/api/penawaran/${penawaranId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userData.id_user.toString(),
          'X-User-Role': userData.role_user,
          'X-User-Email': userData.email_user
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("✅ Full penawaran data loaded:", result.data);
      
      if (result.success && result.data) {
        // Initialize form with complete data
        initializeFormData({ ...editData, rawData: result.data });
      } else {
        throw new Error(result.message || 'Failed to load penawaran data');
      }
    } catch (error) {
      console.error("❌ Edit: Error loading full penawaran data:", error);
      // Fallback to existing data
      initializeFormData(editData);
    }
  };

  // Function to initialize form data
  const initializeFormData = (dataSource) => {
    console.log("🔧 Edit: Initializing form with data source:", dataSource);
    
    // Get layanan data from data_penawaran_layanan if available
    const layananData = dataSource.rawData?.data_penawaran_layanan?.[0];
    console.log("🔧 Edit: Layanan data from data_penawaran_layanan:", layananData);
    
    const initialData = {
      sales: dataSource.rawData?.sales || dataSource.sales || dataSource.namaSales || "",
      tanggal: (dataSource.rawData?.tanggal_dibuat || dataSource.tanggal) ? new Date(dataSource.rawData?.tanggal_dibuat || dataSource.tanggal).toISOString().split('T')[0] : "",
      pelanggan: dataSource.namaPelanggan || dataSource.pelanggan || "",
      nomorKontrak: dataSource.nomorKontrak || "",
      kontrakTahunKe: dataSource.kontrakKe || dataSource.kontrakTahunKe || "",
      referensiHJT: dataSource.referensi || dataSource.referensiHJT || "",
      durasiKontrak: dataSource.durasi || dataSource.durasiKontrak || "",
      // Use layanan data from data_penawaran_layanan
      hjtWilayah: layananData?.data_layanan?.wilayah_hjt || 
                 dataSource.hjtWilayah || 
                 dataSource.wilayah_hjt || 
                 dataSource.hjt_wilayah ||
                 dataSource.rawData?.wilayah_hjt || "",
      namaLayanan: layananData?.nama_layanan ||
                  layananData?.data_layanan?.nama_layanan ||
                  dataSource.namaLayanan || 
                  dataSource.nama_layanan ||
                  dataSource.rawData?.nama_layanan || "",
      detailLayanan: layananData?.detail_layanan ||
                    dataSource.detailLayanan || 
                    dataSource.detail_layanan ||
                    dataSource.rawData?.detail_layanan || "",
      kapasitas: layananData?.kapasitas ||
                dataSource.kapasitas || 
                dataSource.rawData?.kapasitas || "",
      satuan: layananData?.satuan ||
             layananData?.data_layanan?.satuan ||
             dataSource.satuan || 
             dataSource.rawData?.satuan || "",
      qty: layananData?.qty ||
          dataSource.qty || 
          dataSource.rawData?.qty || "",
      aksesExisting: layananData?.akses_existing ||
                    dataSource.aksesExisting || 
                    dataSource.akses_existing || 
                    dataSource.rawData?.akses_existing ||
                    dataSource.rawData?.aksesExisting || "",
      marginPercent: (dataSource.rawData?.data_penawaran_layanan && dataSource.rawData.data_penawaran_layanan.length > 0) 
                    ? dataSource.rawData.data_penawaran_layanan[0].margin_percent 
                    : dataSource.marginPercent || 
                      dataSource.margin_percent || "",
      // Add missing fields for auto-populate
      backbone: layananData?.backbone ||
                layananData?.data_layanan?.backbone ||
                dataSource.backbone || 
                dataSource.rawData?.backbone || "",
      port: layananData?.port ||
            layananData?.data_layanan?.port ||
            dataSource.port || 
            dataSource.rawData?.port || "",
      tarifAkses: layananData?.tarif_akses ||
                  layananData?.data_layanan?.tarif_akses ||
                  dataSource.tarifAkses || 
                  dataSource.tarif_akses ||
                  dataSource.rawData?.tarif_akses || "",
      tarif: layananData?.tarif ||
             layananData?.data_layanan?.tarif ||
             dataSource.tarif || 
             dataSource.rawData?.tarif || "",
      discount: dataSource.discount || dataSource.rawData?.discount || dataSource.rawData?.diskon || "",
    };

    console.log("🔧 Edit: Initial data set:", initialData);
    
    setFormData(initialData);
    setOriginalData(initialData);

    // Initialize multiple layanan items from data_penawaran_layanan
    if (dataSource.rawData?.data_penawaran_layanan && dataSource.rawData.data_penawaran_layanan.length > 0) {
      console.log("🔧 Edit: Found data_penawaran_layanan:", dataSource.rawData.data_penawaran_layanan);
      
      const layananItemsFromDB = dataSource.rawData.data_penawaran_layanan.map((item, index) => {
        console.log(`🔧 Edit: Processing layanan item ${index + 1}:`, item);
        return {
          namaLayanan: item.nama_layanan || item.data_layanan?.nama_layanan || "",
          detailLayanan: item.detail_layanan || "",
          kapasitas: item.kapasitas || "",
          qty: item.qty || "",
          aksesExisting: item.akses_existing || "",
          marginPercent: item.margin_percent || ""
        };
      });
      
      setLayananItems(layananItemsFromDB);
      setOriginalLayananItems(JSON.parse(JSON.stringify(layananItemsFromDB))); // Deep copy for comparison
      console.log("🔧 Edit: Initialized layanan items from database:", layananItemsFromDB);
    } else {
      console.log("🔧 Edit: No data_penawaran_layanan found, using fallback");
      
      // Fallback to single item from formData for backward compatibility
      const fallbackItem = {
        namaLayanan: initialData.namaLayanan,
        detailLayanan: initialData.detailLayanan,
        kapasitas: initialData.kapasitas,
        qty: initialData.qty,
        aksesExisting: initialData.aksesExisting,
        marginPercent: initialData.marginPercent
      };
      
      setLayananItems([fallbackItem]);
      setOriginalLayananItems([JSON.parse(JSON.stringify(fallbackItem))]); // Deep copy for comparison
    }

    // Load layanan data first
    loadLayananData().then(() => {
      console.log("🔧 Edit: Layanan data loaded successfully");
    }).catch(error => {
      console.error("❌ Edit: Error loading layanan data:", error);
      setComponentError(`Failed to load layanan data: ${error.message}`);
    });

    // Load pengeluaran data from API
    loadPengeluaranData().catch(error => {
      console.error("❌ Edit: Error loading pengeluaran data:", error);
      // Don't set component error for pengeluaran, just log it
    });
  };

  // Separate useEffect to handle layanan data update and filter initialization
  useEffect(() => {
    if (layananData && layananData.length > 0 && editData) {
      console.log("🔧 Edit: LayananData updated, processing existing values...");
      
      // Update HJT Wilayah filter first
      updateHjtWilayahFilter();
      
      // If we have data in form already (from direct mapping), use that
      if (formData.referensiHJT || formData.namaLayanan || formData.detailLayanan) {
        console.log("🔧 Edit: Found existing form data:", {
          referensiHJT: formData.referensiHJT,
          namaLayanan: formData.namaLayanan,
          detailLayanan: formData.detailLayanan
        });
        
        // Update filters based on existing form data
        if (formData.referensiHJT) {
          updateNamaLayananFilter(formData.referensiHJT);
        }
        if (formData.referensiHJT && formData.namaLayanan) {
          updateDetailLayananFilter(formData.referensiHJT, formData.namaLayanan);
        }
        
        console.log("🔧 Edit: Updated filters for existing form data");
      }
    }
  }, [layananData, editData]);

  // Load data layanan when component mounts or when modal opens
  useEffect(() => {
    if (isOpen) {
      loadLayananData();
    }
  }, [isOpen]);

  // Function to load layanan data from API
  const loadLayananData = async () => {
    try {
      setLoadingLayanan(true);
      console.log('🔄 Edit: Starting to load layanan data...');
      
      const userData = getUserData();
      console.log('👤 Edit: User data:', userData);
      
      if (!userData) {
        throw new Error('No user data found');
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

      console.log('📡 Edit: API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Edit: Layanan API result:', result);
      
      if (result.success && result.data) {
        console.log('📋 Edit: Raw layanan data:', result.data);
        setLayananData(result.data);
        
        // Extract unique HJT wilayah
        const uniqueWilayah = [...new Set(result.data.map(item => item.wilayah_hjt))];
        const filteredWilayah = uniqueWilayah.filter(Boolean); // Remove null/undefined values
        setAvailableHjtWilayah(filteredWilayah);
        
        console.log('🗺️ Edit: Available HJT Wilayah:', filteredWilayah);
        console.log('📊 Edit: Total layanan items:', result.data.length);
      } else {
        throw new Error(result.message || 'Failed to load layanan data');
      }
    } catch (error) {
      console.error('❌ Edit: Error loading layanan data:', error);
      throw error; // Re-throw to be caught by calling function
    } finally {
      setLoadingLayanan(false);
    }
  };

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
          setShowPengeluaranButton(false);

          console.log('Pengeluaran data loaded:', pengeluaranItems);
        } else {
          setExistingPengeluaran(null);
          // Reset pengeluaran items to empty array when no existing data
          setPengeluaranItems([]);
          setShowAdditionalSection(false);
          setShowPengeluaranButton(true);
          console.log('No pengeluaran data found for this penawaran - reset to empty');
        }
      } else {
        console.error('Failed to load pengeluaran data. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setExistingPengeluaran(null);
        // Reset pengeluaran items to empty array on error
        setPengeluaranItems([]);
        setShowAdditionalSection(false);
        setShowPengeluaranButton(true);
      }
    } catch (error) {
      console.error('Error loading pengeluaran data:', error);
      setExistingPengeluaran(null);
      // Reset pengeluaran items to empty array on error
      setPengeluaranItems([]);
      setShowAdditionalSection(false);
      setShowPengeluaranButton(true);
    } finally {
      setLoadingPengeluaran(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle Referensi HJT selection and filter nama layanan
    if (name === 'referensiHJT') {
      // Filter layanan based on selected Referensi HJT (wilayah_hjt)
      const filtered = layananData.filter(layanan => layanan.wilayah_hjt === value);
      setFilteredLayananData(filtered);
      
      // Extract unique nama_layanan for the selected wilayah
      const uniqueNamaLayanan = [...new Set(filtered.map(item => item.nama_layanan))];
      const filteredNamaLayanan = uniqueNamaLayanan.filter(Boolean);
      setAvailableNamaLayanan(filteredNamaLayanan);
      
      // Reset dependent selections
      setFormData((prev) => ({
        ...prev,
        referensiHJT: value,
        namaLayanan: '', // Reset nama layanan selection
        detailLayanan: '' // Reset detail layanan selection
      }));
      setAvailableDetailLayanan([]); // Clear detail layanan options
      setSelectedLayanan(null);
      
      console.log('🗺️ Edit: Referensi HJT selected:', value);
      console.log('📋 Edit: Available nama layanan:', filteredNamaLayanan);
    }
    // Handle nama layanan selection and filter detail layanan
    else if (name === 'namaLayanan') {
      // Filter detail layanan (jenis_layanan) based on selected nama_layanan and wilayah
      const filtered = layananData.filter(layanan => 
        layanan.wilayah_hjt === formData.referensiHJT && layanan.nama_layanan === value
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
      
      console.log('🎯 Edit: Nama Layanan selected:', value);
      console.log('📝 Edit: Available detail layanan:', filteredDetailLayanan);
    }
    // Handle detail layanan selection
    else if (name === 'detailLayanan') {
      // Find the selected layanan data
      const selectedLayananData = layananData.find(layanan => 
        layanan.wilayah_hjt === formData.referensiHJT && 
        layanan.nama_layanan === formData.namaLayanan && 
        layanan.jenis_layanan === value
      );
      setSelectedLayanan(selectedLayananData);
      
      // Auto-populate fields from selected layanan data
      const autoSatuan = selectedLayananData ? selectedLayananData.satuan : '';
      const autoBackbone = selectedLayananData ? selectedLayananData.backbone : '';
      const autoPort = selectedLayananData ? selectedLayananData.port : '';
      const autoTarifAkses = selectedLayananData ? selectedLayananData.tarif_akses : '';
      const autoTarif = selectedLayananData ? selectedLayananData.tarif : '';
      
      setFormData((prev) => ({
        ...prev,
        detailLayanan: value,
        satuan: autoSatuan, // Auto-populate satuan from database
        backbone: autoBackbone, // Auto-populate backbone from database
        port: autoPort, // Auto-populate port from database
        tarifAkses: autoTarifAkses, // Auto-populate tarif akses from database
        tarif: autoTarif // Auto-populate tarif from database
      }));
      
      console.log('📊 Edit: Detail Layanan selected:', value);
      console.log('✅ Edit: Selected layanan data:', selectedLayananData);
      console.log('🔄 Edit: Auto-populated fields:', {
        satuan: autoSatuan,
        backbone: autoBackbone,
        port: autoPort,
        tarifAkses: autoTarifAkses,
        tarif: autoTarif
      });
    } 
    // Handle other form fields
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Helper functions for multiple pengeluaran items
  const handlePengeluaranItemChange = (index, field, value) => {
    try {
      setPengeluaranItems(prev => {
        const prevItems = prev || [];
        const updated = [...prevItems];
        
        // Ensure the item exists at the index
        if (!updated[index]) {
          updated[index] = { id: null, item: "", keterangan: "", hasrat: "", jumlah: "", isExisting: false };
        }
        
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
    } catch (error) {
      console.error("❌ Error in handlePengeluaranItemChange:", error);
    }
  };

  const addPengeluaranItem = () => {
    try {
      setPengeluaranItems(prev => {
        const prevItems = prev || [];
        return [...prevItems, {
          id: null,
          item: "",
          keterangan: "",
          hasrat: "",
          jumlah: "",
          total: 0,
          isExisting: false
        }];
      });
      console.log('➕ Added new pengeluaran item');
    } catch (error) {
      console.error("❌ Error in addPengeluaranItem:", error);
    }
  };

  const removePengeluaranItem = (index) => {
    try {
      setPengeluaranItems(prev => {
        const prevItems = prev || [];
        if (prevItems.length > 1) {
          const filtered = prevItems.filter((_, i) => i !== index);
          console.log('🗑️ Removed pengeluaran item at index:', index);
          return filtered;
        }
        return prevItems;
      });
    } catch (error) {
      console.error("❌ Error in removePengeluaranItem:", error);
    }
  };

  const getTotalPengeluaran = () => {
    try {
      const items = pengeluaranItems || [];
      return items.reduce((total, item) => {
        if (!item) return total;
        const hasrat = parseFloat(item.hasrat) || 0;
        const jumlah = parseFloat(item.jumlah) || 0;
        return total + (hasrat * jumlah);
      }, 0);
    } catch (error) {
      console.error("❌ Error in getTotalPengeluaran:", error);
      return 0;
    }
  };

  // Helper functions for multiple layanan items
  const handleLayananItemChange = (index, field, value) => {
    try {
      const updatedItems = [...layananItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      setLayananItems(updatedItems);
      
      // Update formData if it's the first item (for backward compatibility)
      if (index === 0) {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      }
      
      console.log(`🔧 Updated layanan item ${index + 1}, field: ${field}, value: ${value}`);
    } catch (error) {
      console.error("❌ Error in handleLayananItemChange:", error);
    }
  };

  const addLayananItem = () => {
    try {
      setLayananItems(prev => [...prev, {
        namaLayanan: "",
        detailLayanan: "",
        kapasitas: "",
        qty: "",
        aksesExisting: "",
        marginPercent: ""
      }]);
      console.log('➕ Added new layanan item');
    } catch (error) {
      console.error("❌ Error in addLayananItem:", error);
    }
  };

  const removeLayananItem = (index) => {
    try {
      if (layananItems.length > 1) {
        const updatedItems = layananItems.filter((_, i) => i !== index);
        setLayananItems(updatedItems);
        
        // Update formData if we removed the first item
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
        
        console.log('🗑️ Removed layanan item at index:', index);
      }
    } catch (error) {
      console.error("❌ Error in removeLayananItem:", error);
    }
  };

  // Get available nama layanan options for specific layanan item
  const getAvailableNamaLayanan = (index) => {
    return availableNamaLayanan;
  };

  // Get detail layanan options for specific layanan item  
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

  // Function to check if form data has changed
  const hasDataChanged = () => {
    try {
      // Ensure data is not null before comparison
      const currentFormData = formData || {};
      const originalFormData = originalData || {};
      
      // Check if main form data has changed
      const formChanged = JSON.stringify(currentFormData) !== JSON.stringify(originalFormData);
      
      // Check if pengeluaran items have changed
      const pengeluaranChanged = checkPengeluaranChanges();
      
      // Check if layanan items have changed
      const layananChanged = checkLayananChanges();
      
      console.log('🔍 Change detection:', {
        formChanged,
        pengeluaranChanged,
        layananChanged,
        hasAnyChanges: formChanged || pengeluaranChanged || layananChanged
      });
      
      return formChanged || pengeluaranChanged || layananChanged;
    } catch (error) {
      console.error("❌ Error in hasDataChanged:", error);
      return false; // Default to no changes if error occurs
    }
  };

  // Function to check if layanan items have changed
  const checkLayananChanges = () => {
    try {
      // Check if layananItems array has changed from initial state
      const currentLayanan = layananItems || [];
      const originalLayanan = originalLayananItems || [];
      
      console.log('🏷️ Checking layanan changes:', {
        currentCount: currentLayanan.length,
        originalCount: originalLayanan.length,
        currentItems: currentLayanan,
        originalItems: originalLayanan
      });
      
      // If the number of items changed, it's a change
      if (currentLayanan.length !== originalLayanan.length) {
        console.log('🏷️ Layanan count changed:', currentLayanan.length, 'vs', originalLayanan.length);
        return true;
      }
      
      // If no layanan items and none originally, no change
      if (currentLayanan.length === 0 && originalLayanan.length === 0) {
        return false;
      }
      
      // Compare each layanan item
      for (let i = 0; i < currentLayanan.length; i++) {
        const current = currentLayanan[i] || {};
        const original = originalLayanan[i] || {};
        
        // Compare key fields that could change
        const fieldsToCompare = [
          'namaLayanan', 'detailLayanan', 'kapasitas', 'satuan', 'qty',
          'backbone', 'port', 'tarifAkses', 'aksesExisting', 'tarif', 'marginPercent'
        ];
        
        for (const field of fieldsToCompare) {
          if (String(current[field] || '') !== String(original[field] || '')) {
            console.log(`🏷️ Layanan item ${i} field ${field} changed:`, current[field], 'vs', original[field]);
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error("❌ Error in checkLayananChanges:", error);
      return false; // Default to no changes if error occurs
    }
  };

  // Function to check if pengeluaran items have changed
  const checkPengeluaranChanges = () => {
    try {
      // Ensure arrays are not null
      const currentPengeluaran = pengeluaranItems || [];
      const existingPengeluaranList = existingPengeluaran || [];
      
      // If additional section is shown but wasn't before, that's a change
      if (showAdditionalSection && existingPengeluaranList.length === 0) {
        return currentPengeluaran.some(item => item?.item || item?.keterangan || item?.hasrat || item?.jumlah);
      }
      
      // If additional section is hidden but there was existing data, that's a change
      if (!showAdditionalSection && existingPengeluaranList.length > 0) {
        return true;
      }
      
      // If no additional section shown and no existing data, no change
      if (!showAdditionalSection && existingPengeluaranList.length === 0) {
        return false;
      }
      
      // Compare current items with existing data
      if (existingPengeluaranList.length !== currentPengeluaran.length) {
        return true;
      }
      
      // Check each item for changes
      for (let i = 0; i < currentPengeluaran.length; i++) {
        const current = currentPengeluaran[i] || {};
        const existing = existingPengeluaranList[i] || {};
        
        if (!existing || Object.keys(existing).length === 0) {
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
    } catch (error) {
      console.error("❌ Error in checkPengeluaranChanges:", error);
      return false; // Default to no changes if error occurs
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if any data has changed
    if (!hasDataChanged()) {
      return; // Don't proceed if no changes
    }

    // Validasi form - field penawaran utama yang wajib
    const requiredMainFields = ['pelanggan', 'nomorKontrak', 'durasiKontrak', 'referensiHJT'];
    const missingMainFields = requiredMainFields.filter(field => !formData[field]);
    
    if (missingMainFields.length > 0) {
      const fieldNames = {
        'pelanggan': 'Pelanggan',
        'nomorKontrak': 'Nomor Kontrak',
        'durasiKontrak': 'Durasi Kontrak',
        'referensiHJT': 'Referensi HJT',
      };
      const translatedFields = missingMainFields.map(field => fieldNames[field] || field);
      alert(`Harap isi field yang wajib: ${translatedFields.join(', ')}`);
      return;
    }

    // Validasi layanan items - minimal harus ada 1 item yang lengkap
    const validLayananItems = layananItems.filter(item => 
      item.namaLayanan && item.detailLayanan && item.kapasitas && item.qty && item.marginPercent
    );
    
    console.log('🔍 ============ LAYANAN VALIDATION DEBUG ============');
    console.log('🔍 Current layananItems state:', layananItems);
    console.log('🔍 Total layanan items:', layananItems.length);
    console.log('🔍 Valid layanan items:', validLayananItems.length);
    console.log('🔍 Valid layanan items data:', validLayananItems);
    
    // Debug each item individually
    layananItems.forEach((item, index) => {
      console.log(`🔍 Item ${index + 1} validation:`, {
        namaLayanan: !!item.namaLayanan,
        detailLayanan: !!item.detailLayanan,
        kapasitas: !!item.kapasitas,
        qty: !!item.qty,
        marginPercent: !!item.marginPercent,
        data: item
      });
    });
    console.log('🔍 ================================================');
    
    if (validLayananItems.length === 0) {
      alert('Harap isi minimal 1 layanan dengan lengkap (Nama Layanan, Detail Layanan, Kapasitas, QTY, dan Margin %)');
      return;
    }

    // Validasi setiap layanan item - jika ada field yang diisi, harus lengkap semua
    const hasIncompleteLayanan = layananItems.some(item => {
      const hasAnyField = item.namaLayanan || item.detailLayanan || item.kapasitas || item.qty || item.marginPercent;
      const hasAllFields = item.namaLayanan && item.detailLayanan && item.kapasitas && item.qty && item.marginPercent;
      return hasAnyField && !hasAllFields;
    });

    if (hasIncompleteLayanan) {
      alert('Jika mengisi layanan, harap lengkapi semua field (Nama Layanan, Detail Layanan, Kapasitas, QTY, Margin %) untuk setiap layanan.');
      return;
    }

    // Validasi pengeluaran items (optional but if filled, must be complete)
    const safeItems = pengeluaranItems || [];
    const hasIncompletePengeluaran = safeItems.some(item => {
      if (!item) return false;
      const hasAnyField = item.item || item.keterangan || item.hasrat || item.jumlah;
      const hasAllFields = item.item && item.keterangan && item.hasrat && item.jumlah;
      return hasAnyField && !hasAllFields;
    });

    if (hasIncompletePengeluaran) {
      alert('Jika mengisi pengeluaran lain-lain, harap lengkapi semua field (Item, Keterangan, Harga Satuan, Jumlah) untuk setiap item.');
      return;
    }

    console.log('📝 Updating penawaran data:', formData);
    console.log('📝 Layanan items data:', layananItems);
    console.log('📝 Valid layanan items:', validLayananItems);
    console.log('📝 Margin percent check:', { 
      marginPercent: formData.marginPercent, 
      type: typeof formData.marginPercent 
    });
    console.log('📝 Pengeluaran items:', pengeluaranItems);
    console.log('📝 Show additional section:', showAdditionalSection);
    console.log('✅ Edit: Selected layanan data:', selectedLayanan);

    setIsSaving(true);
    
    // Prepare layanan items data for backend
    const processedLayananItems = layananItems
      .filter(item => item.namaLayanan && item.detailLayanan && item.kapasitas && item.qty && item.marginPercent)
      .map((item, index) => {
        console.log(`🔧 Processing layanan item ${index + 1} for backend:`, item);
        return {
          namaLayanan: item.namaLayanan.trim(),
          detailLayanan: item.detailLayanan.trim(),
          kapasitas: item.kapasitas.toString().trim(),
          qty: item.qty.toString().trim(),
          aksesExisting: item.aksesExisting.trim(),
          marginPercent: item.marginPercent.toString().trim()
        };
      });

    console.log('🔧 Processed layanan items for backend:', processedLayananItems);

    // Include pengeluaran info for the parent component
    const updateData = {
      id: editData.id,
      id_penawaran: editData.id_penawaran,
      ...formData,
      // Add selected layanan data for backend reference
      selectedLayananId: selectedLayanan?.id_layanan,
      // Send auto-populated data from formData
      backbone: formData.backbone,
      port: formData.port,
      tarif_akses: formData.tarifAkses, // Note: frontend uses tarifAkses, backend expects tarif_akses
      tarif: formData.tarif,
      piliLayanan: `${formData.namaLayanan} - ${formData.detailLayanan}`, // For display/backward compatibility
      // Add multiple layanan items data
      layananItems: processedLayananItems,
      // Include pengeluaran items data only if additional section is shown or has existing data
      pengeluaranItems: (showAdditionalSection || (existingPengeluaran && existingPengeluaran.length > 0)) 
        ? pengeluaranItems.filter(item => 
            item.item && item.keterangan && item.hasrat && item.jumlah
          )
        : [],
      // Include total pengeluaran lain-lain
      total_pengeluaran_lain_lain: (showAdditionalSection || (existingPengeluaran && existingPengeluaran.length > 0)) 
        ? getTotalPengeluaran() 
        : 0,
      _hasExistingPengeluaran: !!(existingPengeluaran && existingPengeluaran.length > 0),
      _showAdditionalSection: showAdditionalSection, // Add this flag to help backend understand user intent
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
      hjtWilayah: "",
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      satuan: "",
      qty: "",
      aksesExisting: "",
      discount: "",
    });
    
    // Reset layanan related states
    setSelectedLayanan(null);
    setAvailableNamaLayanan([]);
    setAvailableDetailLayanan([]);
    setFilteredLayananData([]);
    
    // Reset layanan items
    setLayananItems([{
      namaLayanan: "",
      detailLayanan: "",
      kapasitas: "",
      qty: "",
      aksesExisting: "",
      marginPercent: ""
    }]);
    
    // Reset pengeluaran items to empty array
    setPengeluaranItems([]);
    setExistingPengeluaran([]);
    setShowAdditionalSection(false);
    setShowPengeluaranButton(true);
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
      discount: "",
    });
    
    // Reset layanan related states
    setSelectedLayanan(null);
    setAvailableNamaLayanan([]);
    setAvailableDetailLayanan([]);
    setFilteredLayananData([]);
    
    setShowAdditionalSection(false);
    setShowPengeluaranButton(true);
    onClose();
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowAdditionalSection(true);
    setShowPengeluaranButton(false);
    console.log('✅ Additional section enabled');
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setShowAdditionalSection(false);
    setShowPengeluaranButton(true);
    // Reset pengeluaran items to empty array when user chooses No
    setPengeluaranItems([]);
    console.log('❌ Additional section disabled and pengeluaran reset to empty');
  };

  if (!isOpen && !showSuccessModal) return null;

  // Error fallback
  if (componentError) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "500px",
          textAlign: "center"
        }}>
          <h3 style={{ color: "red", marginBottom: "10px" }}>Error</h3>
          <p style={{ marginBottom: "20px" }}>{componentError}</p>
          <button 
            onClick={() => {
              setComponentError(null);
              onClose();
            }}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

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
                  Edit Data Penawaran
                </h2>
                <p style={{
                  color: colors.accent1,
                  fontSize: '16px',
                  margin: '8px 0 0',
                  opacity: 0.8
                }}>
                  Perbarui informasi penawaran yang sudah ada
                </p>
              </motion.div>

              {/* Form */}
              <motion.form 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                id="form-edit-penawaran" 
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
                      {availableHjtWilayah.map((wilayah, idx) => (
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
                      <option value="" disabled hidden>Durasi Kontrak</option>
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
                                      <option value="" disabled hidden>Pilih akses existing</option>
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
                    {/* Tombol Close Untuk pengeluaran */}
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setShowAdditionalSection(false);
                        setShowPengeluaranButton(true);
                      }}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(3, 91, 113, 0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    >
                      <X size={16} color={colors.primary} />
                    </motion.button>
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

                        {/* Total Display */}
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
                                  <span>Total Item:</span>
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
                      form="form-edit-penawaran"
                      disabled={isSaving || !hasDataChanged()}
                      style={{
                        background: isSaving || !hasDataChanged()
                          ? `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.tertiary} 100%)`
                          : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
                        color: '#ffffff',
                        border: 'none',
                        padding: '16px 40px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: isSaving || !hasDataChanged() ? 'not-allowed' : 'pointer',
                        boxShadow: `0 4px 20px rgba(0, 191, 202, 0.4)`,
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.02em',
                        opacity: isSaving || !hasDataChanged() ? 0.8 : 1
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
                  Apakah anda ingin mengubah pengeluaran lain-lain?
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
                  Data penawaran telah berhasil diperbarui
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

export default Edit;

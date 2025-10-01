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
  console.log("🔧 Edit component mounted with:", { isOpen, editData });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAdditionalSection, setShowAdditionalSection] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [loadingPengeluaran, setLoadingPengeluaran] = useState(false);
  const [existingPengeluaran, setExistingPengeluaran] = useState([]);
  const [componentError, setComponentError] = useState(null);
  
  // Error boundary for catching errors
  useEffect(() => {
    const handleError = (error) => {
      console.error("❌ Error in Edit component:", error);
      setComponentError(error.message);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  // Layanan data states
  const [layananData, setLayananData] = useState([]);
  const [filteredLayananData, setFilteredLayananData] = useState([]);
  const [availableHjtWilayah, setAvailableHjtWilayah] = useState([]);
  const [availableNamaLayanan, setAvailableNamaLayanan] = useState([]);
  const [availableDetailLayanan, setAvailableDetailLayanan] = useState([]);
  const [loadingLayanan, setLoadingLayanan] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  
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
    hjtWilayah: "",
    namaLayanan: "",
    detailLayanan: "",
    kapasitas: "",
    satuan: "",
    qty: "",
    aksesExisting: "",
    discount: "",
    // Remove single pengeluaran fields as we now use pengeluaranItems array
    // item: "",
    // keterangan: "",
    // hasrat: "",
    // jumlah: "",
  });

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
      console.log("🔧 Edit: editData keys:", editData ? Object.keys(editData) : 'null');
      console.log("🔧 Edit: editData.rawData:", editData?.rawData);
      console.log("🔧 Edit: editData.rawData keys:", editData?.rawData ? Object.keys(editData.rawData) : 'null');
      console.log("🔧 Edit: editData.rawData.data_penawaran_layanan:", editData?.rawData?.data_penawaran_layanan);
      console.log("🔧 Edit: editData.piliLayanan:", editData?.piliLayanan);
      console.log("🔧 Edit: editData.hjtWilayah:", editData?.hjtWilayah);
      console.log("🔧 Edit: editData.wilayah_hjt:", editData?.wilayah_hjt);
      console.log("🔧 Edit: editData.hjt_wilayah:", editData?.hjt_wilayah);
      console.log("🔧 Edit: editData.namaLayanan:", editData?.namaLayanan);
      console.log("🔧 Edit: editData.nama_layanan:", editData?.nama_layanan);
      console.log("🔧 Edit: editData.detailLayanan:", editData?.detailLayanan);
      console.log("🔧 Edit: editData.detail_layanan:", editData?.detail_layanan);
      console.log("🔧 Edit: editData.satuan:", editData?.satuan);
      console.log("🔧 Edit: editData.aksesExisting:", editData?.aksesExisting);
      console.log("🔧 Edit: editData.akses_existing:", editData?.akses_existing);
      
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
    console.log("🔧 Edit: Form data fields check:");
    console.log("  - hjtWilayah:", initialData.hjtWilayah);
    console.log("  - namaLayanan:", initialData.namaLayanan);
    console.log("  - detailLayanan:", initialData.detailLayanan);
    console.log("  - satuan:", initialData.satuan);
    console.log("  - aksesExisting:", initialData.aksesExisting);
    
    setFormData(initialData);
    setOriginalData(initialData);

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
      // If we have piliLayanan, parse and set the values (fallback)
      else if (editData.piliLayanan) {
        console.log("🔧 Edit: Processing piliLayanan with updated layananData:", editData.piliLayanan);
        
        const layananParts = editData.piliLayanan.split(' - ');
        if (layananParts.length === 2) {
          const [namaLayanan, detailLayanan] = layananParts;
          
          const matchingLayanan = layananData.find(layanan => 
            layanan.nama_layanan === namaLayanan && layanan.detail_layanan === detailLayanan
          );
          
          if (matchingLayanan) {
            console.log("🔧 Edit: Found matching layanan:", matchingLayanan);
            
            // Update form data with complete layanan info
            setFormData(prev => ({
              ...prev,
              referensiHJT: matchingLayanan.wilayah_hjt,
              namaLayanan,
              detailLayanan
            }));
            
            // Update filters
            updateNamaLayananFilter(matchingLayanan.wilayah_hjt);
            updateDetailLayananFilter(matchingLayanan.wilayah_hjt, namaLayanan);
            
            console.log("🔧 Edit: Updated form with layanan data");
          } else {
            console.warn("⚠️ Edit: No matching layanan found for:", editData.piliLayanan);
          }
        }
      } else if (formData.referensiHJT) {
        // If we have referensiHJT but no piliLayanan, update nama layanan filter
        console.log("🔧 Edit: Updating filters for existing Referensi HJT:", formData.referensiHJT);
        updateNamaLayananFilter(formData.referensiHJT);
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
      
      console.log('🔍 Change detection:', {
        formChanged,
        pengeluaranChanged,
        hasAnyChanges: formChanged || pengeluaranChanged
      });
      
      return formChanged || pengeluaranChanged;
    } catch (error) {
      console.error("❌ Error in hasDataChanged:", error);
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

    // Validasi form - hanya field penawaran yang wajib
    const requiredFields = ['pelanggan', 'nomorKontrak', 'durasiKontrak', 'referensiHJT', 'namaLayanan', 'detailLayanan', 'kapasitas', 'satuan', 'qty'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      const fieldNames = {
        'pelanggan': 'Pelanggan',
        'nomorKontrak': 'Nomor Kontrak',
        'durasiKontrak': 'Durasi Kontrak',
        'referensiHJT': 'Referensi HJT',
        'namaLayanan': 'Nama Layanan',
        'detailLayanan': 'Detail Layanan',
        'kapasitas': 'Kapasitas',
        'satuan': 'Satuan',
        'qty': 'QTY'
      };
      const translatedFields = missingFields.map(field => fieldNames[field] || field);
      alert(`Harap isi field yang wajib: ${translatedFields.join(', ')}`);
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
    console.log('📝 Pengeluaran items:', pengeluaranItems);
    console.log('📝 Show additional section:', showAdditionalSection);
    console.log('✅ Edit: Selected layanan data:', selectedLayanan);

    setIsSaving(true);
    
    // Include pengeluaran info for the parent component
    // Do not include the full editData object to avoid carrying extra data
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
                    Sales
                  </label>
                  <input
                    type="text"
                    name="sales"
                    value={formData.sales}
                    onChange={handleInputChange}
                    disabled={true}
                    placeholder="Masukkan Nama"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "2px solid #B0BEC5",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#f5f5f5",
                      boxSizing: "border-box",
                      cursor: "not-allowed",
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
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    disabled={true}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "2px solid #B0BEC5",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#f5f5f5",
                      boxSizing: "border-box",
                      cursor: "not-allowed",
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
                    Pelanggan
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
                    Nomor Kontrak / BAKB
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
                    Kontrak Tahun ke-
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
                    Referensi HJT
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      name="referensiHJT"
                      value={formData.referensiHJT}
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
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <option value="">Pilih HJT</option>
                      {(availableHjtWilayah || []).map((wilayah, idx) => (
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
                    Durasi Kontrak (in thn)
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
                      Nama Layanan
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        name="namaLayanan"
                        value={formData.namaLayanan}
                        onChange={handleInputChange}
                        required
                        disabled={loadingLayanan || !formData.referensiHJT}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "2px solid #B0BEC5",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: (loadingLayanan || !formData.referensiHJT) ? "#f5f5f5" : "white",
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
                        {(availableNamaLayanan || []).map((namaLayanan, index) => (
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
                      Detail Layanan
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
                          backgroundColor: (loadingLayanan || !formData.namaLayanan) ? "#f5f5f5" : "white",
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
                        {(availableDetailLayanan || []).map((detailLayanan, index) => (
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

                  {/* Kapasitas  field*/}
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
                      Kapasitas
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
                      QTY
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
                      Akses Existing
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
                        {(pengeluaranItems || []).map((item, index) => (
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
                              {(pengeluaranItems || []).length > 1 && (
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
                                Item
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
                                Keterangan
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
                                Harga Satuan
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
                                Jumlah
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
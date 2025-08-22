import React, { useState, useEffect } from "react";
import { X, Plus, Calculator, Check } from "lucide-react";

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
  const [formData, setFormData] = useState({
    sales: "",
    tanggal: "",
    pelanggan: "",
    nomorKontrak: "",
    kontrakTahunKe: "",
    referensiHJT: "",
    durasiKontrak: "",
    item: "",
    keterangan: "",
    harga: "",
    jumlah: "",
  });

  // Pre-fill form with existing data when editing
  useEffect(() => {
    if (editData) {
      const initialData = {
        sales: editData.sales || "",
        tanggal: editData.tanggal || "",
        pelanggan: editData.namaPelanggan || editData.pelanggan || "",
        nomorKontrak: editData.nomorKontrak || "",
        kontrakTahunKe: editData.kontrakKe || editData.kontrakTahunKe || "",
        referensiHJT: editData.referensi || editData.referensiHJT || "",
        durasiKontrak: editData.durasi || editData.durasiKontrak || "",
        item: editData.item || "",
        keterangan: editData.keterangan || "",
        harga: editData.harga || "",
        jumlah: editData.jumlah || "",
      };

      setFormData(initialData);
      setOriginalData(initialData);

      // Show additional section if item data exists
      if (
        editData.item ||
        editData.keterangan ||
        editData.harga ||
        editData.jumlah
      ) {
        setShowAdditionalSection(true);
      }
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to check if form data has changed
  const hasDataChanged = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if any data has changed
    if (!hasDataChanged()) {
      return; // Don't proceed if no changes
    }

    setIsSaving(true);
    onSave({ ...editData, ...formData });

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
      item: "",
      keterangan: "",
      harga: "",
      jumlah: "",
    });
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
      item: "",
      keterangan: "",
      harga: "",
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
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setShowAdditionalSection(false);
    // Reset additional fields when user chooses No
    setFormData((prev) => ({
      ...prev,
      item: "",
      keterangan: "",
      harga: "",
      jumlah: "",
    }));
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
                    {/* Item */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                        minHeight: "40px",
                      }}
                    >
                      <label
                        style={{
                          width: "140px",
                          fontSize: "12px",
                          color: "#333",
                          fontWeight: "500",
                          flexShrink: 0,
                        }}
                      >
                        Item*
                      </label>
                      <input
                        type="text"
                        name="item"
                        value={formData.item || ""}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        placeholder="Masukkan Item"
                        required
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "12px",
                          outline: "none",
                          backgroundColor: isSaving ? "#f5f5f5" : "white",
                          cursor: isSaving ? "not-allowed" : "text",
                        }}
                      />
                    </div>

                    {/* Keterangan */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                        minHeight: "40px",
                      }}
                    >
                      <label
                        style={{
                          width: "140px",
                          fontSize: "12px",
                          color: "#333",
                          fontWeight: "500",
                          flexShrink: 0,
                        }}
                      >
                        Keterangan*
                      </label>
                      <input
                        type="text"
                        name="keterangan"
                        value={formData.keterangan || ""}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        placeholder="Masukkan keterangan"
                        required
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "12px",
                          outline: "none",
                          backgroundColor: isSaving ? "#f5f5f5" : "white",
                          cursor: isSaving ? "not-allowed" : "text",
                        }}
                      />
                    </div>

                    {/* Harga */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                        minHeight: "40px",
                      }}
                    >
                      <label
                        style={{
                          width: "140px",
                          fontSize: "12px",
                          color: "#333",
                          fontWeight: "500",
                          flexShrink: 0,
                        }}
                      >
                        Harga*
                      </label>
                      <input
                        type="text"
                        name="harga"
                        value={formData.harga || ""}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        placeholder="Masukkan harga satuan"
                        required
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "12px",
                          outline: "none",
                          backgroundColor: isSaving ? "#f5f5f5" : "white",
                          cursor: isSaving ? "not-allowed" : "text",
                        }}
                      />
                    </div>

                    {/* Jumlah */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minHeight: "40px",
                      }}
                    >
                      <label
                        style={{
                          width: "140px",
                          fontSize: "12px",
                          color: "#333",
                          fontWeight: "500",
                          flexShrink: 0,
                        }}
                      >
                        Jumlah*
                      </label>
                      <input
                        type="text"
                        name="jumlah"
                        value={formData.jumlah || ""}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        placeholder="Masukkan Jumlah"
                        required
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "12px",
                          outline: "none",
                          backgroundColor: isSaving ? "#f5f5f5" : "white",
                          cursor: isSaving ? "not-allowed" : "text",
                        }}
                      />
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

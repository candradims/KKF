import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const hjtOptions = ["Sumatra", "Jawa Bali", "Jabodetabek", "Intim"];

const TambahLayanan = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    namaLayanan: "",
    hjt: "",
    satuan: "",
    backbone: "",
    port: "",
    tarifAkses: "",
    tarif: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // State untuk data dari database
  const [layananOptions, setLayananOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  
  // State untuk custom input
  const [showCustomLayanan, setShowCustomLayanan] = useState(false);
  const [showCustomSatuan, setShowCustomSatuan] = useState(false);

  // Fetch data dari database ketika komponen dimount
  useEffect(() => {
    if (isOpen) {
      fetchOptionsFromDatabase();
    }
  }, [isOpen]);

  const fetchOptionsFromDatabase = async () => {
    setIsLoadingOptions(true);
    try {
      console.log("🔍 Fetching options from database");
      
      const response = await fetch('http://localhost:3000/api/layanan/public');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      const data = Array.isArray(result) ? result : result.data || [];
      
      // Ambil unique nama_layanan dan satuan dari database
      const uniqueLayanan = [...new Set(data.map(item => item.nama_layanan).filter(Boolean))];
      const uniqueSatuan = [...new Set(data.map(item => item.satuan).filter(Boolean))];
      
      setLayananOptions(uniqueLayanan.sort());
      setSatuanOptions(uniqueSatuan.sort());
      
      console.log("✅ Options loaded:", { layanan: uniqueLayanan.length, satuan: uniqueSatuan.length });
    } catch (error) {
      console.error("❌ Gagal mengambil data options:", error);
      // Fallback ke data default jika gagal
      setLayananOptions([
        "IP VPN (1 sd 10 Mbps)",
        "IP VPN (11 sd 50 Mbps)",
        "IP VPN Premium (2 Mbps)",
        "Metronet (1 sd 10 Mbps)",
        "Inet Corp IX&IIX (1 sd 10 Mbps)",
        "IP Transit (1 sd 10 Mbps)",
        "i-WIN Indoor",
        "MSR Bronze",
        "APK I-See (Basic)",
        "Non Analytic CCTV (Basic)",
        "IBBC CIR4-BW10 On-Net FTTH",
        "Cloud 1corevCPU 2GB Mem Cap 50GB"
      ]);
      setSatuanOptions(["Mbps", "Units"]);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle custom layanan
    if (name === 'namaLayanan') {
      if (value === 'custom') {
        setShowCustomLayanan(true);
        setFormData((prev) => ({ ...prev, [name]: '' }));
      } else {
        setShowCustomLayanan(false);
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
    // Handle custom satuan
    else if (name === 'satuan') {
      if (value === 'custom') {
        setShowCustomSatuan(true);
        setFormData((prev) => ({ ...prev, [name]: '' }));
      } else {
        setShowCustomSatuan(false);
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    setFormData({
      namaLayanan: "",
      hjt: "",
      satuan: "",
      backbone: "",
      port: "",
      tarifAkses: "",
      tarif: "",
    });
    setShowCustomLayanan(false);
    setShowCustomSatuan(false);
    onClose();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      namaLayanan: "",
      hjt: "",
      satuan: "",
      backbone: "",
      port: "",
      tarifAkses: "",
      tarif: "",
    });
    setShowCustomLayanan(false);
    setShowCustomSatuan(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!formData.namaLayanan || !formData.hjt || !formData.satuan) {
        alert("Nama layanan, HJT, dan satuan wajib diisi!");
        return;
      }

      // Call the onSave function passed from parent to save to database
      await onSave(formData);
      
      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving layanan:", error);
      alert("Gagal menyimpan layanan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: [0, -5, 5, -5, 5, -3, 3, 0],
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "800px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                position: "relative",
                padding: "24px",
                paddingBottom: "32px",
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "26px",
                    fontWeight: "800",
                    color: "#2D3A76",
                    margin: 0,
                  }}
                >
                  Tambah Layanan
                </h2>
              </div>

              {/* Form */}
              <form
                id="form-tambah-layanan"
                onSubmit={handleSubmit}
                style={{
                  backgroundColor: "#E9EDF7",
                  borderRadius: "20px",
                  padding: "32px",
                  margin: "0 auto",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  maxWidth: "600px",
                  marginBottom: "32px",
                }}
              >
                {/* Select Layanan */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <label
                    htmlFor="layanan"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2D396B",
                    }}
                  >
                    Layanan*
                  </label>
                  <select
                    id="layanan"
                    name="namaLayanan"
                    value={formData.namaLayanan}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "12px 32px 12px 16px",
                      borderRadius: "10px",
                      border: "1px solid rgba(45, 58, 118, 0.5)",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      width: "100%",
                      appearance: "none",
                      backgroundImage:
                        'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                      color: "#2D396B",
                    }}
                  >
                    <option value="">
                      {isLoadingOptions ? "Memuat layanan..." : "Pilih layanan"}
                    </option>
                    {layananOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    <option value="custom">Lainnya (Input Manual)</option>
                  </select>
                </div>

                {/* Custom Nama Layanan Input */}
                {showCustomLayanan && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <label
                      htmlFor="customNamaLayanan"
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#2D3A76",
                      }}
                    >
                      Input Layanan*
                    </label>
                    <input
                      type="text"
                      id="customNamaLayanan"
                      name="namaLayanan"
                      value={formData.namaLayanan}
                      onChange={handleChange}
                      placeholder="Masukkan nama layanan baru"
                      required
                      style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: "1px solid rgba(45, 58, 118, 0.5)",
                        fontSize: "14px",
                        backgroundColor: "#ffffff",
                        width: "100%",
                        color: "#2D396B",
                      }}
                    />
                  </div>
                )}

                {/* Select Hjt */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <label
                    htmlFor="hjt"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2D3A76",
                    }}
                  >
                    Hjt*
                  </label>
                  <select
                    id="hjt"
                    name="hjt"
                    value={formData.hjt}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "12px 32px 12px 16px",
                      borderRadius: "10px",
                      border: "1px solid rgba(45, 58, 118, 0.5)",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      width: "100%",
                      appearance: "none",
                      backgroundImage:
                        'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                      color: "#2D396B",
                    }}
                  >
                    <option value="">Pilih Hjt</option>
                    {hjtOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Satuan */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <label
                    htmlFor="satuan"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2D3A76",
                    }}
                  >
                    Satuan*
                  </label>
                  <select
                    id="satuan"
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "12px 32px 12px 16px",
                      borderRadius: "10px",
                      border: "1px solid rgba(45, 58, 118, 0.5)",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      width: "100%",
                      appearance: "none",
                      backgroundImage:
                        'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                      color: "#2D396B",
                    }}
                  >
                    <option value="">
                      {isLoadingOptions ? "Memuat satuan..." : "Pilih satuan"}
                    </option>
                    {satuanOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    <option value="custom">Lainnya (Input Manual)</option>
                  </select>
                </div>

                {/* Custom Satuan Input */}
                {showCustomSatuan && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <label
                      htmlFor="customSatuan"
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#2D3A76",
                      }}
                    >
                      Input Satuan*
                    </label>
                    <input
                      type="text"
                      id="customSatuan"
                      name="satuan"
                      value={formData.satuan}
                      onChange={handleChange}
                      placeholder="Masukkan satuan baru"
                      required
                      style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: "1px solid rgba(45, 58, 118, 0.5)",
                        fontSize: "14px",
                        backgroundColor: "#ffffff",
                        width: "100%",
                        color: "#2D396B",
                      }}
                    />
                  </div>
                )}

                {/* Input Backbone */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <label
                    htmlFor="backbone"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2D3A76",
                    }}
                  >
                    Backbone*
                  </label>
                  <input
                    id="backbone"
                    name="backbone"
                    type="text"
                    placeholder="Backbone"
                    value={formData.backbone}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1px solid rgba(45, 58, 118, 0.5)",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      color: "#2D396B",
                    }}
                  />
                </div>

                {/* Input Port */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <label
                    htmlFor="port"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2D3A76",
                    }}
                  >
                    Port*
                  </label>
                  <input
                    id="port"
                    name="port"
                    type="number"
                    placeholder="Port"
                    value={formData.port}
                    onChange={handleChange}
                    required
                    min={0}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1px solid rgba(45, 58, 118, 0.5)",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      color: "#2D396B",
                    }}
                  />
                </div>

                {/* Input Tarif Akses */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <label
                    htmlFor="tarifAkses"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2D3A76",
                    }}
                  >
                    Tarif Akses*
                  </label>
                  <input
                    id="tarifAkses"
                    name="tarifAkses"
                    type="number"
                    placeholder="Tarif Akses"
                    value={formData.tarifAkses}
                    onChange={handleChange}
                    required
                    min={0}
                    step="0.01"
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1px solid rgba(45, 58, 118, 0.5)",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      color: "#2D396B",
                    }}
                  />
                </div>

                {/* Input Tarif */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    marginBottom: "0",
                  }}
                >
                  <label
                    htmlFor="tarif"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2D3A76",
                    }}
                  >
                    Tarif*
                  </label>
                  <input
                    id="tarif"
                    name="tarif"
                    type="number"
                    placeholder="Tarif"
                    value={formData.tarif}
                    onChange={handleChange}
                    required
                    min={0}
                    step="0.01"
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1px solid rgba(45, 58, 118, 0.5)",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      color: "#2D396B",
                    }}
                  />
                </div>
              </form>

              {/* Tombol Aksi */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "20px",
                  paddingRight: "65px",
                  marginTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "#2D3A76",
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 32px",
                    borderRadius: "50px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
                {/* Tombol Simpan */}
                <button
                  type="submit"
                  form="form-tambah-layanan"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "#00AEEF",
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 32px",
                    borderRadius: "50px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up Sukses */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                position: "relative",
                width: "100%",
                maxWidth: "300px",
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
                Data Layanan Berhasil Disimpan
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
              <button
                onClick={handleCloseSuccessModal}
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  color: "#666",
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TambahLayanan;

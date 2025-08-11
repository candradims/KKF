import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const layananOptions = [
  "IP VPN (1 sd 10 Mbps)", "IP VPN (11 sd 50 Mbps)", "IP VPN (51 sd 100 Mbps)", "IP VPN (101 sd 500 Mbps)",
  "IP VPN (501 sd 1000 Mbps)", "IP VPN Premium (2 Mbps)", "IP VPN Premium (3 Mbps)", "IP VPN Premium (4 Mbps)",
  "IP VPN Premium (5 Mbps)", "IP VPN Premium (6 Mbps)", "IP VPN Premium (7 Mbps)", "IP VPN Premium (8 Mbps)",
  "IP VPN Premium (9 Mbps)", "IP VPN Premium (10 Mbps)", "IP VPN Premium (15 Mbps)", "IP VPN Premium (20 Mbps)",
  "IP VPN Premium (40 Mbps)", "Metronet (1 sd 10 Mbps)", "Metronet (11 sd 50 Mbps)", "Metronet (51 sd 100 Mbps)",
  "Metronet (101 sd 500 Mbps)", "Metronet (501 sd 1000 Mbps)", "Inet Corp IX&IIX (1 sd 10 Mbps)",
  "Inet Corp IX&IIX (11 sd 50 Mbps)", "Inet Corp IX&IIX (51 sd 100 Mbps)", "Inet Corp IX&IIX (101 sd 500 Mbps)",
  "Inet Corp IX&IIX (501 sd 1 Gbps)", "Inet Corp IX&IIX (1.01 sd 5 Gbps)", "Inet Corp IX&IIX (5.01 sd 10 Gbps)",
  "Inet Corp IIX (1 sd 10 Mbps)", "Inet Corp IIX (11 sd 50 Mbps)", "Inet Corp IIX (51 sd 100 Mbps)",
  "Inet Corp IIX (101 sd 500 Mbps)", "Inet Corp IIX (501 sd 1 Gbps)", "Inet Corp IIX (1.01 sd 5 Gbps)",
  "Inet Corp IIX (5.01 sd 10 Gbps)", "Inet Corp IX (1 sd 10 Mbps)", "Inet Corp IX (11 sd 50 Mbps)",
  "Inet Corp IX (51 sd 100 Mbps)", "Inet Corp IX (101 sd 500 Mbps)", "Inet Corp IX (501 sd 1.000 Mbps)",
  "Inet Corp IX (1.01 sd 5 Gbps)", "Inet Corp IX (5.01 sd 10 Gbps)", "IP Transit (1 sd 10 Mbps)",
  "IP Transit (11 sd 50 Mbps)", "IP Transit (51 sd 100 Mbps)", "IP Transit (101 sd 500 Mbps)",
  "IP Transit (501 sd 1 Gbps)", "IP Transit (1.01 sd 5 Gbps)", "IP Transit (5.01 sd 10 Gbps)",
  "IP Transit IIX (1 sd 10 Mbps)", "IP Transit IIX (11 sd 50 Mbps)", "IP Transit IIX (51 sd 100 Mbps)",
  "IP Transit IIX (101 sd 500 Mbps)", "IP Transit IIX (501 sd 1Gbps)", "IP Transit IIX (1.01 sd 5 Gbps)",
  "IP Transit IIX (5.01 sd 10 Gbps)", "IP Transit IX (1 sd 10 Mbps)", "IP Transit IX Only (11 sd 50 Mbps)",
  "IP Transit IX (51 sd 100 Mbps)", "IP Transit IX (101 sd 500 Mbps)", "IP Transit IX (501 sd 1 Gbps)",
  "IP Transit IX (1.01 sd 5 Gbps)", "IP Transit IX (5.01 sd 10 Gbps)", "i-WIN Indoor", "i-WIN Outdoor",
  "MSR Bronze", "MSR Silver (12 Bulan)", "MSR Gold (12 Bulan)", "MSR Platinum (12 Bulan)", "APK I-See (Basic)",
  "APK I-See (Flex)", "APK I-See (Ultimate)", "Non Analytic CCTV (Basic)", "Analytic CCTV (Basic)",
  "Outdoor PTZ (Basic)", "Thermal Outdoor (Basic)", "Non Analytic CCTV (Flex)", "Analytic CCTV (Flex)",
  "Outdoor PTZ (Flex)", "Thermal Outdoor (Flex)", "Non Analytic CCTV (Ultimate)", "Analytic CCTV (Ultimate)",
  "Outdoor PTZ (Ultimate)", "Thermal Outdoor (Ultimate)", "Biaya Installasi CCTV", "Penambahan IPv4 Publik",
  "Lain-lain", "IBBC CIR4-BW10 On-Net FTTH", "IBBC CIR4-BW15 On-Net FTTH", "IBBC CIR4-BW20 On-Net FTTH",
  "IBBC CIR4-BW25 On-Net FTTH", "IBBC CIR4-BW30 On-Net FTTH", "IBBC CIR4-BW35 On-Net FTTH",
  "IBBC CIR4-BW50 On-Net FTTH", "IBBC CIR4-BW75 On-Net FTTH", "IBBC CIR4-BW100 On-Net FTTH",
  "IBBC CIR4-BW150 On-Net FTTH", "IBBC CIR4-BW200 On-Net FTTH", "IBBC CIR4-BW500 On-Net FTTH",
  "IBBC CIR4-BW1000 On-Net FTTH", "IBBC CIR8-BW10 On-Net FTTH", "IBBC CIR8-BW15 On-Net FTTH",
  "IBBC CIR8-BW20 On-Net FTTH", "IBBC CIR8-BW25 On-Net FTTH", "IBBC CIR8-BW30 On-Net FTTH",
  "IBBC CIR8-BW35 On-Net FTTH", "IBBC CIR10-BW50 On-Net FTTH", "IBBC CIR10-BW75 On-Net FTTH",
  "IBBC CIR16-BW100 On-Net FTTH", "IBBC CIR16-BW150 On-Net FTTH", "IBBC CIR16-BW200 On-Net FTTH",
  "IBBC CIR20-BW500 On-Net FTTH", "IBBC CIR20-BW1000 On-Net FTTH", "IBBC CIR4-BW10 Off-Net non-FTTH",
  "IBBC CIR4-BW15 Off-Net non-FTTH", "IBBC CIR4-BW20 Off-Net non-FTTH", "IBBC CIR4-BW25 Off-Net non-FTTH",
  "IBBC CIR4-BW30 Off-Net non-FTTH", "IBBC CIR4-BW35 Off-Net non-FTTH", "IBBC CIR4-BW50 Off-Net non-FTTH",
  "IBBC CIR4-BW75 Off-Net non-FTTH", "IBBC CIR4-BW100 Off-Net non-FTTH", "IBBC CIR4-BW150 Off-Net non-FTTH",
  "IBBC CIR4-BW200 Off-Net non-FTTH", "IBBC CIR4-BW500 Off-Net non-FTTH", "IBBC CIR4-BW1000 Off-Net non-FTTH",
  "IBBC CIR8-BW10 Off-Net non-FTTH", "IBBC CIR8-BW15 Off-Net non-FTTH", "IBBC CIR8-BW20 Off-Net non-FTTH",
  "IBBC CIR8-BW25 Off-Net non-FTTH", "IBBC CIR8-BW30 Off-Net non-FTTH", "IBBC CIR8-BW35 Off-Net non-FTTH",
  "IBBC CIR10-BW50 Off-Net non-FTTH", "IBBC CIR10-BW75 Off-Net non-FTTH", "IBBC CIR16-BW100 Off-Net non-FTTH",
  "IBBC CIR16-BW150 Off-Net non-FTTH", "IBBC CIR16-BW200 Off-Net non-FTTH", "IBBC CIR20-BW500 Off-Net non-FTTH",
  "IBBC CIR20-BW1000 Off-Net non-FTTH", "IBBC CIR4-BW10 On-Net FTTH IP Publik", "IBBC CIR4-BW15 On-Net FTTH IP Publik",
  "IBBC CIR4-BW20 On-Net FTTH IP Publik", "IBBC CIR4-BW25 On-Net FTTH IP Publik", "IBBC CIR4-BW30 On-Net FTTH IP Publik",
  "IBBC CIR4-BW35 On-Net FTTH IP Publik", "IBBC CIR4-BW50 On-Net FTTH IP Publik", "IBBC CIR4-BW75 On-Net FTTH IP Publik",
  "IBBC CIR4-BW100 On-Net FTTH IP Publik", "IBBC CIR4-BW150 On-Net FTTH IP Publik", "IBBC CIR4-BW200 On-Net FTTH IP Publik",
  "IBBC CIR4-BW500 On-Net FTTH IP Publik", "IBBC CIR4-BW1000 On-Net FTTH IP Publik", "IBBC CIR8-BW10 On-Net FTTH IP Publik",
  "IBBC CIR8-BW15 On-Net FTTH IP Publik", "IBBC CIR8-BW20 On-Net FTTH IP Publik", "IBBC CIR8-BW25 On-Net FTTH IP Publik",
  "IBBC CIR8-BW30 On-Net FTTH IP Publik", "IBBC CIR8-BW35 On-Net FTTH IP Publik", "IBBC CIR10-BW50 On-Net FTTH IP Publik",
  "IBBC CIR10-BW75 On-Net FTTH IP Publik", "IBBC CIR16-BW100 On-Net FTTH IP Publik", "IBBC CIR16-BW150 On-Net FTTH IP Publik",
  "IBBC CIR16-BW200 On-Net FTTH IP Publik", "IBBC CIR20-BW500 On-Net FTTH IP Publik", "IBBC CIR20-BW1000 On-Net FTTH IP Publik",
  "Cloud 1corevCPU 2GB Mem Cap 50GB", "Cloud 4corevCPU 16GB Mem Cap 200GB", "Cloud 12corevCPU 96Gb Mem Cap 1TB",
];

const hjtOptions = ["Sumatra", "Jawa Bali", "Jabodetabek", "Intim"];
const satuanOptions = ["Mbps", "Units"];

const EditLayanan = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    id: null,
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
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        port: initialData.port.toString(),
        tarifAkses: initialData.tarifAkses.toString(),
        tarif: initialData.tarif.toString(), 
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      const hasChanged =
        formData.namaLayanan !== initialData.namaLayanan ||
        formData.hjt !== initialData.hjt ||
        formData.satuan !== initialData.satuan ||
        formData.backbone.toString() !== initialData.backbone.toString() ||
        formData.port.toString() !== initialData.port.toString() ||
        formData.tarifAkses.toString() !== initialData.tarifAkses.toString() ||
        formData.tarif.toString() !== initialData.tarif.toString();
      setIsDirty(hasChanged);
    }
  }, [formData, initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    onClose();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        id: initialData.id,
        port: parseInt(formData.port, 10),
        tarifAkses: parseInt(formData.tarifAkses, 10),
        tarif: parseInt(formData.tarif, 10),
      };
      setShowSuccessModal(true);
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
              <form id="form-edit-layanan" onSubmit={handleSubmit} style={{
                backgroundColor: '#E9EDF7', borderRadius: '20px', padding: '32px',
                margin: '0 auto', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                maxWidth: '600px', marginBottom: '32px'
              }}>
                {/* Select Layanan */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                  <label htmlFor="layanan" style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B' }}>
                    Layanan*
                  </label>
                  <select
                    id="layanan" name="namaLayanan" value={formData.namaLayanan} onChange={handleChange} required
                    style={{
                      padding: '12px 32px 12px 16px', borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)', fontSize: '14px',
                      backgroundColor: '#ffffff', width: '100%', appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                      backgroundSize: '16px', color: '#2D396B'
                    }}
                  >
                    <option value="">Pilih layanan</option>
                    {layananOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Select Hjt */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                  <label htmlFor="hjt" style={{ fontSize: '16px', fontWeight: '600', color: '#2D3A76' }}>
                    Hjt*
                  </label>
                  <select
                    id="hjt" name="hjt" value={formData.hjt} onChange={handleChange} required
                    style={{
                      padding: '12px 32px 12px 16px', borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)', fontSize: '14px',
                      backgroundColor: '#ffffff', width: '100%', appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                      backgroundSize: '16px', color: '#2D396B'
                    }}
                  >
                    <option value="">Pilih Hjt</option>
                    {hjtOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Select Satuan */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                  <label htmlFor="satuan" style={{ fontSize: '16px', fontWeight: '600', color: '#2D3A76' }}>
                    Satuan*
                  </label>
                  <select
                    id="satuan" name="satuan" value={formData.satuan} onChange={handleChange} required
                    style={{
                      padding: '12px 32px 12px 16px', borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)', fontSize: '14px',
                      backgroundColor: '#ffffff', width: '100%', appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                      backgroundSize: '16px', color: '#2D396B'
                    }}
                  >
                    <option value="">Pilih satuan</option>
                    {satuanOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Input Backbone */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                  <label htmlFor="backbone" style={{ fontSize: '16px', fontWeight: '600', color: '#2D3A76' }}>
                    Backbone*
                  </label>
                  <input
                    id="backbone" name="backbone" type="text" placeholder="Backbone"
                    value={formData.backbone} onChange={handleChange} required
                    style={{
                      padding: '12px 16px', borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)', fontSize: '14px',
                      backgroundColor: '#ffffff', color: '#2D396B'
                    }}
                  />
                </div>

                {/* Input Port */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                  <label htmlFor="port" style={{ fontSize: '16px', fontWeight: '600', color: '#2D3A76' }}>
                    Port*
                  </label>
                  <input
                    id="port" name="port" type="number" placeholder="Port"
                    value={formData.port} onChange={handleChange} required
                    min={0}
                    style={{
                      padding: '12px 16px', borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)', fontSize: '14px',
                      backgroundColor: '#ffffff', color: '#2D396B'
                    }}
                  />
                </div>

                {/* Input Tarif Akses */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                  <label htmlFor="tarifAkses" style={{ fontSize: '16px', fontWeight: '600', color: '#2D3A76' }}>
                    Tarif Akses*
                  </label>
                  <input
                    id="tarifAkses" name="tarifAkses" type="number" placeholder="Tarif Akses"
                    value={formData.tarifAkses} onChange={handleChange} required
                    min={0} step="0.01"
                    style={{
                      padding: '12px 16px', borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)', fontSize: '14px',
                      backgroundColor: '#ffffff', color: '#2D396B'
                    }}
                  />
                </div>

                {/* Input Tarif */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '0' }}>
                  <label htmlFor="tarif" style={{ fontSize: '16px', fontWeight: '600', color: '#2D3A76' }}>
                    Tarif*
                  </label>
                  <input
                    id="tarif" name="tarif" type="number" placeholder="Tarif"
                    value={formData.tarif} onChange={handleChange} required
                    min={0} step="0.01"
                    style={{
                      padding: '12px 16px', borderRadius: '10px',
                      border: '1px solid rgba(45, 58, 118, 0.5)', fontSize: '14px',
                      backgroundColor: '#ffffff', color: '#2D396B'
                    }}
                  />
                </div>
              </form>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', paddingRight: '65px' }}>
                <button
                  type="button" onClick={handleCancel}
                  style={{
                    backgroundColor: '#2D3A76', color: '#ffffff', border: 'none',
                    padding: '12px 32px', borderRadius: '50px', fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit" form="form-edit-layanan" disabled={!isDirty || isSubmitting}
                  style={{
                    backgroundColor: (!isDirty || isSubmitting) ? '#A0B0D5' : '#00AEEF',
                    color: '#ffffff', border: 'none', padding: '12px 32px',
                    borderRadius: '50px', fontWeight: '600',
                    cursor: (!isDirty || isSubmitting) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessModal && (
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px',
                textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                position: 'relative', width: '100%', maxWidth: '300px'
              }}
            >
              <div style={{
                backgroundColor: '#00AEEF', borderRadius: '50%', width: '60px',
                height: '60px', margin: '0 auto 16px auto', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <Check style={{ width: '30px', height: '30px', color: 'white' }} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                Selamat!
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                Data Layanan Berhasil Diperbarui
              </p>
              <button
                onClick={handleCloseSuccessModal}
                style={{
                  backgroundColor: '#00AEEF', color: 'white', border: 'none',
                  borderRadius: '6px', padding: '8px 24px', fontSize: '14px',
                  fontWeight: '500', cursor: 'pointer', minWidth: '80px',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#0088CC'; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = '#00AEEF'; }}
              >
                Oke
              </button>
              <button
                onClick={handleCloseSuccessModal}
                style={{
                  position: 'absolute', top: '0.75rem', right: '0.75rem',
                  background: 'none', border: 'none', fontSize: '1.5rem',
                  color: '#666', cursor: 'pointer', width: '30px', height: '30px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%', transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
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

export default EditLayanan;
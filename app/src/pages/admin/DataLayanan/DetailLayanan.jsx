import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailLayanan = ({ isOpen, onClose, initialData }) => {
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

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  const formatCurrency = (value) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numericValue) && numericValue !== null) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(numericValue);
    }
    return value;
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
                Detail Layanan
              </h2>
            </div>

            {/* Read-Only Form */}
            <div style={{
              backgroundColor: '#E9EDF7', borderRadius: '20px', padding: '32px',
              margin: '0 auto', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              maxWidth: '600px', marginBottom: '32px'
            }}>
              {/* Field: Nama Layanan */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B' }}>
                  Layanan
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#e0e7f9', color: '#2D396B', fontWeight: '500', border: '1px solid #2D3A76' }}>
                  {formData.namaLayanan}
                </div>
              </div>

              {/* Field: HJT */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B' }}>
                  HJT
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#e0e7f9', color: '#2D396B', fontWeight: '500', border: '1px solid #2D3A76' }}>
                  {formData.hjt}
                </div>
              </div>

              {/* Field: Satuan */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B' }}>
                  Satuan
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#e0e7f9', color: '#2D396B', fontWeight: '500', border: '1px solid #2D3A76' }}>
                  {formData.satuan}
                </div>
              </div>

              {/* Field: Backbone */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B' }}>
                  Backbone
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#e0e7f9', color: '#2D396B', fontWeight: '500', border: '1px solid #2D3A76' }}>
                  {formData.backbone}
                </div>
              </div>

              {/* Field: Port */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B' }}>
                  Port
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#e0e7f9', color: '#2D396B', fontWeight: '500', border: '1px solid #2D3A76' }}>
                  {formData.port}
                </div>
              </div>

              {/* Field: Tarif Akses */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B' }}>
                  Tarif Akses
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#e0e7f9', color: '#2D396B', fontWeight: '500', border: '1px solid #2D3A76' }}>
                  {formatCurrency(formData.tarifAkses)}
                </div>
              </div>

              {/* Field: Tarif */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2D396B' }}>
                  Tarif
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#e0e7f9', color: '#2D396B', fontWeight: '500', border: '1px solid #2D3A76' }}>
                  {formatCurrency(formData.tarif)}
                </div>
              </div>
            </div>

            {/* Tombol Tutup */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end',
              paddingRight: '65px'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: '#2D3A76', color: '#ffffff',
                  border: 'none', padding: '12px 32px', borderRadius: '50px',
                  fontWeight: '600', cursor: 'pointer'
                }}
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailLayanan;
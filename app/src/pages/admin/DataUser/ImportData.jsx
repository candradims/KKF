import React, { useState } from 'react';
import { Upload, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ImportData = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel' ||
        selectedFile.type === 'text/csv'
      ) {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Format file tidak didukung. Harap pilih file .xlsx, .xls, atau .csv.');
      }
    } else {
      setFile(null);
      setError('');
    }
  };

  const handleImportClick = async () => {
    if (file) {
      setIsLoading(true);
      setError('');
      try {
        await onImport(file);
        setFile(null);
        setShowSuccessModal(true);
      } catch (e) {
        setError('Terjadi kesalahan saat mengimpor data.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Harap pilih file terlebih dahulu.');
    }
  };

  const handleCloseModal = () => {
    setFile(null);
    setIsLoading(false);
    setError('');
    onClose();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Main Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#666',
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>

              {/* Title */}
              <h2 style={{
                fontSize: '26px',
                fontWeight: '800',
                color: '#2D3A76',
                textAlign: 'center',
                marginBottom: '50px',
                width: '100%'
              }}>
                Import Data Pengguna
              </h2>

              {/* File Input */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '550',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Pilih File Excel/CSV
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '24px',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <Upload style={{
                      width: '32px',
                      height: '32px',
                      color: '#9ca3af',
                      marginBottom: '8px'
                    }} />
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      {file ? file.name : 'Tarik & letakkan file atau klik di sini'}
                    </p>
                  </div>
                </div>
                {error && (
                  <p style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '8px'
                  }}>
                    {error}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  onClick={handleCloseModal}
                  style={{
                    backgroundColor: '#2D3A76',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '50px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={handleImportClick}
                  disabled={!file || isLoading}
                  style={{
                    backgroundColor: '#00AEEF',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '50px',
                    fontWeight: '600',
                    cursor: !file || isLoading ? 'not-allowed' : 'pointer',
                    opacity: !file || isLoading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Mengimpor...
                    </>
                  ) : (
                    <>
                      <Upload style={{ width: '16px', height: '16px' }} />
                      Import
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Success Modal */}
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
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001,
                padding: '20px',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '39px',
                  textAlign: 'center',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '500px'
                }}
              >
                <div style={{
                  backgroundColor: '#00AEEF',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 1rem auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={46} strokeWidth={3} color="#fff" />
                </div>
                <h3 style={{
                  color: '#2D396B',
                  fontSize: '26px',
                  fontWeight: '800',
                  marginBottom: '0.5rem'
                }}>
                  Selamat!
                </h3>
                <p style={{
                  color: '#2D396B',
                  marginBottom: '1.5rem',
                  fontSize: '23px',
                  fontWeight: '525'
                }}>
                  Data User Berhasil Disimpan
                </p>
                <button
                  onClick={handleCloseSuccessModal}
                  style={{
                    backgroundColor: '#00AEEF',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.75rem 3rem',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Oke
                </button>
                <button
                  onClick={handleCloseSuccessModal}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#666',
                    cursor: 'pointer',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default ImportData;

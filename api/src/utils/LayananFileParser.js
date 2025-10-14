export class LayananFileParser {
  static parseNumber(value) {
    if (value === null || value === undefined || value === '') return 0;
    const numValue = Number(String(value).replace(/[^\d.]/g, ''));
    return isNaN(numValue) ? 0 : numValue;
  }

  static validateLayananData(layananData) {
    const errors = [];
    
    if (!layananData.nama_layanan || layananData.nama_layanan.trim() === '') {
      errors.push('Nama layanan wajib diisi');
    }
    
    if (!layananData.jenis_layanan || layananData.jenis_layanan.trim() === '') {
      errors.push('Jenis layanan wajib diisi');
    }
    
    if (!layananData.wilayah_hjt || layananData.wilayah_hjt.trim() === '') {
      errors.push('Wilayah HJT wajib diisi');
    }
    
    if (!layananData.satuan || layananData.satuan.trim() === '') {
      errors.push('Satuan wajib diisi');
    }
    
    // Validasi angka
    const numericFields = ['backbone', 'port', 'tarif_akses', 'tarif'];
    numericFields.forEach(field => {
      if (layananData[field] && isNaN(this.parseNumber(layananData[field]))) {
        errors.push(`${field} harus berupa angka`);
      }
    });
    
    return errors;
  }
}
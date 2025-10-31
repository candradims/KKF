export class ServiceFileParser {
  static parseNumber(value) {
    if (value === null || value === undefined || value === "") return 0;
    const numValue = Number(String(value).replace(/[^\d.]/g, ""));
    return isNaN(numValue) ? 0 : numValue;
  }

  static parsePemasangan(value) {
    if (value === null || value === undefined || value === "") return "";
    
    const stringValue = String(value).trim();
    
    const normalizedValues = {
      'ftth': 'FTTH',
      'fiber to the home': 'FTTH',
      'fiber': 'FTTH',
      'konvensional': 'Konvensional',
      'conventional': 'Konvensional',
      'tradisional': 'Konvensional',
      'standard': 'Konvensional',
      'wireless': 'Wireless',
      'nirkabel': 'Wireless',
      'radio': 'Wireless',
      'coaxial': 'Coaxial',
      'hybrid': 'Hybrid'
    };
    
    const lowerValue = stringValue.toLowerCase();
    return normalizedValues[lowerValue] || stringValue;
  }
  static validateServiceData(serviceData) {
    const errors = [];

    // Validasi service wajib diisi
    if (!serviceData.service || serviceData.service.trim() === "") {
      errors.push("Service wajib diisi");
    }

    // Validasi satuan wajib diisi
    if (!serviceData.satuan || serviceData.satuan.trim() === "") {
      errors.push("Satuan wajib diisi");
    }

    // Validasi harga_satuan wajib diisi dan harus angka positif
    if (!serviceData.harga_satuan && serviceData.harga_satuan !== 0) {
      errors.push("Harga satuan wajib diisi");
    } else if (serviceData.harga_satuan && isNaN(this.parseNumber(serviceData.harga_satuan))) {
      errors.push("Harga satuan harus berupa angka");
    } else if (serviceData.harga_satuan && this.parseNumber(serviceData.harga_satuan) <= 0) {
      errors.push("Harga satuan harus lebih dari 0");
    }

    // Validasi pemasangan opsional, bisa string bebas
    if (serviceData.pemasangan && serviceData.pemasangan.trim() !== "") {
      // Cek panjang maksimal
      if (serviceData.pemasangan.length > 50) {
        errors.push("Pemasangan maksimal 50 karakter");
      }
    }

    return errors;
  }

  static parseRowData(rowData) {
    const rowLower = {};
    
    // Convert all keys to lowercase for case-insensitive matching
    Object.keys(rowData).forEach(key => {
      rowLower[key.toLowerCase()] = rowData[key];
    });

    const parsedData = {
      service: 
        rowData.service || 
        rowLower.service ||
        rowData['Service'] || rowData['service'] ||
        rowData.nama_service || rowLower.nama_service ||
        rowData['Nama Service'] || rowData['nama service'] || '',

      satuan:
        rowData.satuan ||
        rowLower.satuan ||
        rowData['Satuan'] || rowData['satuan'] ||
        rowData.unit || rowLower.unit || '',

      harga_satuan: this.parseNumber(
        rowData.harga_satuan ||
        rowLower.harga_satuan ||
        rowData['Harga Satuan'] || rowData['harga satuan'] ||
        rowData.harga || rowLower.harga ||
        rowData.price || rowLower.price ||
        rowData.tarif || rowLower.tarif
      ),

      pemasangan: this.parsePemasangan(
        rowData.pemasangan ||
        rowLower.pemasangan ||
        rowData['Pemasangan'] || rowData['pemasangan'] ||
        rowData.tipe || rowLower.tipe ||
        rowData.type || rowLower.type ||
        rowData.jenis || rowLower.jenis ||
        rowData.kategori || rowLower.kategori ||
        rowData.teknologi || rowLower.teknologi ||
        rowData.metode || rowLower.metode
      )
    };

    return parsedData;
  }

  static parseAndValidateRows(rows) {
    const validData = [];
    const invalidData = [];

    rows.forEach((row, index) => {
      try {
        // Parse row data
        const parsedRow = this.parseRowData(row);
        
        // Validate parsed data
        const errors = this.validateServiceData(parsedRow);
        
        if (errors.length === 0) {
          validData.push(parsedRow);
        } else {
          invalidData.push({
            rowIndex: index + 1,
            rawData: row,
            parsedData: parsedRow,
            errors: errors
          });
        }
      } catch (error) {
        invalidData.push({
          rowIndex: index + 1,
          rawData: row,
          errors: [`Error parsing row: ${error.message}`]
        });
      }
    });

    return {
      valid: validData,
      invalid: invalidData,
      totalRows: rows.length,
      validCount: validData.length,
      invalidCount: invalidData.length,
      success: validData.length > 0
    };
  }

  static generateTemplateData() {
    return [
      {
        'service': 'Pemasangan Fiber Optic',
        'satuan': 'Meter',
        'harga_satuan': 150000,
        'pemasangan': 'FTTH'
      },
      {
        'service': 'Pemasangan Kabel Tembaga',
        'satuan': 'Meter',
        'harga_satuan': 80000,
        'pemasangan': 'Konvensional'
      },
      {
        'service': 'Instalasi Access Point',
        'satuan': 'Unit',
        'harga_satuan': 300000,
        'pemasangan': 'Wireless'
      },
      {
        'service': 'Pemasangan Kabel Coaxial',
        'satuan': 'Meter',
        'harga_satuan': 120000,
        'pemasangan': 'Coaxial'
      },
      {
        'service': 'Instalasi Hybrid Router',
        'satuan': 'Unit',
        'harga_satuan': 450000,
        'pemasangan': 'Hybrid'
      },
      {
        'service': 'Pemasangan Kabel UTP',
        'satuan': 'Meter',
        'harga_satuan': 50000,
        'pemasangan': 'LAN'
      },
      {
        'service': 'Instalasi Satellite Dish',
        'satuan': 'Unit',
        'harga_satuan': 850000,
        'pemasangan': 'Satellite'
      },
      {
        'service': 'Pemasangan Kabel FO Dome',
        'satuan': 'Meter',
        'harga_satuan': 95000,
        'pemasangan': 'FTTH Dome'
      }
    ];
  }

  static getFieldMappings() {
    return {
      service: ['service', 'Service', 'nama_service', 'nama service', 'Nama Service', 'layanan', 'Layanan'],
      satuan: ['satuan', 'Satuan', 'unit', 'Unit'],
      harga_satuan: [
        'harga_satuan', 'harga satuan', 'Harga Satuan', 
        'harga', 'Harga', 'price', 'Price', 
        'tarif', 'Tarif', 'biaya', 'Biaya'
      ],
      pemasangan: [
        'pemasangan', 'Pemasangan', 
        'tipe', 'Tipe', 'type', 'Type', 
        'jenis', 'Jenis', 'kategori', 'Kategori',
        'teknologi', 'Teknologi', 'metode', 'Metode',
        'jaringan', 'Jaringan'
      ]
    };
  }


  static normalizeData(data) {
    return data.map(item => ({
      service: item.service ? item.service.trim() : '',
      satuan: item.satuan ? item.satuan.trim() : '',
      harga_satuan: this.parseNumber(item.harga_satuan),
      pemasangan: this.parsePemasangan(item.pemasangan)
    }));
  }


  static getValidationRules() {
    return {
      service: { 
        required: true, 
        type: 'string', 
        maxLength: 255,
        pattern: null
      },
      satuan: { 
        required: true, 
        type: 'string', 
        maxLength: 50,
        pattern: null
      },
      harga_satuan: { 
        required: true, 
        type: 'number', 
        min: 1,
        pattern: /^[0-9]+$/
      },
      pemasangan: { 
        required: false, 
        type: 'string', 
        maxLength: 50,
        pattern: null
      }
    };
  }


  static getUniquePemasanganValues(services) {
    const values = services
      .map(service => service.pemasangan)
      .filter(value => value && value.trim() !== '');
    
    return [...new Set(values)].sort();
  }


  static categorizeByPemasangan(services) {
    const categories = {};
    const uniqueTypes = this.getUniquePemasanganValues(services);

    // Initialize categories
    uniqueTypes.forEach(type => {
      categories[type] = [];
    });

    // Add uncategorized services
    categories['Lainnya'] = [];

    // Categorize services
    services.forEach(service => {
      if (service.pemasangan && service.pemasangan.trim() !== '') {
        if (categories[service.pemasangan]) {
          categories[service.pemasangan].push(service);
        } else {
          categories[service.pemasangan] = [service];
        }
      } else {
        categories['Lainnya'].push(service);
      }
    });

    return categories;
  }

  static getByPemasanganType(services, type) {
    return services.filter(service => service.pemasangan === type);
  }

  static getWithoutPemasangan(services) {
    return services.filter(service => !service.pemasangan || service.pemasangan === '');
  }


  static getCommonPemasanganValues() {
    return [
      'FTTH',
      'Konvensional', 
      'Wireless',
      'Coaxial',
      'Hybrid',
      'LAN',
      'Satellite',
      'FTTH Dome',
      'Fiber Optic',
      'ADSL',
      'VDSL',
      '5G'
    ];
  }

  static getCommonUnits() {
    return [
      'Meter',
      'Unit',
      'Paket',
      'Buah',
      'Set',
      'Point',
      'Port',
      'Hour',
      'Day',
      'Month'
    ];
  }

  static validateFileStructure(headers) {
    const headerLower = headers.map(h => h.toLowerCase());
    const requiredFields = ['service', 'satuan', 'harga_satuan'];
    const optionalFields = ['pemasangan'];
    const missingFields = [];
    const foundFields = [];
    const foundOptionalFields = [];

    // Check required fields
    requiredFields.forEach(field => {
      const fieldVariations = this.getFieldMappings()[field];
      const found = fieldVariations.some(variation => 
        headerLower.includes(variation.toLowerCase())
      );
      
      if (!found) {
        missingFields.push(field);
      } else {
        foundFields.push(field);
      }
    });

    // Check optional fields
    optionalFields.forEach(field => {
      const fieldVariations = this.getFieldMappings()[field];
      const found = fieldVariations.some(variation => 
        headerLower.includes(variation.toLowerCase())
      );
      
      if (found) {
        foundOptionalFields.push(field);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields: missingFields,
      foundFields: foundFields,
      foundOptionalFields: foundOptionalFields,
      suggestions: missingFields.map(field => 
        `Gunakan salah satu: ${this.getFieldMappings()[field].join(', ')}`
      )
    };
  }

  static calculateStatistics(services) {
    const uniquePemasangan = this.getUniquePemasanganValues(services);
    const tanpaPemasangan = this.getWithoutPemasangan(services);
    
    const totalHarga = services.reduce((sum, service) => sum + service.harga_satuan, 0);
    
    // Calculate stats by pemasangan type
    const statsByType = {};
    uniquePemasangan.forEach(type => {
      const typeServices = this.getByPemasanganType(services, type);
      const totalHargaType = typeServices.reduce((sum, service) => sum + service.harga_satuan, 0);
      
      statsByType[type] = {
        count: typeServices.length,
        totalHarga: totalHargaType,
        averagePrice: typeServices.length > 0 ? Math.round(totalHargaType / typeServices.length) : 0
      };
    });
    
    return {
      totalServices: services.length,
      uniquePemasanganTypes: uniquePemasangan.length,
      tanpaPemasangan: tanpaPemasangan.length,
      totalHarga: totalHarga,
      averagePrice: services.length > 0 ? Math.round(totalHarga / services.length) : 0,
      minPrice: services.length > 0 ? Math.min(...services.map(service => service.harga_satuan)) : 0,
      maxPrice: services.length > 0 ? Math.max(...services.map(service => service.harga_satuan)) : 0,
      uniqueUnits: [...new Set(services.map(service => service.satuan))].length,
      byPemasanganType: statsByType
    };
  }

  static formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }

  static generateImportReport(result) {
    const stats = this.calculateStatistics(result.valid);
    const categories = this.categorizeByPemasangan(result.valid);
    const uniquePemasangan = this.getUniquePemasanganValues(result.valid);
    
    return {
      summary: {
        totalRows: result.totalRows,
        valid: result.validCount,
        invalid: result.invalidCount,
        successRate: result.totalRows > 0 ? Math.round((result.validCount / result.totalRows) * 100) : 0
      },
      statistics: stats,
      categories: {
        types: uniquePemasangan,
        counts: Object.keys(categories).reduce((acc, key) => {
          acc[key] = categories[key].length;
          return acc;
        }, {})
      },
      errors: result.invalid.map(item => ({
        row: item.rowIndex,
        errors: item.errors
      }))
    };
  }
}

export default ServiceFileParser;
import * as XLSX from 'xlsx';
import csv from 'csv-parser';
import stream from 'stream';

export class FileParser {
  static async parseFile(file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      return await this.parseCSV(file);
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      return await this.parseExcel(file);
    } else {
      throw new Error('Format file tidak didukung');
    }
  }

  static async parseExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const mappedData = jsonData.map(row => {
            const mappedRow = {};
            
            mappedRow.nama_user = row.nama_user || row.nama || row.name || row.Nama || '';
            mappedRow.email_user = row.email_user || row.email || row.Email || '';
            mappedRow.kata_sandi = row.kata_sandi || row.password || row.kata_sandi || 'default123';
            mappedRow.role_user = row.role_user || row.role || row.Role || '';
            mappedRow.target_nr = row.target_nr || row.target || row.target_nr || null;
            
            return mappedRow;
          });

          resolve(mappedData);
        } catch (error) {
          reject(new Error('Gagal memparsing file Excel: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsArrayBuffer(file);
    });
  }

  static async parseCSV(file) {
    return new Promise((resolve, reject) => {
      const results = [];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvText = e.target.result;
          const lines = csvText.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
              // Map CSV headers to database columns
              switch(header) {
                case 'nama':
                case 'name':
                case 'nama_user':
                  row.nama_user = values[index] || '';
                  break;
                case 'email':
                case 'email_user':
                  row.email_user = values[index] || '';
                  break;
                case 'password':
                case 'kata_sandi':
                  row.kata_sandi = values[index] || 'default123';
                  break;
                case 'role':
                case 'role_user':
                  row.role_user = values[index] || '';
                  break;
                case 'target':
                case 'target_nr':
                  row.target_nr = values[index] ? parseInt(values[index]) : null;
                  break;
                default:
                  row[header] = values[index];
              }
            });
            
            results.push(row);
          }
          
          resolve(results);
        } catch (error) {
          reject(new Error('Gagal memparsing file CSV: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsText(file);
    });
  }

  static validateUserData(userData) {
    const errors = [];
    
    if (!userData.nama_user || userData.nama_user.trim() === '') {
      errors.push('Nama user wajib diisi');
    }
    
    if (!userData.email_user || userData.email_user.trim() === '') {
      errors.push('Email user wajib diisi');
    } else if (!this.isValidEmail(userData.email_user)) {
      errors.push('Format email tidak valid');
    }
    
    if (!userData.role_user || userData.role_user.trim() === '') {
      errors.push('Role user wajib diisi');
    } else if (!['superAdmin', 'admin', 'sales'].includes(userData.role_user)) {
      errors.push('Role harus superAdmin, admin, atau sales');
    }
    
    if (!userData.kata_sandi || userData.kata_sandi.trim() === '') {
      userData.kata_sandi = 'default123';
    }
    
    if (userData.role_user === 'sales' && userData.target_nr) {
      const targetNr = parseInt(userData.target_nr);
      if (isNaN(targetNr) || targetNr < 0) {
        errors.push('Target NR harus berupa angka positif');
      }
    }
    
    return errors;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
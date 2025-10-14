import { LayananModel } from "../models/LayananModel.js";

export class LayananController {
  // Ambil semua layanan
  static async getAllLayanan(req, res) {
    try {
      const layanan = await LayananModel.getAllLayanan();

      res.status(200).json({
        success: true,
        message: "Data layanan berhasil diambil",
        data: layanan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data layanan",
        error: error.message,
      });
    }
  }

  // Ambil layanan berdasarkan ID
  static async getLayananById(req, res) {
    try {
      const { id } = req.params;
      const layanan = await LayananModel.getLayananById(id);

      if (!layanan) {
        return res.status(404).json({
          success: false,
          message: "Layanan tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Data layanan berhasil diambil",
        data: layanan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data layanan",
        error: error.message,
      });
    }
  }

  // Buat layanan baru (Khusus Admin)
  static async createLayanan(req, res) {
    try {
      const {
        nama_layanan,
        jenis_layanan,
        wilayah_hjt,
        satuan,
        backbone,
        port,
        tarif_akses,
        tarif,
      } = req.body;

      if (!nama_layanan || !jenis_layanan || !wilayah_hjt || !satuan) {
        return res.status(400).json({
          success: false,
          message:
            "Nama layanan, jenis layanan, wilayah, dan satuan wajib diisi",
        });
      }

      const newLayanan = await LayananModel.createLayanan({
        nama_layanan,
        jenis_layanan,
        wilayah_hjt,
        satuan,
        backbone: backbone || 0.0,
        port: port || 0.0,
        tarif_akses: tarif_akses || 0.0,
        tarif: tarif || 0.0,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal membuat layanan",
        error: error.message,
      });
    }
  }

  // Perbarui layanan (Khusus Admin)
  static async updateLayanan(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedLayanan = await LayananModel.updateLayanan(id, updateData);

      if (!updatedLayanan || updatedLayanan.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Layanan tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Data layanan berhasil diperbarui",
        data: updatedLayanan[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui data layanan",
        error: error.message,
      });
    }
  }

  // Hapus layanan (Khusus Admin)
  static async deleteLayanan(req, res) {
    try {
      const { id } = req.params;

      const deletedLayanan = await LayananModel.deleteLayanan(id);

      if (!deletedLayanan || deletedLayanan.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Layanan tidak ditemukan",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghapus layanan",
        error: error.message,
      });
    }
  }

  // Ambil layanan berdasarkan wilayah
  static async getLayananByWilayah(req, res) {
    try {
      const { wilayah } = req.params;
      const layanan = await LayananModel.getLayananByWilayah(wilayah);

      res.status(200).json({
        success: true,
        message: `Data layanan wilayah ${wilayah} berhasil diambil`,
        data: layanan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data layanan berdasarkan wilayah",
        error: error.message,
      });
    }
  }

  static async importLayanan(req, res) {
      try {
        console.log("📨 Received import layanan request");
        
        const { layanan } = req.body;

        // Validasi input
        if (!layanan || !Array.isArray(layanan) || layanan.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Data layanan harus berupa array dan tidak boleh kosong",
          });
        }

        const results = {
          success: [],
          failed: []
        };

        // Process each layanan
        for (const layananData of layanan) {
          try {
            const {
              nama_layanan,
              jenis_layanan,
              wilayah_hjt,
              satuan,
              backbone,
              port,
              tarif_akses,
              tarif,
            } = layananData;

            // Validasi field wajib
            if (!nama_layanan || !jenis_layanan || !wilayah_hjt || !satuan) {
              results.failed.push({
                layanan: layananData,
                error: "Nama layanan, jenis layanan, wilayah, dan satuan wajib diisi"
              });
              continue;
            }

            const existingLayanan = await LayananModel.getLayananByNameAndDetail(
              nama_layanan,
              jenis_layanan,
              wilayah_hjt
            );

            if (existingLayanan) {
              results.failed.push({
                layanan: layananData,
                error: "Layanan dengan nama, jenis, dan wilayah yang sama sudah ada"
              });
              continue;
            }

            // Buat layanan baru
            const newLayanan = await LayananModel.createLayanan({
              nama_layanan,
              jenis_layanan,
              wilayah_hjt,
              satuan,
              backbone: backbone || 0,
              port: port || 0,
              tarif_akses: tarif_akses || 0,
              tarif: tarif || 0,
            });

            if (!newLayanan || newLayanan.length === 0) {
              throw new Error("Tidak ada data yang dikembalikan dari database");
            }

            results.success.push(newLayanan[0]);
            
            console.log(`✅ Layanan imported successfully: ${nama_layanan}`);

          } catch (error) {
            console.error(`❌ Error importing layanan:`, error);
            results.failed.push({
              layanan: layananData,
              error: error.message
            });
          }
        }

        const response = {
          success: true,
          message: `Import selesai. Berhasil: ${results.success.length}, Gagal: ${results.failed.length}`,
          data: {
            success: results.success,
            failed: results.failed
          }
        };

        if (results.success.length === 0 && results.failed.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Semua data gagal diimport",
            data: response.data
          });
        }

        res.status(201).json(response);

      } catch (error) {
        console.error("❌ Error in importLayanan:", error);
        res.status(500).json({
          success: false,
          message: "Gagal mengimpor data layanan",
          error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
      }
    }
}
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
        wilayah_hjt,
        satuan,
        backbone,
        port,
        tarif_akses,
        tarif,
      } = req.body;

      if (!nama_layanan || !wilayah_hjt || !satuan) {
        return res.status(400).json({
          success: false,
          message: "Nama layanan, wilayah, dan satuan wajib diisi",
        });
      }

      const newLayanan = await LayananModel.createLayanan({
        nama_layanan,
        wilayah_hjt,
        satuan,
        backbone: backbone || 0.0,
        port: port || 0.0,
        tarif_akses: tarif_akses || 0.0,
        tarif: tarif || 0.0,
      });

      res.status(201).json({
        success: true,
        message: "Layanan berhasil dibuat",
        data: newLayanan[0],
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

      res.status(200).json({
        success: true,
        message: "Layanan berhasil dihapus",
      });
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
}

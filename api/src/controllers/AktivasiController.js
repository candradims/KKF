import { AktivasiModel } from "../models/AktivasiModel.js";
import { supabase } from "../config/database.js";

export class AktivasiController {
  // Ambil semua master aktivasi
  static async getAllAktivasi(req, res) {
    try {
      const items = await AktivasiModel.getAllMasterAktivasi();
      res
        .status(200)
        .json({
          success: true,
          message: "Data master aktivasi berhasil diambil",
          data: items,
        });
    } catch (error) {
      console.error("❌ Error in getAllAktivasi:", error);
      // Provide more diagnostic info in development
      if (process.env.NODE_ENV === "development") {
        return res.status(500).json({
          success: false,
          message: "Gagal mengambil data master aktivasi",
          error: error && error.message ? error.message : String(error),
          stack: error && error.stack ? error.stack : null,
        });
      }
      return res
        .status(500)
        .json({
          success: false,
          message: "Gagal mengambil data master aktivasi",
        });
    }
  }

  // Debug route to return raw supabase response (development only)
  static async getRawAktivasi(req, res) {
    if (process.env.NODE_ENV !== "development") {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    try {
      const resp = await supabase.from("master_aktivasi").select("*");
      return res.status(200).json({ success: true, raw: resp });
    } catch (error) {
      console.error("❌ Error in getRawAktivasi:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Error running raw query",
          error: error.message,
        });
    }
  }

  static async getAktivasiById(req, res) {
    try {
      const { id } = req.params;
      const item = await AktivasiModel.getMasterAktivasiById(id);
      if (!item)
        return res
          .status(404)
          .json({ success: false, message: "Data tidak ditemukan" });
      res
        .status(200)
        .json({ success: true, message: "Data berhasil diambil", data: item });
    } catch (error) {
      console.error("❌ Error in getAktivasiById:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Gagal mengambil data",
          error: error.message,
        });
    }
  }

  static async createAktivasi(req, res) {
    try {
      const { service, satuan, harga_satuan, pemasangan } = req.body;
      if (!service || !satuan) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Field service dan satuan wajib diisi",
          });
      }

      const created = await AktivasiModel.createMasterAktivasi({
        service,
        satuan,
        harga_satuan,
        pemasangan,
      });
      res
        .status(201)
        .json({
          success: true,
          message: "Master aktivasi berhasil dibuat",
          data: created[0] || created,
        });
    } catch (error) {
      console.error("❌ Error in createAktivasi:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Gagal membuat data",
          error: error.message,
        });
    }
  }

  static async updateAktivasi(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const updated = await AktivasiModel.updateMasterAktivasi(id, payload);
      if (!updated || updated.length === 0)
        return res
          .status(404)
          .json({
            success: false,
            message: "Data tidak ditemukan atau tidak ada perubahan",
          });
      res
        .status(200)
        .json({
          success: true,
          message: "Data berhasil diperbarui",
          data: updated[0] || updated,
        });
    } catch (error) {
      console.error("❌ Error in updateAktivasi:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Gagal memperbarui data",
          error: error.message,
        });
    }
  }

  static async deleteAktivasi(req, res) {
    try {
      const { id } = req.params;
      const deleted = await AktivasiModel.deleteMasterAktivasi(id);
      if (!deleted || deleted.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "Data tidak ditemukan" });
      res
        .status(200)
        .json({
          success: true,
          message: "Data berhasil dihapus",
          data: deleted[0] || deleted,
        });
    } catch (error) {
      console.error("❌ Error in deleteAktivasi:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Gagal menghapus data",
          error: error.message,
        });
    }
  }

  static async importAktivasi(req, res) {
    try {
      console.log("📨 Received import master_aktivasi request");
      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Items harus berupa array dan tidak boleh kosong",
          });
      }

      const imported = await AktivasiModel.importMasterAktivasi(items);
      res
        .status(201)
        .json({ success: true, message: "Import selesai", data: imported });
    } catch (error) {
      console.error("❌ Error in importAktivasi:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Gagal mengimpor data",
          error: error.message,
        });
    }
  }
}

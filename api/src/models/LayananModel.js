import { db, supabase } from "../config/database.js";

export class LayananModel {
  // Ambil semua layanan
  static async getAllLayanan() {
    try {
      const { data, error } = await db.select("data_layanan");
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data layanan: ${error.message}`);
    }
  }

  // Ambil layanan berdasarkan ID
  static async getLayananById(id) {
    try {
      const { data, error } = await db.findOne("data_layanan", {
        id_layanan: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data layanan: ${error.message}`);
    }
  }

  // Buat layanan baru
  static async createLayanan(layananData) {
    try {
      const { data, error } = await db.insert("data_layanan", {
        nama_layanan: layananData.nama_layanan,
        wilayah_hjt: layananData.wilayah_hjt,
        satuan: layananData.satuan,
        backbone: layananData.backbone || 0.0,
        port: layananData.port || 0.0,
        tarif_akses: layananData.tarif_akses || 0.0,
        tarif: layananData.tarif || 0.0,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal membuat layanan baru: ${error.message}`);
    }
  }

  // Perbarui layanan
  static async updateLayanan(id, layananData) {
    try {
      const { data, error } = await db.update("data_layanan", layananData, {
        id_layanan: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal memperbarui layanan: ${error.message}`);
    }
  }

  // Hapus layanan
  static async deleteLayanan(id) {
    try {
      const { data, error } = await db.delete("data_layanan", {
        id_layanan: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal menghapus layanan: ${error.message}`);
    }
  }

  // Ambil layanan berdasarkan wilayah
  static async getLayananByWilayah(wilayah) {
    try {
      const { data, error } = await supabase
        .from("data_layanan")
        .select("*")
        .eq("wilayah_hjt", wilayah);
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil layanan berdasarkan wilayah: ${error.message}`
      );
    }
  }
}

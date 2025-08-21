import { db, supabase } from "../config/database.js";

export class PenawaranLayananModel {
  // Ambil semua layanan penawaran
  static async getAllPenawaranLayanan() {
    try {
      const { data, error } = await db.select("data_penawaran_layanan");
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil data layanan penawaran: ${error.message}`
      );
    }
  }

  // Ambil layanan penawaran berdasarkan ID penawaran
  static async getPenawaranLayananByPenawaranId(idPenawaran) {
    try {
      const { data, error } = await supabase
        .from("data_penawaran_layanan")
        .select("*")
        .eq("id_penawaran", idPenawaran);
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil data layanan penawaran: ${error.message}`
      );
    }
  }

  // Buat layanan penawaran baru
  static async createPenawaranLayanan(penawaranLayananData) {
    try {
      const { data, error } = await db.insert("data_penawaran_layanan", {
        id_penawaran: penawaranLayananData.id_penawaran,
        id_layanan: penawaranLayananData.id_layanan,
        keterangan: penawaranLayananData.keterangan,
        kapasitas: penawaranLayananData.kapasitas,
        qty: penawaranLayananData.qty,
        akses_existing: penawaranLayananData.akses_existing,
        harga_final_sebelum_ppn: penawaranLayananData.harga_final_sebelum_ppn,
        satuan: penawaranLayananData.satuan,
        backbone: penawaranLayananData.backbone,
        port: penawaranLayananData.port,
        tarif_akses: penawaranLayananData.tarif_akses,
        tarif: penawaranLayananData.tarif,
        tarif_akses_terbaru: penawaranLayananData.tarif_akses_terbaru,
        tarif_terbaru: penawaranLayananData.tarif_terbaru,
        harga_dasar_icon: penawaranLayananData.harga_dasar_icon,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal membuat layanan penawaran baru: ${error.message}`);
    }
  }

  // Perbarui layanan penawaran
  static async updatePenawaranLayanan(id, penawaranLayananData) {
    try {
      const { data, error } = await db.update(
        "data_penawaran_layanan",
        penawaranLayananData,
        { id: id }
      );
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal memperbarui layanan penawaran: ${error.message}`);
    }
  }

  // Hapus layanan penawaran
  static async deletePenawaranLayanan(id) {
    try {
      const { data, error } = await db.delete("data_penawaran_layanan", {
        id: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal menghapus layanan penawaran: ${error.message}`);
    }
  }

  // Hapus semua layanan penawaran berdasarkan ID penawaran
  static async deletePenawaranLayananByPenawaranId(idPenawaran) {
    try {
      const { data, error } = await db.delete("data_penawaran_layanan", {
        id_penawaran: idPenawaran,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal menghapus layanan penawaran: ${error.message}`);
    }
  }

  // Buat beberapa layanan penawaran sekaligus
  static async createMultiplePenawaranLayanan(penawaranLayananArray) {
    try {
      const { data, error } = await db.insert(
        "data_penawaran_layanan",
        penawaranLayananArray
      );
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal membuat beberapa layanan penawaran: ${error.message}`
      );
    }
  }
}

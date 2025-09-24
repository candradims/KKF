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
      console.log(
        "🔧 Creating penawaran layanan with data:",
        penawaranLayananData
      );

      const dataToInsert = {
        id_penawaran: penawaranLayananData.id_penawaran,
        id_layanan: penawaranLayananData.id_layanan,
        nama_layanan: penawaranLayananData.nama_layanan, // Store nama layanan directly
        detail_layanan: penawaranLayananData.detail_layanan, // Store detail layanan
        kapasitas: penawaranLayananData.kapasitas,
        qty: penawaranLayananData.qty,
        akses_existing: penawaranLayananData.akses_existing,
        satuan: penawaranLayananData.satuan,
      };

      console.log("🔧 Data to insert:", dataToInsert);

      const { data, error } = await db.insert(
        "data_penawaran_layanan",
        dataToInsert
      );

      if (error) {
        console.error("❌ Database error:", error);
        throw error;
      }

      console.log("✅ Penawaran layanan created successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in createPenawaranLayanan:", error);
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

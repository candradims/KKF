import { db, supabase } from "../config/database.js";

export class AktivasiModel {
  // Ambil semua master aktivasi
  static async getAllMasterAktivasi() {
    try {
      const { data, error } = await supabase
        .from("master_aktivasi")
        .select("*")
        // DB column is `id_master` according to schema (use that as PK)
        .order("id_master", { ascending: true });

      if (error) {
        console.error("❌ Supabase error in getAllMasterAktivasi:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("❌ Error in getAllMasterAktivasi:", error);
      throw new Error(`Gagal mengambil data master_aktivasi: ${error.message}`);
    }
  }

  // Ambil master aktivasi berdasarkan ID
  static async getMasterAktivasiById(id) {
    try {
      const { data, error } = await supabase
        .from("master_aktivasi")
        .select("*")
        // match by id_master (int8 primary key in your DB)
        .eq("id_master", id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    } catch (error) {
      console.error("❌ Error in getMasterAktivasiById:", error);
      throw new Error(`Gagal mengambil data master_aktivasi: ${error.message}`);
    }
  }

  // Buat master aktivasi baru
  static async createMasterAktivasi(payload) {
    try {
      const insertData = {
        service: payload.service,
        satuan: payload.satuan,
        harga_satuan: payload.harga_satuan || 0,
        pemasangan: payload.pemasangan || null,
      };

      const { data, error } = await supabase
        .from("master_aktivasi")
        .insert([insertData])
        .select();

      if (error) {
        console.error("❌ Supabase error in createMasterAktivasi:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("❌ Error in createMasterAktivasi:", error);
      throw new Error(`Gagal membuat master_aktivasi: ${error.message}`);
    }
  }

  // Perbarui master aktivasi
  static async updateMasterAktivasi(id, payload) {
    try {
      const updateData = {
        service: payload.service,
        satuan: payload.satuan,
        harga_satuan: payload.harga_satuan,
        pemasangan: payload.pemasangan,
      };

      const { data, error } = await supabase
        .from("master_aktivasi")
        .update(updateData)
        // match by id_master (DB PK)
        .eq("id_master", id)
        .select();

      if (error) {
        console.error("❌ Supabase error in updateMasterAktivasi:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("❌ Error in updateMasterAktivasi:", error);
      throw new Error(`Gagal memperbarui master_aktivasi: ${error.message}`);
    }
  }

  // Hapus master aktivasi
  static async deleteMasterAktivasi(id) {
    try {
      const { data, error } = await supabase
        .from("master_aktivasi")
        .delete()
        .eq("id_master", id)
        .select();

      if (error) {
        console.error("❌ Supabase error in deleteMasterAktivasi:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("❌ Error in deleteMasterAktivasi:", error);
      throw new Error(`Gagal menghapus master_aktivasi: ${error.message}`);
    }
  }

  // Import multiple master aktivasi (array)
  static async importMasterAktivasi(items = []) {
    try {
      if (!Array.isArray(items) || items.length === 0) return [];

      const payload = items.map((it) => ({
        service: it.service,
        satuan: it.satuan,
        harga_satuan: it.harga_satuan || 0,
        pemasangan: it.pemasangan || null,
      }));

      const { data, error } = await supabase
        .from("master_aktivasi")
        .insert(payload)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("❌ Error in importMasterAktivasi:", error);
      throw new Error(`Gagal mengimpor master_aktivasi: ${error.message}`);
    }
  }
}

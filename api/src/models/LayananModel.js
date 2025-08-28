import { supabase } from "../config/database.js";

export class LayananModel {
  // Ambil semua layanan
  static async getAllLayanan() {
    try {
      console.log("🔍 Fetching all layanan from database");

      const { data, error } = await supabase
        .from("data_layanan")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Supabase error in getAllLayanan:", error);
        throw error;
      }

      console.log(
        "✅ Layanan fetched successfully:",
        data?.length || 0,
        "records"
      );
      return data || [];
    } catch (error) {
      console.error("❌ Error in getAllLayanan:", error);
      throw new Error(`Gagal mengambil data layanan: ${error.message}`);
    }
  }

  // Ambil layanan berdasarkan ID
  static async getLayananById(id) {
    try {
      console.log("🔍 Fetching layanan with ID:", id);

      const { data, error } = await supabase
        .from("data_layanan")
        .select("*")
        .eq("id_layanan", id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("❌ Supabase error in getLayananById:", error);
        throw error;
      }

      if (!data) {
        console.log("❌ Layanan not found with ID:", id);
        return null;
      }

      console.log("✅ Layanan found:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in getLayananById:", error);
      throw new Error(`Gagal mengambil data layanan: ${error.message}`);
    }
  }

  // Buat layanan baru
  static async createLayanan(layananData) {
    try {
      console.log("📝 Creating new layanan:", layananData);

      const { data, error } = await supabase
        .from("data_layanan")
        .insert({
          nama_layanan: layananData.nama_layanan,
          wilayah_hjt: layananData.wilayah_hjt,
          satuan: layananData.satuan,
          backbone: layananData.backbone || 0,
          port: layananData.port || 0,
          tarif_akses: layananData.tarif_akses || 0,
          tarif: layananData.tarif || 0,
        })
        .select();

      if (error) {
        console.error("❌ Supabase error in createLayanan:", error);
        throw error;
      }

      console.log("✅ Layanan created successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in createLayanan:", error);
      throw new Error(`Gagal membuat layanan baru: ${error.message}`);
    }
  }

  // Perbarui layanan
  static async updateLayanan(id, layananData) {
    try {
      console.log("📝 Updating layanan with ID:", id, "Data:", layananData);

      const { data, error } = await supabase
        .from("data_layanan")
        .update(layananData)
        .eq("id_layanan", id)
        .select();

      if (error) {
        console.error("❌ Supabase error in updateLayanan:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("❌ No layanan found with ID:", id);
        throw new Error("Layanan tidak ditemukan atau tidak ada perubahan");
      }

      console.log("✅ Layanan updated successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in updateLayanan:", error);
      throw new Error(`Gagal memperbarui layanan: ${error.message}`);
    }
  }

  // Hapus layanan
  static async deleteLayanan(id) {
    try {
      console.log("🗑️ Deleting layanan with ID:", id);

      const { data, error } = await supabase
        .from("data_layanan")
        .delete()
        .eq("id_layanan", id)
        .select();

      if (error) {
        console.error("❌ Supabase error in deleteLayanan:", error);
        throw error;
      }

      console.log("✅ Layanan deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in deleteLayanan:", error);
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

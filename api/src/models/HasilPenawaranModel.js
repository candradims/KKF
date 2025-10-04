import { db, supabase } from "../config/database.js";

export class HasilPenawaranModel {
  // Ambil hasil penawaran berdasarkan ID penawaran
  static async getHasilPenawaranByPenawaranId(idPenawaran) {
    try {
      console.log(
        "🔍 Checking for existing hasil_penawaran with id_penawaran:",
        idPenawaran
      );

      const { data, error } = await supabase
        .from("hasil_penawaran")
        .select("*")
        .eq("id_penawaran", idPenawaran)
        .single();

      if (error) {
        // If no data found, return null instead of throwing error
        if (error.code === "PGRST116") {
          console.log("📝 No existing hasil_penawaran found, will create new");
          return null;
        }
        throw error;
      }

      console.log("✅ Found existing hasil_penawaran:", data);
      return data;
    } catch (error) {
      // If it's a "not found" error, return null
      if (error.code === "PGRST116" || error.message.includes("not found")) {
        console.log("📝 No existing hasil_penawaran found, will create new");
        return null;
      }
      console.error("❌ Error in getHasilPenawaranByPenawaranId:", error);
      throw new Error(`Gagal mengambil hasil penawaran: ${error.message}`);
    }
  }

  // Buat atau perbarui hasil penawaran
  static async createOrUpdateHasilPenawaran(idPenawaran, hasilData) {
    try {
      console.log(
        "🔧 Creating/updating hasil_penawaran for id_penawaran:",
        idPenawaran
      );
      console.log("📊 Hasil data to save:", hasilData);

      // Cek apakah hasil sudah ada
      const { data: existing, error: checkError } = await supabase
        .from("hasil_penawaran")
        .select("*")
        .eq("id_penawaran", idPenawaran)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error(
          "❌ Error checking existing hasil_penawaran:",
          checkError
        );
        throw checkError;
      }

      if (existing) {
        // Perbarui hasil yang ada
        console.log("📝 Updating existing hasil_penawaran");
        const { data, error } = await supabase
          .from("hasil_penawaran")
          .update(hasilData)
          .eq("id_penawaran", idPenawaran)
          .select();

        if (error) {
          console.error("❌ Error updating hasil_penawaran:", error);
          throw error;
        }

        console.log("✅ Hasil penawaran updated successfully:", data);
        return data;
      } else {
        // Buat hasil baru
        console.log("📝 Creating new hasil_penawaran");
        const { data, error } = await supabase
          .from("hasil_penawaran")
          .insert({
            id_penawaran: idPenawaran,
            ...hasilData,
          })
          .select();

        if (error) {
          console.error("❌ Error creating hasil_penawaran:", error);
          throw error;
        }

        console.log("✅ Hasil penawaran created successfully:", data);
        return data;
      }
    } catch (error) {
      console.error("❌ Error in createOrUpdateHasilPenawaran:", error);
      throw new Error(
        `Gagal membuat/memperbarui hasil penawaran: ${error.message}`
      );
    }
  }

  // Hapus hasil penawaran
  static async deleteHasilPenawaran(idPenawaran) {
    try {
      const { data, error } = await db.delete("hasil_penawaran", {
        id_penawaran: idPenawaran,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal menghapus hasil penawaran: ${error.message}`);
    }
  }

  // Ambil semua hasil penawaran
  static async getAllHasilPenawaran() {
    try {
      const { data, error } = await db.select("hasil_penawaran");
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil semua hasil penawaran: ${error.message}`
      );
    }
  }
}

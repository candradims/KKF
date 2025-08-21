import { db, supabase } from "../config/database.js";

export class HasilPenawaranModel {
  // Ambil hasil penawaran berdasarkan ID penawaran
  static async getHasilPenawaranByPenawaranId(idPenawaran) {
    try {
      const { data, error } = await db.findOne("hasil_penawaran", {
        id_penawaran: idPenawaran,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil hasil penawaran: ${error.message}`);
    }
  }

  // Buat atau perbarui hasil penawaran
  static async createOrUpdateHasilPenawaran(idPenawaran, hasilData) {
    try {
      // Cek apakah hasil sudah ada
      const existing = await this.getHasilPenawaranByPenawaranId(idPenawaran);

      if (existing) {
        // Perbarui hasil yang ada
        const { data, error } = await db.update("hasil_penawaran", hasilData, {
          id_penawaran: idPenawaran,
        });
        if (error) throw error;
        return data;
      } else {
        // Buat hasil baru
        const { data, error } = await db.insert("hasil_penawaran", {
          id_penawaran: idPenawaran,
          ...hasilData,
        });
        if (error) throw error;
        return data;
      }
    } catch (error) {
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

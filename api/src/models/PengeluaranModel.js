import { db, supabase } from "../config/database.js";

export class PengeluaranModel {
  // Ambil semua pengeluaran
  static async getAllPengeluaran() {
    try {
      const { data, error } = await db.select("data_pengeluaran");
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data pengeluaran: ${error.message}`);
    }
  }

  // Ambil pengeluaran berdasarkan ID penawaran
  static async getPengeluaranByPenawaranId(idPenawaran) {
    try {
      const { data, error } = await supabase
        .from("data_pengeluaran")
        .select("*")
        .eq("id_penawaran", idPenawaran);
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data pengeluaran: ${error.message}`);
    }
  }

  // Ambil pengeluaran berdasarkan ID
  static async getPengeluaranById(id) {
    try {
      const { data, error } = await db.findOne("data_pengeluaran", {
        id_pengeluaran: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data pengeluaran: ${error.message}`);
    }
  }

  // Buat pengeluaran baru
  static async createPengeluaran(pengeluaranData) {
    try {
      const { data, error } = await db.insert("data_pengeluaran", {
        id_penawaran: pengeluaranData.id_penawaran,
        item: pengeluaranData.item,
        keterangan: pengeluaranData.keterangan,
        harga_satuan: pengeluaranData.harga_satuan,
        jumlah: pengeluaranData.jumlah,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal membuat data pengeluaran: ${error.message}`);
    }
  }

  // Perbarui pengeluaran
  static async updatePengeluaran(id, pengeluaranData) {
    try {
      const { data, error } = await db.update(
        "data_pengeluaran",
        pengeluaranData,
        { id_pengeluaran: id }
      );
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal memperbarui data pengeluaran: ${error.message}`);
    }
  }

  // Hapus pengeluaran
  static async deletePengeluaran(id) {
    try {
      const { data, error } = await db.delete("data_pengeluaran", {
        id_pengeluaran: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal menghapus data pengeluaran: ${error.message}`);
    }
  }

  // Hapus semua pengeluaran berdasarkan ID penawaran
  static async deletePengeluaranByPenawaranId(idPenawaran) {
    try {
      const { data, error } = await db.delete("data_pengeluaran", {
        id_penawaran: idPenawaran,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal menghapus data pengeluaran: ${error.message}`);
    }
  }

  // Buat banyak pengeluaran sekaligus
  static async createMultiplePengeluaran(pengeluaranArray) {
    try {
      const { data, error } = await db.insert(
        "data_pengeluaran",
        pengeluaranArray
      );
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal membuat beberapa data pengeluaran: ${error.message}`
      );
    }
  }

  // Ambil total pengeluaran berdasarkan ID penawaran
  static async getTotalPengeluaranByPenawaranId(idPenawaran) {
    try {
      const { data, error } = await supabase
        .from("data_pengeluaran")
        .select("total_harga")
        .eq("id_penawaran", idPenawaran);
      if (error) throw error;
      const total = data.reduce(
        (sum, item) => sum + (item.total_harga || 0),
        0
      );
      return total;
    } catch (error) {
      throw new Error(`Gagal menghitung total pengeluaran: ${error.message}`);
    }
  }
}

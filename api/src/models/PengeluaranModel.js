import { db, supabase } from "../config/database.js";

export class PengeluaranModel {
  // Ambil semua pengeluaran
  static async getAllPengeluaran() {
    try {
      const { data, error } = await supabase
        .from("data_pengeluaran")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Gagal mengambil data pengeluaran: ${error.message}`);
    }
  }

  // Ambil pengeluaran berdasarkan user ID
  static async getPengeluaranByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from("data_pengeluaran")
        .select("*")
        .eq("id_user", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(
        `Gagal mengambil data pengeluaran berdasarkan user: ${error.message}`
      );
    }
  }

  // Ambil pengeluaran berdasarkan ID penawaran
  static async getPengeluaranByPenawaranId(idPenawaran) {
    try {
      console.log(
        "🗄️ PengeluaranModel.getPengeluaranByPenawaranId called with ID:",
        idPenawaran
      );

      const { data, error } = await supabase
        .from("data_pengeluaran")
        .select("*")
        .eq("id_penawaran", idPenawaran);

      console.log("🗄️ Database query result:", { data, error });

      if (error) throw error;

      console.log("✅ Returning data:", data);
      return data || [];
    } catch (error) {
      console.error("❌ Error in getPengeluaranByPenawaranId:", error);
      throw new Error(`Gagal mengambil data pengeluaran: ${error.message}`);
    }
  }

  // Ambil pengeluaran berdasarkan ID
  static async getPengeluaranById(id) {
    try {
      const { data, error } = await supabase
        .from("data_pengeluaran")
        .select("*")
        .eq("id_pengeluaran", id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data pengeluaran: ${error.message}`);
    }
  }

  // Buat pengeluaran baru
  static async createPengeluaran(pengeluaranData) {
    try {
      console.log("Creating pengeluaran with data:", pengeluaranData);

      // Map frontend fields to database fields
      const dbData = {
        id_penawaran: pengeluaranData.id_penawaran,
        item: pengeluaranData.item,
        keterangan: pengeluaranData.keterangan,
        harga_satuan: pengeluaranData.harga_satuan || pengeluaranData.hasrat,
        jumlah: parseInt(pengeluaranData.jumlah),
        // total_harga is a generated column, don't insert it
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Mapped database data:", dbData);

      // Validate required fields
      if (!dbData.id_penawaran) {
        throw new Error("id_penawaran is required");
      }
      if (!dbData.item) {
        throw new Error("item is required");
      }
      if (!dbData.harga_satuan || isNaN(dbData.harga_satuan)) {
        throw new Error("harga_satuan must be a valid number");
      }
      if (!dbData.jumlah || isNaN(dbData.jumlah)) {
        throw new Error("jumlah must be a valid number");
      }

      console.log("✅ Validation passed, inserting data...");

      const { data, error } = await supabase
        .from("data_pengeluaran")
        .insert([dbData])
        .select()
        .single();

      if (error) {
        console.error("Supabase error creating pengeluaran:", error);
        throw error;
      }

      console.log("Pengeluaran created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in createPengeluaran:", error);
      throw new Error(`Gagal membuat data pengeluaran: ${error.message}`);
    }
  }

  // Perbarui pengeluaran
  static async updatePengeluaran(id, pengeluaranData) {
    try {
      console.log(
        "Updating pengeluaran with ID:",
        id,
        "Data:",
        pengeluaranData
      );

      // Map frontend fields to database fields
      const dbData = {
        item: pengeluaranData.item,
        keterangan: pengeluaranData.keterangan,
        harga_satuan: pengeluaranData.hasrat || pengeluaranData.harga_satuan,
        jumlah: parseInt(pengeluaranData.jumlah),
        // total_harga is generated column, don't update it
        updated_at: new Date().toISOString(),
      };

      console.log("Mapped database data for update:", dbData);

      const { data, error } = await supabase
        .from("data_pengeluaran")
        .update(dbData)
        .eq("id_pengeluaran", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error updating pengeluaran:", error);
        throw error;
      }

      console.log("Pengeluaran updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in updatePengeluaran:", error);
      throw new Error(`Gagal memperbarui data pengeluaran: ${error.message}`);
    }
  }

  // Hapus pengeluaran
  static async deletePengeluaran(id) {
    try {
      console.log("Deleting pengeluaran with ID:", id);

      const { data, error } = await supabase
        .from("data_pengeluaran")
        .delete()
        .eq("id_pengeluaran", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error deleting pengeluaran:", error);
        throw error;
      }

      console.log("Pengeluaran deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in deletePengeluaran:", error);
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

  // Calculate total from harga_satuan and jumlah
  static calculateTotal(hargaSatuan, jumlah) {
    try {
      const hargaNum = parseFloat(
        hargaSatuan?.toString().replace(/[^\d.-]/g, "") || 0
      );
      const jumlahNum = parseFloat(
        jumlah?.toString().replace(/[^\d.-]/g, "") || 0
      );
      return hargaNum * jumlahNum;
    } catch (error) {
      console.error("Error calculating total:", error);
      return 0;
    }
  }

  // Format number to Rupiah
  static formatRupiah(amount) {
    try {
      const number = parseFloat(amount || 0);
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(number);
    } catch (error) {
      console.error("Error formatting to Rupiah:", error);
      return "Rp 0";
    }
  }
}

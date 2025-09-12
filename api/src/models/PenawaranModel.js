import { db, supabase } from "../config/database.js";

export class PenawaranModel {
  // Ambil semua penawaran
  static async getAllPenawaran() {
    try {
      const { data, error } = await supabase
        .from("data_penawaran")
        .select(
          `
          *,
          data_user:id_user (
            nama_user,
            email_user,
            role_user
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data penawaran: ${error.message}`);
    }
  }

  // Ambil penawaran berdasarkan ID dengan detail lengkap
  static async getPenawaranById(id) {
    try {
      const { data, error } = await supabase
        .from("data_penawaran")
        .select(
          `
          *,
          data_user:id_user (
            nama_user,
            email_user,
            role_user
          ),
          data_penawaran_layanan (
            *,
            data_layanan:id_layanan (
              nama_layanan,
              wilayah_hjt,
              satuan
            )
          ),
          data_pengeluaran (*),
          hasil_penawaran (*)
        `
        )
        .eq("id_penawaran", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data penawaran: ${error.message}`);
    }
  }

  // Buat penawaran baru
  static async createPenawaran(penawaranData) {
    try {
      console.log("📝 Creating penawaran with data:", penawaranData);

      // Validate required fields
      if (!penawaranData.id_user) {
        throw new Error("User ID diperlukan");
      }

      if (!penawaranData.pelanggan && !penawaranData.nama_pelanggan) {
        throw new Error("Nama pelanggan diperlukan");
      }

      if (!penawaranData.nomorKontrak && !penawaranData.nomor_kontrak) {
        throw new Error("Nomor kontrak diperlukan");
      }

      // Basic data mapping - sesuai struktur table database
      const dataToInsert = {
        id_user: parseInt(penawaranData.id_user),
        tanggal_dibuat:
          penawaranData.tanggal_dibuat ||
          penawaranData.tanggal ||
          new Date().toISOString().split("T")[0],
        nama_pelanggan: penawaranData.nama_pelanggan || penawaranData.pelanggan,
        nomor_kontrak:
          penawaranData.nomor_kontrak || penawaranData.nomorKontrak,
        kontrak_tahun: parseInt(
          penawaranData.kontrak_tahun || penawaranData.kontrakTahunKe || 1
        ),
        wilayah_hjt:
          penawaranData.wilayah_hjt || penawaranData.referensiHJT || "",
        diskon:
          parseFloat(
            penawaranData.diskon?.toString().replace("%", "") ||
              penawaranData.discount?.toString().replace("%", "") ||
              "0"
          ) || 0,
        durasi_kontrak: parseInt(
          penawaranData.durasi_kontrak || penawaranData.durasiKontrak || 12
        ),
        status: penawaranData.status || "Menunggu",
        // nama_sales akan diambil dari relasi data_user berdasarkan id_user
      };

      // Optional fields - hanya tambahkan jika ada
      if (
        penawaranData.catatan ||
        (penawaranData.item && penawaranData.harga)
      ) {
        dataToInsert.catatan =
          penawaranData.catatan ||
          `Item: ${penawaranData.item || ""}, Harga: ${
            penawaranData.harga || ""
          }, Jumlah: ${penawaranData.jumlah || ""}`;
      }

      console.log("📋 Data to insert:", dataToInsert);

      const { data, error } = await db.insert("data_penawaran", dataToInsert);

      if (error) {
        console.error("❌ Database error:", error);
        throw error;
      }

      console.log("✅ Penawaran created successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in createPenawaran:", error);
      throw new Error(`Gagal membuat penawaran baru: ${error.message}`);
    }
  }

  // Perbarui penawaran
  static async updatePenawaran(id, penawaranData) {
    try {
      console.log("🔄 Updating penawaran ID:", id);
      console.log("📝 Update data received:", penawaranData);

      // Map frontend fields to database fields sama seperti create
      const updateData = {};

      if (penawaranData.sales || penawaranData.nama_sales) {
        updateData.nama_sales = penawaranData.nama_sales || penawaranData.sales;
      }

      if (penawaranData.tanggal || penawaranData.tanggal_dibuat) {
        updateData.tanggal_dibuat =
          penawaranData.tanggal_dibuat || penawaranData.tanggal;
      }

      if (penawaranData.pelanggan || penawaranData.nama_pelanggan) {
        updateData.nama_pelanggan =
          penawaranData.nama_pelanggan || penawaranData.pelanggan;
      }

      if (penawaranData.nomorKontrak || penawaranData.nomor_kontrak) {
        updateData.nomor_kontrak =
          penawaranData.nomor_kontrak || penawaranData.nomorKontrak;
      }

      if (penawaranData.kontrakTahunKe || penawaranData.kontrak_tahun) {
        updateData.kontrak_tahun = parseInt(
          penawaranData.kontrak_tahun || penawaranData.kontrakTahunKe
        );
      }

      if (penawaranData.referensiHJT || penawaranData.wilayah_hjt) {
        updateData.wilayah_hjt =
          penawaranData.wilayah_hjt || penawaranData.referensiHJT;
      }

      if (penawaranData.discount || penawaranData.diskon) {
        updateData.diskon =
          parseFloat(
            penawaranData.diskon?.toString().replace("%", "") ||
              penawaranData.discount?.toString().replace("%", "") ||
              "0"
          ) || 0;
      }

      if (penawaranData.durasiKontrak || penawaranData.durasi_kontrak) {
        updateData.durasi_kontrak = parseInt(
          penawaranData.durasi_kontrak || penawaranData.durasiKontrak
        );
      }

      if (penawaranData.status) {
        updateData.status = penawaranData.status;
      }

      if (
        penawaranData.catatan ||
        (penawaranData.item && penawaranData.harga)
      ) {
        updateData.catatan =
          penawaranData.catatan ||
          `Item: ${penawaranData.item || ""}, Harga: ${
            penawaranData.harga || ""
          }, Jumlah: ${penawaranData.jumlah || ""}`;
      }

      console.log("📋 Mapped update data:", updateData);

      const { data, error } = await db.update("data_penawaran", updateData, {
        id_penawaran: id,
      });

      if (error) {
        console.error("❌ Database update error:", error);
        throw error;
      }

      console.log("✅ Penawaran updated successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in updatePenawaran:", error);
      throw new Error(`Gagal memperbarui penawaran: ${error.message}`);
    }
  }

  // Hapus penawaran
  static async deletePenawaran(id) {
    try {
      console.log("🗑️ Deleting penawaran ID:", id);

      const { data, error } = await db.delete("data_penawaran", {
        id_penawaran: id,
      });

      if (error) {
        console.error("❌ Database delete error:", error);
        throw error;
      }

      console.log("✅ Penawaran deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in deletePenawaran:", error);
      throw new Error(`Gagal menghapus penawaran: ${error.message}`);
    }
  }

  // Ambil penawaran berdasarkan pengguna
  static async getPenawaranByUser(userId) {
    try {
      const { data, error } = await supabase
        .from("data_penawaran")
        .select(
          `
          *,
          data_user:id_user (
            nama_user,
            email_user,
            role_user
          )
        `
        )
        .eq("id_user", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil penawaran berdasarkan pengguna: ${error.message}`
      );
    }
  }

  // Ambil penawaran berdasarkan status
  static async getPenawaranByStatus(status) {
    try {
      const { data, error } = await supabase
        .from("data_penawaran")
        .select(
          `
          *,
          data_user:id_user (
            nama_user,
            email_user,
            role_user
          )
        `
        )
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil penawaran berdasarkan status: ${error.message}`
      );
    }
  }

  // Perbarui status penawaran (untuk persetujuan admin)
  static async updateStatus(id, status, catatan = null) {
    try {
      const updateData = { status };
      if (catatan) updateData.catatan = catatan;

      const { data, error } = await db.update("data_penawaran", updateData, {
        id_penawaran: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal memperbarui status penawaran: ${error.message}`);
    }
  }
}

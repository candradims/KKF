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
      const { data, error } = await db.insert("data_penawaran", {
        id_user: penawaranData.id_user,
        tanggal_dibuat: penawaranData.tanggal_dibuat,
        nama_pelanggan: penawaranData.nama_pelanggan,
        pekerjaan: penawaranData.pekerjaan,
        nomor_kontrak: penawaranData.nomor_kontrak,
        kontrak_tahun: penawaranData.kontrak_tahun,
        wilayah_hjt: penawaranData.wilayah_hjt,
        diskon: penawaranData.diskon,
        durasi_kontrak: penawaranData.durasi_kontrak,
        target_irr: penawaranData.target_irr,
        diskon_thdp_backbone: penawaranData.diskon_thdp_backbone,
        diskon_thdp_port: penawaranData.diskon_thdp_port,
        status: penawaranData.status || "Menunggu",
        catatan: penawaranData.catatan,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal membuat penawaran baru: ${error.message}`);
    }
  }

  // Perbarui penawaran
  static async updatePenawaran(id, penawaranData) {
    try {
      const { data, error } = await db.update("data_penawaran", penawaranData, {
        id_penawaran: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal memperbarui penawaran: ${error.message}`);
    }
  }

  // Hapus penawaran
  static async deletePenawaran(id) {
    try {
      const { data, error } = await db.delete("data_penawaran", {
        id_penawaran: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
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

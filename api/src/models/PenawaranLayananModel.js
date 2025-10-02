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
        nama_layanan: penawaranLayananData.nama_layanan,
        detail_layanan: penawaranLayananData.detail_layanan,
        hjt_wilayah: penawaranLayananData.hjt_wilayah, // Include HJT Wilayah
        kapasitas: penawaranLayananData.kapasitas,
        qty: penawaranLayananData.qty,
        akses_existing: penawaranLayananData.akses_existing,
        satuan: penawaranLayananData.satuan,
        backbone: penawaranLayananData.backbone,
        port: penawaranLayananData.port,
        tarif_akses: penawaranLayananData.tarif_akses,
        tarif: penawaranLayananData.tarif,
        tarif_akses_terbaru: penawaranLayananData.tarif_akses_terbaru,
        tarif_terbaru: penawaranLayananData.tarif_terbaru,
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
      console.log("🔧 Updating penawaran layanan with ID:", id);
      console.log("📝 Update data:", penawaranLayananData);

      const { data, error } = await supabase
        .from("data_penawaran_layanan")
        .update(penawaranLayananData)
        .eq("id_penawaran_layanan", id);

      if (error) {
        console.error("❌ Database error in updatePenawaranLayanan:", error);
        throw error;
      }

      console.log("✅ Penawaran layanan updated successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in updatePenawaranLayanan:", error);
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
  static async addLayananToPenawaran(req, res) {
    try {
      const { idPenawaran } = req.params;
      const { id_layanan } = req.body;

      const existingPenawaran = await PenawaranModel.getPenawaranById(
        idPenawaran
      );
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat memodifikasi penawaran milik Anda sendiri.",
        });
      }

      const layanan = await LayananModel.getLayananById(id_layanan);
      if (!layanan) {
        return res.status(404).json({
          success: false,
          message: "Layanan tidak ditemukan",
        });
      }
      const layananData = {
        ...req.body,
        id_penawaran: idPenawaran,
        id_layanan: layanan.id_layanan,
        nama_layanan: layanan.nama_layanan,
        detail_layanan: layanan.jenis_layanan,
        satuan: layanan.satuan,
        backbone: layanan.backbone,
        port: layanan.port,
        tarif_akses: layanan.tarif_akses,
        tarif: layanan.tarif,
      };

      const newPenawaranLayanan =
        await PenawaranLayananModel.createPenawaranLayanan(layananData);

      res.status(201).json({
        success: true,
        message: "Layanan berhasil ditambahkan ke penawaran",
        data: newPenawaranLayanan[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menambahkan layanan ke penawaran",
        error: error.message,
      });
    }
  }
}

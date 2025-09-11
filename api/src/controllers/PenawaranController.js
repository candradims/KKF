import { PenawaranModel } from "../models/PenawaranModel.js";
import { PenawaranLayananModel } from "../models/PenawaranLayananModel.js";
import { PengeluaranModel } from "../models/PengeluaranModel.js";
import { HasilPenawaranModel } from "../models/HasilPenawaranModel.js";

export class PenawaranController {
  // Ambil semua penawaran
  static async getAllPenawaran(req, res) {
    try {
      console.log("📋 Getting penawaran for user:", req.user);
      let penawaran;

      // Jika user adalah sales, hanya tampilkan penawaran mereka sendiri
      if (req.user.role_user === "sales") {
        console.log(
          "👤 Sales user - getting own penawaran for ID:",
          req.user.id_user
        );
        penawaran = await PenawaranModel.getPenawaranByUser(req.user.id_user);
      } else if (
        req.user.role_user === "admin" ||
        req.user.role_user === "superAdmin"
      ) {
        // Admin dan SuperAdmin dapat melihat semua penawaran
        console.log("👑 Admin/SuperAdmin user - getting all penawaran");
        penawaran = await PenawaranModel.getAllPenawaran();
      } else {
        throw new Error("Role tidak dikenali");
      }

      console.log("✅ Retrieved penawaran:", penawaran?.length || 0, "records");

      res.status(200).json({
        success: true,
        message: "Data penawaran berhasil diambil",
        data: penawaran || [],
      });
    } catch (error) {
      console.error("❌ Error in getAllPenawaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data penawaran",
        error: error.message,
      });
    }
  }

  // Ambil penawaran berdasarkan ID dengan detail lengkap
  static async getPenawaranById(req, res) {
    try {
      const { id } = req.params;
      const penawaran = await PenawaranModel.getPenawaranById(id);

      if (!penawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      // Cek apakah user sales hanya dapat mengakses penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        penawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat mengakses penawaran milik Anda sendiri.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Data penawaran berhasil diambil",
        data: penawaran,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data penawaran",
        error: error.message,
      });
    }
  }

  // Buat penawaran baru (Khusus Sales)
  static async createPenawaran(req, res) {
    try {
      console.log("📝 Received penawaran data:", req.body);
      console.log("👤 User info:", req.user);

      // Validasi input dasar
      const requiredFields = ["pelanggan", "nomorKontrak", "durasiKontrak"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Field yang wajib diisi: ${missingFields.join(", ")}`,
        });
      }

      const penawaranData = {
        ...req.body,
        id_user: req.user.id_user, // Set ID user dari user yang terautentikasi
        tanggal_dibuat:
          req.body.tanggal || new Date().toISOString().split("T")[0], // Set tanggal saat ini jika tidak ada
      };

      console.log("📋 Processed penawaran data:", penawaranData);

      const newPenawaran = await PenawaranModel.createPenawaran(penawaranData);

      console.log("📋 New penawaran created:", newPenawaran);

      // Extract ID from the created penawaran
      let penawaranId = null;
      if (Array.isArray(newPenawaran) && newPenawaran.length > 0) {
        penawaranId = newPenawaran[0].id_penawaran;
      } else if (newPenawaran && newPenawaran.id_penawaran) {
        penawaranId = newPenawaran.id_penawaran;
      } else if (newPenawaran && newPenawaran.data && newPenawaran.data[0]) {
        penawaranId = newPenawaran.data[0].id_penawaran;
      }

      console.log("📋 Extracted penawaran ID:", penawaranId);

      // Jika ada data pengeluaran lain-lain, simpan juga
      console.log("🔍 Checking pengeluaran fields:", {
        item: req.body.item,
        keterangan: req.body.keterangan,
        hasrat: req.body.hasrat,
        jumlah: req.body.jumlah,
      });

      if (
        req.body.item &&
        req.body.keterangan &&
        req.body.hasrat &&
        req.body.jumlah &&
        penawaranId
      ) {
        console.log("💰 Saving pengeluaran data for penawaran:", penawaranId);

        const pengeluaranData = {
          id_penawaran: penawaranId,
          item: req.body.item,
          keterangan: req.body.keterangan,
          harga_satuan: req.body.hasrat, // Mapping hasrat ke harga_satuan
          jumlah: parseInt(req.body.jumlah),
          // total_harga will be calculated by database as generated column
        };

        console.log("💰 Pengeluaran data to save:", pengeluaranData);

        try {
          const pengeluaranResult = await PengeluaranModel.createPengeluaran(
            pengeluaranData
          );
          console.log(
            "✅ Pengeluaran data saved successfully:",
            pengeluaranResult
          );
        } catch (pengeluaranError) {
          console.error("⚠️ Error saving pengeluaran data:", pengeluaranError);
          // Don't fail the whole request if pengeluaran fails, just log it
        }
      } else {
        console.log(
          "ℹ️ No pengeluaran data provided, incomplete fields, or no penawaran ID"
        );
        if (!penawaranId) {
          console.log("❌ Missing penawaran ID");
        }
      }

      res.status(201).json({
        success: true,
        message: "Penawaran berhasil dibuat",
        data: newPenawaran[0] || newPenawaran,
      });
    } catch (error) {
      console.error("❌ Error in createPenawaran:", error);
      console.error("❌ Error stack:", error.stack);

      // Check if it's a validation error or database error
      let statusCode = 500;
      let message = "Gagal membuat penawaran";

      if (
        error.message.includes("violates not-null constraint") ||
        error.message.includes("required") ||
        error.message.includes("wajib")
      ) {
        statusCode = 400;
        message = "Data tidak lengkap atau tidak valid";
      } else if (error.message.includes("duplicate key value")) {
        statusCode = 409;
        message = "Data dengan nomor kontrak yang sama sudah ada";
      }

      res.status(statusCode).json({
        success: false,
        message: message,
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  // Perbarui penawaran
  static async updatePenawaran(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      console.log("🔄 Update penawaran ID:", id);
      console.log("📝 Update data received:", updateData);
      console.log("👤 User info:", req.user);

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(id);
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      console.log("📋 Existing penawaran:", existingPenawaran);

      // Sales hanya dapat memperbarui penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat memperbarui penawaran milik Anda sendiri.",
        });
      }

      const updatedPenawaran = await PenawaranModel.updatePenawaran(
        id,
        updateData
      );

      console.log("✅ Penawaran updated successfully:", updatedPenawaran);

      res.status(200).json({
        success: true,
        message: "Penawaran berhasil diperbarui",
        data: updatedPenawaran[0] || updatedPenawaran,
      });
    } catch (error) {
      console.error("❌ Error in updatePenawaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui penawaran",
        error: error.message,
      });
    }
  }

  // Hapus penawaran
  static async deletePenawaran(req, res) {
    try {
      const { id } = req.params;

      console.log("🗑️ Delete penawaran ID:", id);
      console.log("👤 User info:", req.user);

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(id);
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      console.log("📋 Existing penawaran to delete:", existingPenawaran);

      // Sales hanya dapat menghapus penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat menghapus penawaran milik Anda sendiri.",
        });
      }

      await PenawaranModel.deletePenawaran(id);

      console.log("✅ Penawaran deleted successfully");

      res.status(200).json({
        success: true,
        message: "Penawaran berhasil dihapus",
      });
    } catch (error) {
      console.error("❌ Error in deletePenawaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus penawaran",
        error: error.message,
      });
    }
  }

  // Perbarui status penawaran (Khusus Admin)
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, catatan } = req.body;

      if (!["Menunggu", "Disetujui", "Ditolak"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status harus Menunggu, Disetujui, atau Ditolak",
        });
      }

      const updatedPenawaran = await PenawaranModel.updateStatus(
        id,
        status,
        catatan
      );

      if (!updatedPenawaran || updatedPenawaran.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Status penawaran berhasil diperbarui",
        data: updatedPenawaran[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui status penawaran",
        error: error.message,
      });
    }
  }

  // Ambil penawaran berdasarkan status
  static async getPenawaranByStatus(req, res) {
    try {
      const { status } = req.params;

      if (!["Menunggu", "Disetujui", "Ditolak"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status harus Menunggu, Disetujui, atau Ditolak",
        });
      }

      const penawaran = await PenawaranModel.getPenawaranByStatus(status);

      res.status(200).json({
        success: true,
        message: `Data penawaran dengan status ${status} berhasil diambil`,
        data: penawaran,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data penawaran berdasarkan status",
        error: error.message,
      });
    }
  }

  // Hitung hasil penawaran
  static async calculateResult(req, res) {
    try {
      const { id } = req.params;

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(id);
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      // Sales hanya dapat menghitung penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat menghitung penawaran milik Anda sendiri.",
        });
      }

      // Ambil layanan penawaran dan pengeluaran
      const layananList =
        await PenawaranLayananModel.getPenawaranLayananByPenawaranId(id);
      const pengeluaranList =
        await PengeluaranModel.getPengeluaranByPenawaranId(id);

      // Hitung total
      let totalPerBulanHargaDasarIcon = 0;
      let totalPerBulanHargaFinalSebelumPPN = 0;

      layananList.forEach((layanan) => {
        totalPerBulanHargaDasarIcon += layanan.harga_dasar_icon || 0;
        totalPerBulanHargaFinalSebelumPPN +=
          layanan.harga_final_sebelum_ppn || 0;
      });

      // Hitung total 12 bulan
      const grandTotal12BulanHargaDasarIcon = totalPerBulanHargaDasarIcon * 12;
      const grandTotal12BulanHargaFinalSebelumPPN =
        totalPerBulanHargaFinalSebelumPPN * 12;

      // Hitung total pengeluaran
      const totalPengeluaranLainLain = pengeluaranList.reduce((total, item) => {
        return total + (item.total_harga || 0);
      }, 0);

      // Hitung diskon
      const discount = existingPenawaran.diskon || 0;
      const discountAmount =
        (grandTotal12BulanHargaFinalSebelumPPN * discount) / 100;

      // Hitung grand total dengan diskon dan pengeluaran
      const grandTotalDiscLain2HargaDasarIcon =
        grandTotal12BulanHargaDasarIcon -
        discountAmount -
        totalPengeluaranLainLain;
      const grandTotalDiscLain2HargaFinalSebelumPPN =
        grandTotal12BulanHargaFinalSebelumPPN -
        discountAmount -
        totalPengeluaranLainLain;

      // Hitung profit dan margin
      const profitDariHjtExclPPN =
        grandTotalDiscLain2HargaFinalSebelumPPN -
        grandTotalDiscLain2HargaDasarIcon;
      const marginDariHjt =
        grandTotalDiscLain2HargaFinalSebelumPPN > 0
          ? (profitDariHjtExclPPN / grandTotalDiscLain2HargaFinalSebelumPPN) *
            100
          : 0;

      // Siapkan data hasil
      const hasilData = {
        total_per_bulan_harga_dasar_icon: totalPerBulanHargaDasarIcon,
        total_per_bulan_harga_final_sebelum_ppn:
          totalPerBulanHargaFinalSebelumPPN,
        grand_total_12_bulan_harga_dasar_icon: grandTotal12BulanHargaDasarIcon,
        grand_total_12_bulan_harga_final_sebelum_ppn:
          grandTotal12BulanHargaFinalSebelumPPN,
        discount: discountAmount,
        total_pengeluaran_lain_lain: totalPengeluaranLainLain,
        grand_total_disc_lain2_harga_dasar_icon:
          grandTotalDiscLain2HargaDasarIcon,
        grand_total_disc_lain2_harga_final_sebelum_ppn:
          grandTotalDiscLain2HargaFinalSebelumPPN,
        profit_dari_hjt_excl_ppn: profitDariHjtExclPPN,
        margin_dari_hjt: marginDariHjt,
      };

      // Simpan atau perbarui hasil
      const result = await HasilPenawaranModel.createOrUpdateHasilPenawaran(
        id,
        hasilData
      );

      res.status(200).json({
        success: true,
        message: "Hasil penawaran berhasil dihitung",
        data: hasilData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghitung hasil penawaran",
        error: error.message,
      });
    }
  }
}

import { PenawaranModel } from "../models/PenawaranModel.js";
import { PenawaranLayananModel } from "../models/PenawaranLayananModel.js";
import { PengeluaranModel } from "../models/PengeluaranModel.js";
import { HasilPenawaranModel } from "../models/HasilPenawaranModel.js";

export class PenawaranController {
  // Ambil semua penawaran
  static async getAllPenawaran(req, res) {
    try {
      let penawaran;

      // Jika user adalah sales, hanya tampilkan penawaran mereka sendiri
      if (req.user.role_user === "sales") {
        penawaran = await PenawaranModel.getPenawaranByUser(req.user.id_user);
      } else {
        // Admin dapat melihat semua penawaran
        penawaran = await PenawaranModel.getAllPenawaran();
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
      const penawaranData = {
        ...req.body,
        id_user: req.user.id_user, // Set ID user dari user yang terautentikasi
        tanggal_dibuat: new Date().toISOString().split("T")[0], // Set tanggal saat ini
      };

      const newPenawaran = await PenawaranModel.createPenawaran(penawaranData);

      res.status(201).json({
        success: true,
        message: "Penawaran berhasil dibuat",
        data: newPenawaran[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal membuat penawaran",
        error: error.message,
      });
    }
  }

  // Perbarui penawaran
  static async updatePenawaran(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(id);
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

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

      res.status(200).json({
        success: true,
        message: "Penawaran berhasil diperbarui",
        data: updatedPenawaran[0],
      });
    } catch (error) {
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

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(id);
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

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

      res.status(200).json({
        success: true,
        message: "Penawaran berhasil dihapus",
      });
    } catch (error) {
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

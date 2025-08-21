import { PengeluaranModel } from "../models/PengeluaranModel.js";
import { PenawaranModel } from "../models/PenawaranModel.js";

export class PengeluaranController {
  // Ambil pengeluaran berdasarkan ID penawaran
  static async getPengeluaranByPenawaranId(req, res) {
    try {
      const { idPenawaran } = req.params;

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(
        idPenawaran
      );
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      // Sales hanya bisa mengakses penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat mengakses penawaran milik Anda sendiri.",
        });
      }

      const pengeluaran = await PengeluaranModel.getPengeluaranByPenawaranId(
        idPenawaran
      );

      res.status(200).json({
        success: true,
        message: "Data pengeluaran berhasil diambil",
        data: pengeluaran,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data pengeluaran",
        error: error.message,
      });
    }
  }

  // Tambahkan pengeluaran ke penawaran
  static async addPengeluaranToPenawaran(req, res) {
    try {
      const { idPenawaran } = req.params;
      const pengeluaranData = { ...req.body, id_penawaran: idPenawaran };

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(
        idPenawaran
      );
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      // Sales hanya bisa menambahkan ke penawaran mereka sendiri
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

      // Validasi field yang wajib diisi
      if (
        !pengeluaranData.item ||
        !pengeluaranData.harga_satuan ||
        !pengeluaranData.jumlah
      ) {
        return res.status(400).json({
          success: false,
          message: "Item, harga satuan, dan jumlah wajib diisi",
        });
      }

      const newPengeluaran = await PengeluaranModel.createPengeluaran(
        pengeluaranData
      );

      res.status(201).json({
        success: true,
        message: "Pengeluaran berhasil ditambahkan ke penawaran",
        data: newPengeluaran[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menambahkan pengeluaran ke penawaran",
        error: error.message,
      });
    }
  }

  // Tambahkan beberapa pengeluaran ke penawaran
  static async addMultiplePengeluaranToPenawaran(req, res) {
    try {
      const { idPenawaran } = req.params;
      const { pengeluaranList } = req.body;

      if (!Array.isArray(pengeluaranList) || pengeluaranList.length === 0) {
        return res.status(400).json({
          success: false,
          message: "pengeluaranList harus berupa array yang tidak kosong",
        });
      }

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(
        idPenawaran
      );
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      // Sales hanya bisa menambahkan ke penawaran mereka sendiri
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

      // Validasi field yang wajib diisi untuk setiap pengeluaran
      for (const pengeluaran of pengeluaranList) {
        if (
          !pengeluaran.item ||
          !pengeluaran.harga_satuan ||
          !pengeluaran.jumlah
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Setiap pengeluaran harus memiliki item, harga satuan, dan jumlah",
          });
        }
      }

      // Tambahkan id_penawaran ke setiap pengeluaran
      const pengeluaranWithPenawaranId = pengeluaranList.map((pengeluaran) => ({
        ...pengeluaran,
        id_penawaran: idPenawaran,
      }));

      const newPengeluaran = await PengeluaranModel.createMultiplePengeluaran(
        pengeluaranWithPenawaranId
      );

      res.status(201).json({
        success: true,
        message: "Beberapa pengeluaran berhasil ditambahkan ke penawaran",
        data: newPengeluaran,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menambahkan beberapa pengeluaran ke penawaran",
        error: error.message,
      });
    }
  }

  // Perbarui pengeluaran
  static async updatePengeluaran(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Ambil pengeluaran untuk mengecek izin
      const existingPengeluaran = await PengeluaranModel.getPengeluaranById(id);
      if (!existingPengeluaran) {
        return res.status(404).json({
          success: false,
          message: "Pengeluaran tidak ditemukan",
        });
      }

      // Cek kepemilikan penawaran
      const quotation = await PenawaranModel.getPenawaranById(
        existingPengeluaran.id_penawaran
      );
      if (
        req.user.role_user === "sales" &&
        quotation.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat memodifikasi penawaran milik Anda sendiri.",
        });
      }

      const updatedPengeluaran = await PengeluaranModel.updatePengeluaran(
        id,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Pengeluaran berhasil diperbarui",
        data: updatedPengeluaran[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui pengeluaran",
        error: error.message,
      });
    }
  }

  // Hapus pengeluaran
  static async deletePengeluaran(req, res) {
    try {
      const { id } = req.params;

      // Ambil pengeluaran untuk mengecek izin
      const existingPengeluaran = await PengeluaranModel.getPengeluaranById(id);
      if (!existingPengeluaran) {
        return res.status(404).json({
          success: false,
          message: "Pengeluaran tidak ditemukan",
        });
      }

      // Cek kepemilikan penawaran
      const quotation = await PenawaranModel.getPenawaranById(
        existingPengeluaran.id_penawaran
      );
      if (
        req.user.role_user === "sales" &&
        quotation.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat memodifikasi penawaran milik Anda sendiri.",
        });
      }

      await PengeluaranModel.deletePengeluaran(id);

      res.status(200).json({
        success: true,
        message: "Pengeluaran berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghapus pengeluaran",
        error: error.message,
      });
    }
  }

  // Ambil total pengeluaran untuk sebuah penawaran
  static async getTotalPengeluaran(req, res) {
    try {
      const { idPenawaran } = req.params;

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(
        idPenawaran
      );
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      // Sales hanya bisa mengakses penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat mengakses penawaran milik Anda sendiri.",
        });
      }

      const total = await PengeluaranModel.getTotalPengeluaranByPenawaranId(
        idPenawaran
      );

      res.status(200).json({
        success: true,
        message: "Total pengeluaran berhasil dihitung",
        data: { total_pengeluaran: total },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghitung total pengeluaran",
        error: error.message,
      });
    }
  }
}

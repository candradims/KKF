import { PenawaranLayananModel } from "../models/PenawaranLayananModel.js";
import { PenawaranModel } from "../models/PenawaranModel.js";

export class PenawaranLayananController {
  // Ambil layanan penawaran berdasarkan ID penawaran
  static async getPenawaranLayananByPenawaranId(req, res) {
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

      const penawaranLayanan =
        await PenawaranLayananModel.getPenawaranLayananByPenawaranId(
          idPenawaran
        );

      res.status(200).json({
        success: true,
        message: "Data layanan penawaran berhasil diambil",
        data: penawaranLayanan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data layanan penawaran",
        error: error.message,
      });
    }
  }

  // Tambahkan layanan ke penawaran
  static async addLayananToPenawaran(req, res) {
    try {
      const { idPenawaran } = req.params;
      const layananData = { ...req.body, id_penawaran: idPenawaran };

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

  // Tambahkan beberapa layanan ke penawaran
  static async addMultipleLayananToPenawaran(req, res) {
    try {
      const { idPenawaran } = req.params;
      const { layananList } = req.body;

      if (!Array.isArray(layananList) || layananList.length === 0) {
        return res.status(400).json({
          success: false,
          message: "layananList harus berupa array yang tidak kosong",
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

      // Tambahkan id_penawaran ke setiap layanan
      const layananWithPenawaranId = layananList.map((layanan) => ({
        ...layanan,
        id_penawaran: idPenawaran,
      }));

      const newPenawaranLayanan =
        await PenawaranLayananModel.createMultiplePenawaranLayanan(
          layananWithPenawaranId
        );

      res.status(201).json({
        success: true,
        message: "Beberapa layanan berhasil ditambahkan ke penawaran",
        data: newPenawaranLayanan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menambahkan beberapa layanan ke penawaran",
        error: error.message,
      });
    }
  }

  // Perbarui layanan penawaran
  static async updatePenawaranLayanan(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Ambil layanan penawaran untuk mengecek izin
      const existingLayanan =
        await PenawaranLayananModel.getPenawaranLayananByPenawaranId(
          updateData.id_penawaran || 0
        );
      const targetLayanan = existingLayanan.find((item) => item.id == id);

      if (!targetLayanan) {
        return res.status(404).json({
          success: false,
          message: "Layanan penawaran tidak ditemukan",
        });
      }

      // Cek kepemilikan penawaran
      const existingPenawaran = await PenawaranModel.getPenawaranById(
        targetLayanan.id_penawaran
      );
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

      const updatedPenawaranLayanan =
        await PenawaranLayananModel.updatePenawaranLayanan(id, updateData);

      res.status(200).json({
        success: true,
        message: "Layanan penawaran berhasil diperbarui",
        data: updatedPenawaranLayanan[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui layanan penawaran",
        error: error.message,
      });
    }
  }

  // Hapus layanan penawaran
  static async deletePenawaranLayanan(req, res) {
    try {
      const { id } = req.params;

      // Ambil layanan penawaran untuk mengecek izin
      const allLayanan = await PenawaranLayananModel.getAllPenawaranLayanan();
      const targetLayanan = allLayanan.find((item) => item.id == id);

      if (!targetLayanan) {
        return res.status(404).json({
          success: false,
          message: "Layanan penawaran tidak ditemukan",
        });
      }

      // Cek kepemilikan penawaran
      const existingPenawaran = await PenawaranModel.getPenawaranById(
        targetLayanan.id_penawaran
      );
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

      await PenawaranLayananModel.deletePenawaranLayanan(id);

      res.status(200).json({
        success: true,
        message: "Layanan penawaran berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghapus layanan penawaran",
        error: error.message,
      });
    }
  }
}

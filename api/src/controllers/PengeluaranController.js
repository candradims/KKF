import { PengeluaranModel } from "../models/PengeluaranModel.js";
import { PenawaranModel } from "../models/PenawaranModel.js";

export class PengeluaranController {
  // Ambil semua pengeluaran
  static async getAllPengeluaran(req, res) {
    try {
      console.log("Getting all pengeluaran for user:", req.headers);

      const userId = req.headers["x-user-id"];
      const userRole = req.headers["x-user-role"];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID tidak ditemukan dalam header",
        });
      }

      let pengeluaran;

      // Admin dan superAdmin bisa melihat semua data
      if (userRole === "admin" || userRole === "superAdmin") {
        pengeluaran = await PengeluaranModel.getAllPengeluaran();
      } else {
        // Sales hanya bisa melihat data mereka sendiri
        pengeluaran = await PengeluaranModel.getPengeluaranByUserId(userId);
      }

      // Format total ke Rupiah untuk response
      const formattedPengeluaran = pengeluaran.map((item) => ({
        ...item,
        totalFormatted: PengeluaranModel.formatRupiah(item.total),
      }));

      console.log(
        "Retrieved pengeluaran:",
        formattedPengeluaran.length,
        "items"
      );

      res.status(200).json({
        success: true,
        message: "Data pengeluaran berhasil diambil",
        data: formattedPengeluaran,
      });
    } catch (error) {
      console.error("Error in getAllPengeluaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data pengeluaran",
        error: error.message,
      });
    }
  }

  // Buat pengeluaran baru
  static async createPengeluaran(req, res) {
    try {
      console.log("Creating new pengeluaran with data:", req.body);
      console.log("Headers:", req.headers);

      const userId = req.headers["x-user-id"];
      const userRole = req.headers["x-user-role"];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID tidak ditemukan dalam header",
        });
      }

      // Sales hanya bisa membuat data untuk diri mereka sendiri
      if (userRole === "sales") {
        req.body.idUser = userId;
      }

      // Validasi field yang wajib diisi untuk pengeluaran
      const requiredFields = ["id_penawaran", "item", "jumlah"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      // Also check if hasrat/harga_satuan is provided
      if (!req.body.hasrat && !req.body.harga_satuan) {
        missingFields.push("hasrat/harga_satuan");
      }

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Field berikut wajib diisi: ${missingFields.join(", ")}`,
        });
      }

      const newPengeluaran = await PengeluaranModel.createPengeluaran(req.body);

      // Format response dengan total dalam Rupiah
      const responseData = {
        ...newPengeluaran,
        totalFormatted: PengeluaranModel.formatRupiah(
          newPengeluaran.total_harga
        ),
      };

      res.status(201).json({
        success: true,
        message: "Pengeluaran berhasil dibuat",
        data: responseData,
      });
    } catch (error) {
      console.error("Error in createPengeluaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal membuat data pengeluaran",
        error: error.message,
      });
    }
  }
  // Ambil pengeluaran berdasarkan ID penawaran
  static async getPengeluaranByPenawaranId(req, res) {
    try {
      const { idPenawaran } = req.params;

      console.log("📋 getPengeluaranByPenawaranId called with:", {
        idPenawaran,
        user: req.user,
        headers: req.headers,
      });

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(
        idPenawaran
      );

      console.log("📋 Found penawaran:", existingPenawaran);

      if (!existingPenawaran) {
        console.log("❌ Penawaran not found for ID:", idPenawaran);
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
        console.log("❌ Access denied for sales user:", {
          userRole: req.user.role_user,
          userId: req.user.id_user,
          penawaranUserId: existingPenawaran.id_user,
        });
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat mengakses penawaran milik Anda sendiri.",
        });
      }

      console.log("✅ Access granted, fetching pengeluaran data...");
      const pengeluaran = await PengeluaranModel.getPengeluaranByPenawaranId(
        idPenawaran
      );

      console.log("📋 Retrieved pengeluaran data:", pengeluaran);

      res.status(200).json({
        success: true,
        message: "Data pengeluaran berhasil diambil",
        data: pengeluaran,
      });
    } catch (error) {
      console.error("❌ Error in getPengeluaranByPenawaranId:", error);
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
          message: "Item, hasrat (harga satuan), dan jumlah wajib diisi",
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

  // Update pengeluaran
  static async updatePengeluaran(req, res) {
    try {
      const { id } = req.params;
      const userId = req.headers["x-user-id"];
      const userRole = req.headers["x-user-role"];

      console.log("Updating pengeluaran:", id, "Data:", req.body);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID tidak ditemukan dalam header",
        });
      }

      // Cek apakah pengeluaran ada
      const existingPengeluaran = await PengeluaranModel.getPengeluaranById(id);
      if (!existingPengeluaran) {
        return res.status(404).json({
          success: false,
          message: "Pengeluaran tidak ditemukan",
        });
      }

      // Sales hanya bisa mengupdate pengeluaran dari penawaran mereka sendiri
      // Cek penawaran yang terkait dengan pengeluaran ini
      const relatedPenawaran = await PenawaranModel.getPenawaranById(
        existingPengeluaran.id_penawaran
      );
      if (
        userRole === "sales" &&
        relatedPenawaran &&
        relatedPenawaran.id_user !== parseInt(userId)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat mengupdate pengeluaran dari penawaran milik Anda sendiri.",
        });
      }

      // Validasi field yang wajib diisi
      const requiredFields = ["item", "hasrat", "jumlah"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Field berikut wajib diisi: ${missingFields.join(", ")}`,
        });
      }

      const updatedPengeluaran = await PengeluaranModel.updatePengeluaran(
        id,
        req.body
      );

      // Format response dengan total dalam Rupiah
      const responseData = {
        ...updatedPengeluaran,
        totalFormatted: PengeluaranModel.formatRupiah(
          updatedPengeluaran.total_harga
        ),
      };

      res.status(200).json({
        success: true,
        message: "Pengeluaran berhasil diperbarui",
        data: responseData,
      });
    } catch (error) {
      console.error("Error in updatePengeluaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui data pengeluaran",
        error: error.message,
      });
    }
  }

  // Delete pengeluaran
  static async deletePengeluaran(req, res) {
    try {
      const { id } = req.params;
      const userId = req.headers["x-user-id"];
      const userRole = req.headers["x-user-role"];

      console.log("Deleting pengeluaran:", id);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID tidak ditemukan dalam header",
        });
      }

      // Cek apakah pengeluaran ada
      const existingPengeluaran = await PengeluaranModel.getPengeluaranById(id);
      if (!existingPengeluaran) {
        return res.status(404).json({
          success: false,
          message: "Pengeluaran tidak ditemukan",
        });
      }

      // Sales hanya bisa menghapus pengeluaran dari penawaran mereka sendiri
      // Cek penawaran yang terkait dengan pengeluaran ini
      const relatedPenawaran = await PenawaranModel.getPenawaranById(
        existingPengeluaran.id_penawaran
      );
      if (
        userRole === "sales" &&
        relatedPenawaran &&
        relatedPenawaran.id_user !== parseInt(userId)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat menghapus pengeluaran dari penawaran milik Anda sendiri.",
        });
      }

      await PengeluaranModel.deletePengeluaran(id);

      res.status(200).json({
        success: true,
        message: "Pengeluaran berhasil dihapus",
        data: existingPengeluaran,
      });
    } catch (error) {
      console.error("Error in deletePengeluaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus data pengeluaran",
        error: error.message,
      });
    }
  }
}

import { UserModel } from "../models/UserModel.js";

export class AdminController {
  // Ambil semua pengguna (Khusus Admin)
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();

      // Hapus password dari response
      const usersWithoutPasswords = users.map((user) => {
        const { kata_sandi, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.status(200).json({
        success: true,
        message: "Data pengguna berhasil diambil",
        data: usersWithoutPasswords,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data pengguna",
        error: error.message,
      });
    }
  }

  // Buat pengguna baru (Khusus Admin)
  static async createUser(req, res) {
    try {
      const { email_user, kata_sandi, role_user } = req.body;

      if (!email_user || !kata_sandi || !role_user) {
        return res.status(400).json({
          success: false,
          message: "Email, kata sandi, dan role wajib diisi",
        });
      }

      // Validasi role
      if (!["admin", "sales"].includes(role_user)) {
        return res.status(400).json({
          success: false,
          message: "Role harus admin atau sales",
        });
      }

      // Cek apakah pengguna sudah ada
      try {
        const existingUser = await UserModel.getUserByEmail(email_user);
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Pengguna dengan email ini sudah ada",
          });
        }
      } catch (error) {
        // Pengguna tidak ada, lanjutkan proses
      }

      const newUser = await UserModel.createUser({
        email_user,
        kata_sandi,
        role_user,
      });

      // Hapus password dari response
      const { kata_sandi: _, ...userWithoutPassword } = newUser[0];

      res.status(201).json({
        success: true,
        message: "Pengguna berhasil dibuat",
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal membuat pengguna",
        error: error.message,
      });
    }
  }

  // Perbarui pengguna (Khusus Admin)
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validasi role jika disediakan
      if (
        updateData.role_user &&
        !["admin", "sales"].includes(updateData.role_user)
      ) {
        return res.status(400).json({
          success: false,
          message: "Role harus admin atau sales",
        });
      }

      const updatedUser = await UserModel.updateUser(id, updateData);

      if (!updatedUser || updatedUser.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pengguna tidak ditemukan",
        });
      }

      // Hapus password dari response
      const { kata_sandi: _, ...userWithoutPassword } = updatedUser[0];

      res.status(200).json({
        success: true,
        message: "Data pengguna berhasil diperbarui",
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui data pengguna",
        error: error.message,
      });
    }
  }

  // Hapus pengguna (Khusus Admin)
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const deletedUser = await UserModel.deleteUser(id);

      if (!deletedUser || deletedUser.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pengguna tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Pengguna berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghapus pengguna",
        error: error.message,
      });
    }
  }

  // Ambil pengguna berdasarkan ID (Khusus Admin)
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Pengguna tidak ditemukan",
        });
      }

      // Hapus password dari response
      const { kata_sandi: _, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        message: "Data pengguna berhasil diambil",
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data pengguna",
        error: error.message,
      });
    }
  }

  // Ambil pengguna berdasarkan role (Khusus Admin)
  static async getUsersByRole(req, res) {
    try {
      const { role } = req.params;

      if (!["admin", "sales"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role harus admin atau sales",
        });
      }

      const users = await UserModel.getUsersByRole(role);

      // Hapus password dari response
      const usersWithoutPasswords = users.map((user) => {
        const { kata_sandi, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.status(200).json({
        success: true,
        message: `Data pengguna ${role} berhasil diambil`,
        data: usersWithoutPasswords,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data pengguna berdasarkan role",
        error: error.message,
      });
    }
  }
}

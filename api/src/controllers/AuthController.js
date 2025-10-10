import { UserModel } from "../models/UserModel.js";

export class AuthController {
  // Login
  static async login(req, res) {
    try {
      const { email_user, kata_sandi, role_user } = req.body;

      if (!email_user || !kata_sandi || !role_user) {
        return res.status(400).json({
          success: false,
          message: "Email, kata sandi, dan role wajib diisi",
        });
      }

      const user = await UserModel.getUserByEmail(email_user);

      // Periksa apakah user ditemukan
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email tidak ditemukan",
        });
      }

      // Periksa apakah user aktif
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: "Akun tidak aktif",
        });
      }

      // Periksa password
      if (user.kata_sandi !== kata_sandi) {
        return res.status(401).json({
          success: false,
          message: "Password salah",
        });
      }

      // Periksa role
      if (user.role_user !== role_user) {
        return res.status(403).json({
          success: false,
          message: `Role tidak sesuai. Expected: ${role_user}, Actual: ${user.role_user}`,
        });
      }

      const userResponse = {
        id_user: user.id_user,
        nama_user: user.nama_user,
        email_user: user.email_user,
        role_user: user.role_user,
        target_nr: user.target_nr || null, // Include target_nr for sales
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      res.status(200).json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({
        success: false,
        message: "Kesalahan server internal",
        error: error.message,
      });
    }
  }

  // Ambil profil pengguna saat ini
  static async getProfile(req, res) {
    try {
      const { kata_sandi: _, ...userWithoutPassword } = req.user;

      res.status(200).json({
        success: true,
        message: "Profil berhasil diambil",
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil profil",
        error: error.message,
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { email_user, new_password } = req.body;

      if (!email_user || !new_password) {
        return res.status(400).json({
          success: false,
          message: "Email dan password baru wajib diisi",
        });
      }

      const user = await UserModel.getUserByEmail(email_user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Pengguna dengan email ini tidak ditemukan",
        });
      }

      const updatedUser = await UserModel.updateUser(user.id_user, {
        kata_sandi: new_password,
        updated_at: new Date().toISOString(),
      });

      res.status(200).json({
        success: true,
        message: "Password berhasil diperbarui",
        data: {
          id_user: updatedUser[0].id_user,
          email_user: updatedUser[0].email_user,
        },
      });
    } catch (error) {
      console.error("❌ Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Gagal reset password",
        error: error.message,
      });
    }
  }
}

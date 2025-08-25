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
      if (user.kata_sandi !== kata_sandi) {
        return res.status(401).json({
          success: false,
          message: "Password salah",
        });
      }
      if (user.role_user !== role_user) {
        return res.status(403).json({
          success: false,
          message: `Role tidak sesuai`,
        });
      }

      const { kata_sandi: _, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Data Tidak Ditemukan",
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
}

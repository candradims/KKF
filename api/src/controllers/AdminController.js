import { UserModel } from "../models/UserModel.js";

export class AdminController {
  // Ambil semua pengguna (Khusus Admin)
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();

      res.status(200).json({
        success: true,
        message: "Data pengguna berhasil diambil",
        data: users,
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
      console.log("📨 Received create user request:", req.body);

      const { nama_user, email_user, kata_sandi, role_user, target_nr } =
        req.body;

      // Validasi input
      if (!nama_user || !email_user || !kata_sandi || !role_user) {
        return res.status(400).json({
          success: false,
          message: "Nama, email, kata sandi, dan role wajib diisi",
        });
      }

      // Validasi role (tambahkan 'aktivasi')
      const validRoles = ["superAdmin", "admin", "sales", "aktivasi"];
      if (!validRoles.includes(role_user)) {
        return res.status(400).json({
          success: false,
          message: "Role harus superAdmin, admin, sales, atau aktivasi",
        });
      }

      // Cek email sudah ada
      const existingUser = await UserModel.getUserByEmail(email_user);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Pengguna dengan email ini sudah ada",
        });
      }

      // Buat user baru
      const newUser = await UserModel.createUser({
        nama_user,
        email_user,
        kata_sandi,
        role_user,
        target_nr: target_nr || null, // Add target_nr
      });

      if (!newUser || newUser.length === 0) {
        throw new Error("Tidak ada data yang dikembalikan dari database");
      }

      // Hapus password dari response
      const userResponse = { ...newUser[0] };
      delete userResponse.kata_sandi;

      console.log("✅ User created successfully:", userResponse);

      res.status(201).json({
        success: true,
        message: "Pengguna berhasil dibuat",
        data: userResponse,
      });
    } catch (error) {
      console.error("❌ Error in createUser:", error);
      res.status(500).json({
        success: false,
        message: "Gagal membuat pengguna",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }

  // Perbarui pengguna (Khusus Admin)
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nama_user, email_user, kata_sandi, role_user, target_nr } =
        req.body;

      console.log("📝 AdminController - Updating user ID:", id);
      console.log("📝 AdminController - Request body:", req.body);

      // Validasi input yang diperlukan
      if (
        !nama_user &&
        !email_user &&
        !kata_sandi &&
        !role_user &&
        target_nr === undefined
      ) {
        console.log("❌ No fields provided for update");
        return res.status(400).json({
          success: false,
          message: "Minimal satu field harus diisi untuk update",
        });
      }

      // Prepare update data
      const updateData = {};

      if (nama_user) {
        updateData.nama_user = nama_user;
      }

      if (email_user) {
        updateData.email_user = email_user;
      }

      if (kata_sandi && kata_sandi.trim() !== "") {
        updateData.kata_sandi = kata_sandi;
      }

      if (role_user) {
        // Validasi role (tambahkan 'aktivasi')
        if (!["superAdmin", "admin", "sales", "aktivasi"].includes(role_user)) {
          console.log("❌ Invalid role:", role_user);
          return res.status(400).json({
            success: false,
            message: "Role harus superAdmin, admin, sales, atau aktivasi",
          });
        }
        updateData.role_user = role_user;
      }

      // Handle target_nr - explicitly set to null if role is not sales
      if (role_user === "sales") {
        updateData.target_nr =
          target_nr !== undefined && target_nr !== null && target_nr !== ""
            ? parseInt(target_nr)
            : null;
      } else if (role_user && role_user !== "sales") {
        // If role is changed to non-sales, set target_nr to null
        updateData.target_nr = null;
      } else if (target_nr !== undefined) {
        // If only target_nr is being updated (no role change)
        updateData.target_nr =
          target_nr !== null && target_nr !== "" ? parseInt(target_nr) : null;
      }

      console.log("📝 AdminController - Final update data:", updateData);

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
      console.error("❌ Update user error:", error);
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

      if (!["superAdmin", "admin", "sales", "aktivasi"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role harus superAdmin, admin, sales, atau aktivasi",
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

  // Import Data
  static async importUsers(req, res) {
    try {
      console.log("📨 Received import users request");

      const { users } = req.body;

      // Validasi input
      if (!users || !Array.isArray(users) || users.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Data users harus berupa array dan tidak boleh kosong",
        });
      }

      const results = {
        success: [],
        failed: [],
      };

      // Process each user
      for (const userData of users) {
        try {
          const { nama_user, email_user, kata_sandi, role_user, target_nr } =
            userData;

          // Validasi field wajib
          if (!nama_user || !email_user || !kata_sandi || !role_user) {
            results.failed.push({
              user: userData,
              error: "Nama, email, kata sandi, dan role wajib diisi",
            });
            continue;
          }

          // Validasi role (tambahkan 'aktivasi')
          const validRoles = ["superAdmin", "admin", "sales", "aktivasi"];
          if (!validRoles.includes(role_user)) {
            results.failed.push({
              user: userData,
              error: "Role harus superAdmin, admin, sales, atau aktivasi",
            });
            continue;
          }

          // Cek email sudah ada
          const existingUser = await UserModel.getUserByEmail(email_user);
          if (existingUser) {
            results.failed.push({
              user: userData,
              error: "Pengguna dengan email ini sudah ada",
            });
            continue;
          }

          // Buat user baru
          const newUser = await UserModel.createUser({
            nama_user,
            email_user,
            kata_sandi,
            role_user,
            target_nr: role_user === "sales" ? target_nr || null : null,
          });

          if (!newUser || newUser.length === 0) {
            throw new Error("Tidak ada data yang dikembalikan dari database");
          }

          // Hapus password dari response
          const userResponse = { ...newUser[0] };
          delete userResponse.kata_sandi;

          results.success.push(userResponse);

          console.log(`✅ User imported successfully: ${email_user}`);
        } catch (error) {
          console.error(`❌ Error importing user:`, error);
          results.failed.push({
            user: userData,
            error: error.message,
          });
        }
      }

      const response = {
        success: true,
        message: `Import selesai. Berhasil: ${results.success.length}, Gagal: ${results.failed.length}`,
        data: {
          success: results.success,
          failed: results.failed,
        },
      };

      if (results.success.length === 0 && results.failed.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Semua data gagal diimport",
          data: response.data,
        });
      }

      res.status(201).json(response);
    } catch (error) {
      console.error("❌ Error in importUsers:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengimpor data pengguna",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
}

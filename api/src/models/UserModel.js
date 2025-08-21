import { db, supabase } from "../config/database.js";

export class UserModel {
  // Ambil semua pengguna
  static async getAllUsers() {
    try {
      const { data, error } = await db.select("data_user");
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data pengguna: ${error.message}`);
    }
  }

  // Ambil pengguna berdasarkan ID
  static async getUserById(id) {
    try {
      const { data, error } = await db.findOne("data_user", { id_user: id });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data pengguna: ${error.message}`);
    }
  }

  // Ambil pengguna berdasarkan email
  static async getUserByEmail(email) {
    try {
      const { data, error } = await db.findOne("data_user", {
        email_user: email,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil data pengguna berdasarkan email: ${error.message}`
      );
    }
  }

  // Buat pengguna baru
  static async createUser(userData) {
    try {
      const { data, error } = await db.insert("data_user", {
        email_user: userData.email_user,
        kata_sandi: userData.kata_sandi,
        role_user: userData.role_user,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal membuat data pengguna: ${error.message}`);
    }
  }

  // Perbarui pengguna
  static async updateUser(id, userData) {
    try {
      const { data, error } = await db.update("data_user", userData, {
        id_user: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal memperbarui data pengguna: ${error.message}`);
    }
  }

  // Hapus pengguna
  static async deleteUser(id) {
    try {
      const { data, error } = await db.delete("data_user", { id_user: id });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal menghapus data pengguna: ${error.message}`);
    }
  }

  // Ambil pengguna berdasarkan role
  static async getUsersByRole(role) {
    try {
      const { data, error } = await supabase
        .from("data_user")
        .select("*")
        .eq("role_user", role);
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil data pengguna berdasarkan role: ${error.message}`
      );
    }
  }
}

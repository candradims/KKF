import { db, supabase } from "../config/database.js";

export class UserModel {
  // Ambil semua pengguna
  static async getAllUsers() {
    const { data, error } = await supabase
      .from("data_user")
      .select(
        "id_user, tanggal, email_user, role_user, is_active, created_at, updated_at"
      );

    if (error) throw new Error(error.message);
    return data;
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
      console.log("🔍 Searching user by email:", email);

      const { data, error } = await supabase
        .from("data_user")
        .select(
          "id_user, tanggal, email_user, kata_sandi, role_user, is_active, created_at, updated_at"
        )
        .eq("email_user", email)
        .maybeSingle();

      if (error) {
        console.error("❌ Supabase error in getUserByEmail:", error);
        throw error;
      }

      console.log("📋 User search result:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in getUserByEmail:", error);
      throw new Error(
        `Gagal mengambil data pengguna berdasarkan email: ${error.message}`
      );
    }
  }

  // Buat pengguna baru
  static async createUser(userData) {
    try {
      console.log("Creating user with data:", userData);

      const userDataToInsert = {
        tanggal: new Date().toISOString().split("T")[0],
        email_user: userData.email_user,
        kata_sandi: userData.kata_sandi,
        role_user: userData.role_user,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Data to insert:", userDataToInsert);

      const { data, error } = await supabase
        .from("data_user")
        .insert([userDataToInsert])
        .select(
          "id_user, tanggal, email_user, role_user, is_active, created_at, updated_at"
        );

      if (error) {
        console.error("❌ Supabase insert error:", error);
        console.error("Error details:", error.details);
        console.error("Error hint:", error.hint);
        console.error("Error code:", error.code);
        throw new Error(error.message);
      }

      console.log("✅ User created successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Create user error:", error);
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

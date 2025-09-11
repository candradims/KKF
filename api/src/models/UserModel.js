import { db, supabase } from "../config/database.js";

export class UserModel {
  // Ambil semua pengguna
  static async getAllUsers() {
    const { data, error } = await supabase
      .from("data_user")
      .select(
        "id_user, nama_user, tanggal, email_user, kata_sandi, role_user, is_active, created_at, updated_at"
      );

    if (error) throw new Error(error.message);
    return data;
  }

  // Ambil pengguna berdasarkan ID
  static async getUserById(id) {
    try {
      console.log("🔍 Searching user by ID:", id);

      const { data, error } = await supabase
        .from("data_user")
        .select(
          "id_user, nama_user, tanggal, email_user, kata_sandi, role_user, is_active, created_at, updated_at"
        )
        .eq("id_user", id)
        .maybeSingle();

      if (error) {
        console.error("❌ Supabase error in getUserById:", error);
        throw error;
      }

      console.log("📋 User search result:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in getUserById:", error);
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
          "id_user, nama_user, tanggal, email_user, kata_sandi, role_user, is_active, created_at, updated_at"
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
        nama_user: userData.nama_user,
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
          "id_user, nama_user, tanggal, email_user, role_user, is_active, created_at, updated_at"
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
      console.log("📝 UserModel - Updating user with id:", id);
      console.log("📝 UserModel - Update data:", userData);

      // Validasi ID
      if (!id) {
        throw new Error("User ID tidak boleh kosong");
      }

      // Validasi userData tidak kosong
      if (!userData || Object.keys(userData).length === 0) {
        throw new Error("Data update tidak boleh kosong");
      }

      // Tambahkan updated_at
      const updateData = {
        ...userData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("data_user")
        .update(updateData)
        .eq("id_user", id)
        .select();

      if (error) {
        console.error("❌ Supabase error in updateUser:", error);
        console.error("❌ Error code:", error.code);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error details:", error.details);
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log("❌ No user found with ID:", id);
        throw new Error("User tidak ditemukan atau tidak ada perubahan");
      }

      console.log("✅ User updated successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in updateUser:", error);
      throw new Error(`Gagal memperbarui data pengguna: ${error.message}`);
    }
  }

  // Hapus pengguna
  static async deleteUser(id) {
    try {
      console.log("🗑️ Deleting user with id:", id);

      const { data, error } = await supabase
        .from("data_user")
        .delete()
        .eq("id_user", id)
        .select();

      if (error) {
        console.error("❌ Supabase error in deleteUser:", error);
        throw error;
      }

      console.log("✅ User deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in deleteUser:", error);
      throw new Error(`Gagal menghapus data pengguna: ${error.message}`);
    }
  }

  // Ambil pengguna berdasarkan role
  static async getUsersByRole(role) {
    try {
      const { data, error } = await supabase
        .from("data_user")
        .select("id_user, nama_user, tanggal, email_user, role_user, is_active, created_at, updated_at")
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

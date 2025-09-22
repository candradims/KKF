import { db, supabase } from "../config/database.js";

export class PenawaranModel {
  // Ambil semua penawaran
  static async getAllPenawaran() {
    try {
      const { data, error } = await supabase
        .from("data_penawaran")
        .select(
          `
          *,
          data_user:id_user (
            nama_user,
            email_user,
            role_user
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data penawaran: ${error.message}`);
    }
  }

  // Ambil penawaran berdasarkan ID dengan detail lengkap
  static async getPenawaranById(id) {
    try {
      const { data, error } = await supabase
        .from("data_penawaran")
        .select(
          `
          *,
          data_user:id_user (
            nama_user,
            email_user,
            role_user
          ),
          data_penawaran_layanan (
            *,
            data_layanan:id_layanan (
              nama_layanan,
              wilayah_hjt,
              satuan
            )
          ),
          data_pengeluaran (*),
          hasil_penawaran (*)
        `
        )
        .eq("id_penawaran", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal mengambil data penawaran: ${error.message}`);
    }
  }

  // Buat penawaran baru
  static async createPenawaran(penawaranData) {
    try {
      console.log("📝 Creating penawaran with data:", penawaranData);

      // Validate required fields
      if (!penawaranData.id_user) {
        throw new Error("User ID diperlukan");
      }

      if (!penawaranData.pelanggan && !penawaranData.nama_pelanggan) {
        throw new Error("Nama pelanggan diperlukan");
      }

      if (!penawaranData.nomorKontrak && !penawaranData.nomor_kontrak) {
        throw new Error("Nomor kontrak diperlukan");
      }

      // Basic data mapping - sesuai struktur table database
      const dataToInsert = {
        id_user: parseInt(penawaranData.id_user),
        tanggal_dibuat: (() => {
          try {
            // Get the date string
            const dateString =
              penawaranData.tanggal_dibuat || penawaranData.tanggal;
            console.log("📅 Original date string for create:", dateString);

            if (!dateString) {
              return new Date().toISOString().split("T")[0]; // Today's date
            }

            // Parse the date string based on potential formats
            let date;

            // Check if it's DD/MM/YYYY format (common in many locales)
            if (dateString.includes("/")) {
              const [day, month, year] = dateString.split("/");
              date = new Date(
                `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
              );
            }
            // Check if it's already in YYYY-MM-DD format (ISO)
            else if (dateString.includes("-")) {
              date = new Date(dateString);
            }
            // Try as a direct date
            else {
              date = new Date(dateString);
            }

            // Validate the date is valid
            if (isNaN(date.getTime())) {
              console.error("📅 Invalid date:", dateString);
              return new Date().toISOString().split("T")[0]; // Fallback to today
            }

            // Format as YYYY-MM-DD for PostgreSQL
            const formattedDate = date.toISOString().split("T")[0];
            console.log("📅 Formatted date for DB:", formattedDate);

            return formattedDate;
          } catch (dateError) {
            console.error("❌ Date processing error:", dateError);
            return new Date().toISOString().split("T")[0]; // Fallback to today
          }
        })(),
        nama_pelanggan: penawaranData.nama_pelanggan || penawaranData.pelanggan,
        nomor_kontrak:
          penawaranData.nomor_kontrak || penawaranData.nomorKontrak,
        kontrak_tahun: parseInt(
          penawaranData.kontrak_tahun || penawaranData.kontrakTahunKe || 1
        ),
        wilayah_hjt:
          penawaranData.wilayah_hjt || penawaranData.referensiHJT || "",
        diskon:
          parseFloat(
            penawaranData.diskon?.toString().replace("%", "") ||
              penawaranData.discount?.toString().replace("%", "") ||
              "0"
          ) || 0,
        durasi_kontrak: parseInt(
          penawaranData.durasi_kontrak || penawaranData.durasiKontrak || 12
        ),
        status: penawaranData.status || "Menunggu",
        // nama_sales akan diambil dari relasi data_user berdasarkan id_user
      };

      // Optional fields - hanya tambahkan jika ada
      if (
        penawaranData.catatan ||
        (penawaranData.item && penawaranData.harga)
      ) {
        dataToInsert.catatan =
          penawaranData.catatan ||
          `Item: ${penawaranData.item || ""}, Harga: ${
            penawaranData.harga || ""
          }, Jumlah: ${penawaranData.jumlah || ""}`;
      }

      console.log("📋 Data to insert:", dataToInsert);

      const { data, error } = await db.insert("data_penawaran", dataToInsert);

      if (error) {
        console.error("❌ Database error:", error);
        throw error;
      }

      console.log("✅ Penawaran created successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in createPenawaran:", error);
      throw new Error(`Gagal membuat penawaran baru: ${error.message}`);
    }
  }

  // Perbarui penawaran
  static async updatePenawaran(id, penawaranData) {
    try {
      console.log("🔄 Updating penawaran ID:", id, "Type:", typeof id);
      console.log(
        "📝 Update data received:",
        JSON.stringify(penawaranData, null, 2)
      );

      // Ensure ID is a number
      const penawaranId = typeof id === "string" ? parseInt(id, 10) : id;

      if (isNaN(penawaranId)) {
        throw new Error(`Invalid penawaran ID: ${id}`);
      }

      console.log("🔄 Using numeric ID:", penawaranId);

      // Map frontend fields to database fields sama seperti create
      const updateData = {};

      // Always include id_user to prevent it from being overwritten
      if (penawaranData.id_user) {
        updateData.id_user = parseInt(penawaranData.id_user, 10);
      }

      if (penawaranData.tanggal || penawaranData.tanggal_dibuat) {
        try {
          // Get the date string
          const dateString =
            penawaranData.tanggal_dibuat || penawaranData.tanggal;
          console.log("📅 Original date string:", dateString);

          // Parse the date string based on potential formats
          let date;

          // Check if it's DD/MM/YYYY format (common in many locales)
          if (dateString.includes("/")) {
            const [day, month, year] = dateString.split("/");
            date = new Date(
              `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
            );
          }
          // Check if it's already in YYYY-MM-DD format (ISO)
          else if (dateString.includes("-")) {
            date = new Date(dateString);
          }
          // Try as a direct date
          else {
            date = new Date(dateString);
          }

          // Validate the date is valid
          if (isNaN(date.getTime())) {
            console.error("📅 Invalid date:", dateString);
            throw new Error(`Invalid date format: ${dateString}`);
          }

          // Format as YYYY-MM-DD for PostgreSQL
          const formattedDate = date.toISOString().split("T")[0];
          console.log("📅 Formatted date for DB:", formattedDate);

          updateData.tanggal_dibuat = formattedDate;
        } catch (dateError) {
          console.error("❌ Date processing error:", dateError);
          // If there's an error, don't include the date field in the update
          // This prevents date validation errors
        }
      }

      if (penawaranData.pelanggan || penawaranData.nama_pelanggan) {
        updateData.nama_pelanggan =
          penawaranData.nama_pelanggan || penawaranData.pelanggan;
      }

      if (penawaranData.nomorKontrak || penawaranData.nomor_kontrak) {
        updateData.nomor_kontrak =
          penawaranData.nomor_kontrak || penawaranData.nomorKontrak;
      }

      if (penawaranData.kontrakTahunKe || penawaranData.kontrak_tahun) {
        updateData.kontrak_tahun = parseInt(
          penawaranData.kontrak_tahun || penawaranData.kontrakTahunKe
        );
      }

      if (penawaranData.referensiHJT || penawaranData.wilayah_hjt) {
        updateData.wilayah_hjt =
          penawaranData.wilayah_hjt || penawaranData.referensiHJT;
      }

      if (penawaranData.discount || penawaranData.diskon) {
        updateData.diskon =
          parseFloat(
            penawaranData.diskon?.toString().replace("%", "") ||
              penawaranData.discount?.toString().replace("%", "") ||
              "0"
          ) || 0;
      }

      if (penawaranData.durasiKontrak || penawaranData.durasi_kontrak) {
        updateData.durasi_kontrak = parseInt(
          penawaranData.durasi_kontrak || penawaranData.durasiKontrak
        );
      }

      if (penawaranData.status) {
        updateData.status = penawaranData.status;
      }

      if (
        penawaranData.catatan ||
        (penawaranData.item && penawaranData.harga)
      ) {
        updateData.catatan =
          penawaranData.catatan ||
          `Item: ${penawaranData.item || ""}, Harga: ${
            penawaranData.harga || ""
          }, Jumlah: ${penawaranData.jumlah || ""}`;
      }

      console.log("📋 Mapped update data:", updateData);

      // Get the current record to ensure we're not overwriting the id_user
      try {
        // Use the previously defined penawaranId for consistency
        const { data: currentRecord, error: recordError } = await supabase
          .from("data_penawaran")
          .select("id_user, id_penawaran")
          .eq("id_penawaran", penawaranId)
          .single();

        if (recordError) {
          console.error("❌ Error fetching current record:", recordError);
          throw new Error(
            `Failed to fetch current record: ${recordError.message}`
          );
        }

        if (currentRecord && currentRecord.id_user) {
          updateData.id_user = parseInt(currentRecord.id_user, 10);
          console.log("🔐 Preserving existing id_user:", updateData.id_user);
        } else {
          console.error(
            "❌ Current record not found or missing id_user for ID:",
            penawaranId
          );
          throw new Error(
            `Penawaran with ID ${penawaranId} not found or missing user data`
          );
        }
      } catch (recordError) {
        console.error("❌ Error getting current record:", recordError);
        throw recordError;
      }

      console.log("📊 Final update data to send:", updateData);
      console.log("📊 Target ID:", id);

      // Use the penawaranId from earlier in the function
      const { data, error } = await db.update("data_penawaran", updateData, {
        id_penawaran: penawaranId,
      });

      if (error) {
        console.error("❌ Database update error:", error);
        console.error("❌ Error details:", error.details || "No details");
        console.error("❌ Error hint:", error.hint || "No hint");
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn("⚠️ Update succeeded but no data returned");
        // Return a minimal successful result
        return [{ id_penawaran: penawaranId, ...updateData }];
      }

      console.log("✅ Penawaran updated successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in updatePenawaran:", error);
      throw new Error(`Gagal memperbarui penawaran: ${error.message}`);
    }
  }

  // Hapus penawaran
  static async deletePenawaran(id) {
    try {
      console.log("🗑️ Deleting penawaran ID:", id);

      const { data, error } = await db.delete("data_penawaran", {
        id_penawaran: id,
      });

      if (error) {
        console.error("❌ Database delete error:", error);
        throw error;
      }

      console.log("✅ Penawaran deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error in deletePenawaran:", error);
      throw new Error(`Gagal menghapus penawaran: ${error.message}`);
    }
  }

  // Ambil penawaran berdasarkan pengguna
  static async getPenawaranByUser(userId) {
    try {
      const { data, error } = await supabase
        .from("data_penawaran")
        .select(
          `
          *,
          data_user:id_user (
            nama_user,
            email_user,
            role_user
          )
        `
        )
        .eq("id_user", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil penawaran berdasarkan pengguna: ${error.message}`
      );
    }
  }

  // Ambil penawaran berdasarkan status
  static async getPenawaranByStatus(status) {
    try {
      const { data, error } = await supabase
        .from("data_penawaran")
        .select(
          `
          *,
          data_user:id_user (
            nama_user,
            email_user,
            role_user
          )
        `
        )
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(
        `Gagal mengambil penawaran berdasarkan status: ${error.message}`
      );
    }
  }

  // Perbarui status penawaran (untuk persetujuan admin)
  static async updateStatus(id, status, catatan = null) {
    try {
      const updateData = { status };
      if (catatan) updateData.catatan = catatan;

      const { data, error } = await db.update("data_penawaran", updateData, {
        id_penawaran: id,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Gagal memperbarui status penawaran: ${error.message}`);
    }
  }

  // Perbarui discount penawaran (untuk admin)
  static async updateDiscount(id, discount, catatan = null) {
    try {
      console.log("🔧 PenawaranModel.updateDiscount called with:", {
        id,
        discount,
        catatan,
      });

      // Convert discount string to numeric value for database
      let numericDiscount;
      switch (discount) {
        case "0%":
          numericDiscount = 0;
          break;
        case "10%": // MB Niaga
          numericDiscount = 10;
          break;
        case "20%": // GM SBU
          numericDiscount = 20;
          break;
        default:
          // If it's already a number or percentage string, parse it
          numericDiscount =
            parseFloat(discount.toString().replace("%", "")) || 0;
      }

      console.log("🔧 Converted discount to numeric:", numericDiscount);

      const updateData = { diskon: numericDiscount };
      if (catatan) updateData.catatan = catatan;

      console.log("🔧 Update data object:", updateData);
      console.log("🔧 Where condition:", { id_penawaran: id });

      const { data, error } = await db.update("data_penawaran", updateData, {
        id_penawaran: id,
      });

      console.log("🔧 Database update result:", { data, error });

      if (error) {
        console.error("🔧 Database error:", error);
        throw error;
      }

      console.log("🔧 Update successful, returning data:", data);
      return data;
    } catch (error) {
      console.error("🔧 PenawaranModel.updateDiscount error:", error);
      throw new Error(`Gagal memperbarui discount penawaran: ${error.message}`);
    }
  }
}

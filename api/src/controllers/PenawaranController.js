import { PenawaranModel } from "../models/PenawaranModel.js";
import { PenawaranLayananModel } from "../models/PenawaranLayananModel.js";
import { PengeluaranModel } from "../models/PengeluaranModel.js";
import { HasilPenawaranModel } from "../models/HasilPenawaranModel.js";
import { LayananModel } from "../models/LayananModel.js";

// Helper function to calculate discounted tarif based on contract duration
const calculateDiscountedTarif = (originalTarif, durasiKontrak) => {
  if (!originalTarif || !durasiKontrak) return originalTarif;

  const tarif = parseFloat(originalTarif);
  const durasi = parseInt(durasiKontrak);

  let discountPercentage = 0;
  switch (durasi) {
    case 1:
      discountPercentage = 0; // No discount for 1 year
      break;
    case 2:
      discountPercentage = 28.0; // 28% discount for 2 years
      break;
    case 3:
      discountPercentage = 42.4; // 42.4% discount for 3 years
      break;
    case 4:
      discountPercentage = 48.16; // 48.16% discount for 4 years (precise calculation)
      break;
    case 5:
      discountPercentage = 50.23; // 50.23% discount for 5 years (precise calculation)
      break;
    default:
      discountPercentage = 0; // No discount for other durations
  }

  const discountedTarif = tarif * (1 - discountPercentage / 100);
  return Math.floor(discountedTarif); // Use Math.floor instead of Math.round for consistent results
};

export class PenawaranController {
  // Ambil semua penawaran
  static async getAllPenawaran(req, res) {
    try {
      console.log("📋 Getting penawaran for user:", req.user);
      let penawaran;

      // Jika user adalah sales, hanya tampilkan penawaran mereka sendiri
      if (req.user.role_user === "sales") {
        console.log(
          "👤 Sales user - getting own penawaran for ID:",
          req.user.id_user
        );
        penawaran = await PenawaranModel.getPenawaranByUser(req.user.id_user);
      } else if (
        req.user.role_user === "admin" ||
        req.user.role_user === "superAdmin"
      ) {
        // Admin dan SuperAdmin dapat melihat semua penawaran
        console.log("👑 Admin/SuperAdmin user - getting all penawaran");
        penawaran = await PenawaranModel.getAllPenawaran();
      } else {
        throw new Error("Role tidak dikenali");
      }

      console.log("✅ Retrieved penawaran:", penawaran?.length || 0, "records");

      res.status(200).json({
        success: true,
        message: "Data penawaran berhasil diambil",
        data: penawaran || [],
      });
    } catch (error) {
      console.error("❌ Error in getAllPenawaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data penawaran",
        error: error.message,
      });
    }
  }

  // Ambil penawaran berdasarkan ID dengan detail lengkap
  static async getPenawaranById(req, res) {
    try {
      const { id } = req.params;
      console.log("🔍 Getting penawaran by ID:", id);

      const penawaran = await PenawaranModel.getPenawaranById(id);

      if (!penawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      console.log("📊 Penawaran data retrieved:");
      console.log("  - Main data keys:", Object.keys(penawaran));
      console.log(
        "  - Has data_penawaran_layanan:",
        !!penawaran.data_penawaran_layanan
      );
      console.log(
        "  - Layanan data length:",
        penawaran.data_penawaran_layanan?.length
      );
      if (penawaran.data_penawaran_layanan?.length > 0) {
        console.log(
          "  - First layanan item:",
          penawaran.data_penawaran_layanan[0]
        );
      }

      // Cek apakah user sales hanya dapat mengakses penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        penawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat mengakses penawaran milik Anda sendiri.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Data penawaran berhasil diambil",
        data: penawaran,
      });
    } catch (error) {
      console.error("❌ Error in getPenawaranById:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data penawaran",
        error: error.message,
      });
    }
  }

  // Buat penawaran baru (Khusus Sales)
  static async createPenawaran(req, res) {
    try {
      console.log("📝 Received penawaran data:", req.body);
      console.log("👤 User info:", req.user);

      // Validasi input dasar
      const requiredFields = ["pelanggan", "nomorKontrak", "durasiKontrak"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Field yang wajib diisi: ${missingFields.join(", ")}`,
        });
      }

      const penawaranData = {
        ...req.body,
        id_user: req.user.id_user, // Set ID user dari user yang terautentikasi
        tanggal_dibuat:
          req.body.tanggal || new Date().toISOString().split("T")[0], // Set tanggal saat ini jika tidak ada
      };

      console.log("📋 Processed penawaran data:", penawaranData);

      const newPenawaran = await PenawaranModel.createPenawaran(penawaranData);

      console.log("📋 New penawaran created:", newPenawaran);

      // Extract ID from the created penawaran
      let penawaranId = null;
      if (Array.isArray(newPenawaran) && newPenawaran.length > 0) {
        penawaranId = newPenawaran[0].id_penawaran;
      } else if (newPenawaran && newPenawaran.id_penawaran) {
        penawaranId = newPenawaran.id_penawaran;
      } else if (newPenawaran && newPenawaran.data && newPenawaran.data[0]) {
        penawaranId = newPenawaran.data[0].id_penawaran;
      }

      console.log("📋 Extracted penawaran ID:", penawaranId);

      // Skip single layanan processing - now handled by multiple layanan items only
      console.log(
        "ℹ️ Single layanan processing skipped - using multiple layanan items instead"
      );

      // Handle multiple layanan items if provided
      if (
        penawaranId &&
        req.body.layananItems &&
        Array.isArray(req.body.layananItems) &&
        req.body.layananItems.length > 0
      ) {
        console.log(
          "🔧 Processing multiple layanan items:",
          req.body.layananItems.length
        );

        try {
          for (let i = 0; i < req.body.layananItems.length; i++) {
            const item = req.body.layananItems[i];
            console.log(`🔧 Processing layanan item ${i + 1}:`, item);

            // Skip if essential fields are missing
            if (
              !item.namaLayanan ||
              !item.detailLayanan ||
              !item.kapasitas ||
              !item.qty
            ) {
              console.log(
                `⚠️ Skipping layanan item ${i + 1} - missing essential fields`
              );
              continue;
            }

            // Find layanan in database by matching namaLayanan and detailLayanan
            const layananDetail = await LayananModel.getLayananByNameAndDetail(
              item.namaLayanan,
              item.detailLayanan,
              req.body.referensiHJT
            );

            if (!layananDetail) {
              console.log(`⚠️ Layanan not found for item ${i + 1}:`, {
                namaLayanan: item.namaLayanan,
                detailLayanan: item.detailLayanan,
                referensiHJT: req.body.referensiHJT,
              });
              continue;
            }

            console.log(
              `📊 Found layanan detail for item ${i + 1}:`,
              layananDetail
            );

            let tarifAksesTerbaru = layananDetail.tarif_akses;
            let tarifTerbaru = layananDetail.tarif;

            // Calculate discounted prices based on contract duration
            if (req.body.durasiKontrak) {
              // If akses existing is "ya", set tarif akses terbaru to null
              if (item.aksesExisting === "ya") {
                tarifAksesTerbaru = null;
                console.log(
                  `🔒 Item ${
                    i + 1
                  }: Akses existing = 'ya', setting tarif akses terbaru to null`
                );
              } else {
                tarifAksesTerbaru = calculateDiscountedTarif(
                  layananDetail.tarif_akses,
                  req.body.durasiKontrak
                );
                console.log(
                  `💰 Item ${i + 1}: Calculated tarif akses terbaru:`,
                  tarifAksesTerbaru
                );
              }

              tarifTerbaru = calculateDiscountedTarif(
                layananDetail.tarif,
                req.body.durasiKontrak
              );
              console.log(
                `💰 Item ${i + 1}: Calculated tarif terbaru:`,
                tarifTerbaru
              );
            }

            // Calculate Harga Dasar: ((Backbone + Port + Tarif (n tahun)) × Kapasitas + Tarif Akses (n tahun)) × QTY
            const calculateHargaDasar = () => {
              try {
                const backbone = parseFloat(layananDetail.backbone) || 0;
                const port = parseFloat(layananDetail.port) || 0;
                const tarifNTahun = parseFloat(tarifTerbaru) || 0;
                const kapasitas = parseFloat(item.kapasitas) || 0;
                const tarifAksesNTahun =
                  item.aksesExisting === "ya"
                    ? 0
                    : parseFloat(tarifAksesTerbaru) || 0;
                const qty = parseInt(item.qty) || 0;

                console.log(
                  `💰 Calculating Harga Dasar for ${item.namaLayanan}:`,
                  {
                    backbone,
                    port,
                    tarifNTahun,
                    kapasitas,
                    tarifAksesNTahun,
                    qty,
                    aksesExisting: item.aksesExisting,
                  }
                );

                // Formula: ((Backbone + Port + Tarif (n tahun)) × Kapasitas + Tarif Akses (n tahun)) × QTY
                const step1 = backbone + port + tarifNTahun;
                const step2 = step1 * kapasitas;
                const step3 = step2 + tarifAksesNTahun;
                const hargaDasar = step3 * qty;

                console.log(
                  `🧮 Harga Dasar calculation steps for ${item.namaLayanan}:`,
                  {
                    step1_BackbonePortTarif: step1,
                    step2_TimesKapasitas: step2,
                    step3_PlusTarifAkses: step3,
                    final_HargaDasar: hargaDasar,
                  }
                );

                return hargaDasar;
              } catch (error) {
                console.error(
                  `❌ Error calculating Harga Dasar for ${item.namaLayanan}:`,
                  error
                );
                return 0;
              }
            };

            const hargaDasarValue = calculateHargaDasar();

            // Calculate Harga Final: Harga Dasar + (Harga Dasar × Margin%)
            const calculateHargaFinal = () => {
              try {
                const hargaDasar = hargaDasarValue || 0;
                const marginPercent = parseFloat(item.marginPercent) || 0;

                console.log(
                  `💰 Calculating Harga Final for ${item.namaLayanan}:`,
                  {
                    hargaDasar,
                    marginPercent: `${marginPercent}%`,
                  }
                );

                // Formula: Harga Final = Harga Dasar + (Harga Dasar × Margin%)
                const marginAmount = hargaDasar * (marginPercent / 100);
                const hargaFinal = hargaDasar + marginAmount;

                console.log(
                  `🧮 Harga Final calculation for ${item.namaLayanan}:`,
                  {
                    hargaDasar,
                    marginPercent: `${marginPercent}%`,
                    marginAmount,
                    hargaFinal,
                    formula: `${hargaDasar} + (${hargaDasar} × ${marginPercent}%) = ${hargaFinal}`,
                  }
                );

                return hargaFinal;
              } catch (error) {
                console.error(
                  `❌ Error calculating Harga Final for ${item.namaLayanan}:`,
                  error
                );
                return hargaDasarValue || 0;
              }
            };

            const hargaFinalValue = calculateHargaFinal();

            const layananData = {
              id_penawaran: penawaranId,
              id_layanan: layananDetail.id_layanan,
              nama_layanan: item.namaLayanan,
              detail_layanan: item.detailLayanan,
              kapasitas: item.kapasitas,
              qty: parseInt(item.qty) || 1,
              akses_existing: item.aksesExisting || null,
              satuan: layananDetail.satuan,
              backbone: layananDetail.backbone,
              port: layananDetail.port,
              tarif_akses: layananDetail.tarif_akses,
              tarif: layananDetail.tarif,
              tarif_akses_terbaru: tarifAksesTerbaru,
              tarif_terbaru: tarifTerbaru,
              harga_dasar_icon: hargaDasarValue, // Save calculated harga dasar to database
              harga_final_sebelum_ppn: hargaFinalValue, // Save calculated harga final
              margin_percent: item.marginPercent
                ? parseFloat(item.marginPercent)
                : null, // Save margin per layanan item
            };

            console.log(
              `💰 Saving margin ${item.marginPercent}% for layanan item ${
                i + 1
              }: ${item.namaLayanan}`
            );

            console.log(
              `🔧 Layanan data to save for item ${i + 1}:`,
              layananData
            );

            const layananResult =
              await PenawaranLayananModel.createPenawaranLayanan(layananData);
            console.log(
              `✅ Layanan item ${i + 1} saved successfully:`,
              layananResult
            );
          }

          console.log("✅ All multiple layanan items processed successfully");
        } catch (layananItemsError) {
          console.error(
            "⚠️ Error processing multiple layanan items:",
            layananItemsError
          );
          console.error(
            "⚠️ LayananItems error stack:",
            layananItemsError.stack
          );
          // Don't fail the whole request if layanan processing fails, just log it
        }
      } else {
        console.log(
          "ℹ️ No multiple layanan items provided or missing penawaran ID"
        );
      }

      // Jika ada data pengeluaran lain-lain, simpan juga
      console.log("🔍 Checking pengeluaran fields:", {
        item: req.body.item,
        keterangan: req.body.keterangan,
        hasrat: req.body.hasrat,
        jumlah: req.body.jumlah,
      });

      if (
        req.body.item &&
        req.body.keterangan &&
        req.body.hasrat &&
        req.body.jumlah &&
        penawaranId
      ) {
        console.log("💰 Saving pengeluaran data for penawaran:", penawaranId);

        const pengeluaranData = {
          id_penawaran: penawaranId,
          item: req.body.item,
          keterangan: req.body.keterangan,
          harga_satuan: req.body.hasrat, // Mapping hasrat ke harga_satuan
          jumlah: parseInt(req.body.jumlah),
          // total_harga will be calculated by database as generated column
        };

        console.log("💰 Pengeluaran data to save:", pengeluaranData);

        try {
          const pengeluaranResult = await PengeluaranModel.createPengeluaran(
            pengeluaranData
          );
          console.log(
            "✅ Pengeluaran data saved successfully:",
            pengeluaranResult
          );
        } catch (pengeluaranError) {
          console.error("⚠️ Error saving pengeluaran data:", pengeluaranError);
          // Don't fail the whole request if pengeluaran fails, just log it
        }
      } else {
        console.log(
          "ℹ️ No pengeluaran data provided, incomplete fields, or no penawaran ID"
        );
        if (!penawaranId) {
          console.log("❌ Missing penawaran ID");
        }
      }

      res.status(201).json({
        success: true,
        message: "Penawaran berhasil dibuat",
        data: newPenawaran[0] || newPenawaran,
      });
    } catch (error) {
      console.error("❌ Error in createPenawaran:", error);
      console.error("❌ Error stack:", error.stack);

      // Check if it's a validation error or database error
      let statusCode = 500;
      let message = "Gagal membuat penawaran";

      if (
        error.message.includes("violates not-null constraint") ||
        error.message.includes("required") ||
        error.message.includes("wajib")
      ) {
        statusCode = 400;
        message = "Data tidak lengkap atau tidak valid";
      } else if (error.message.includes("duplicate key value")) {
        statusCode = 409;
        message = "Data dengan nomor kontrak yang sama sudah ada";
      }

      res.status(statusCode).json({
        success: false,
        message: message,
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  // Perbarui penawaran
  static async updatePenawaran(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate ID is a number
      const penawaranId = parseInt(id, 10);
      if (isNaN(penawaranId)) {
        return res.status(400).json({
          success: false,
          message: "ID penawaran tidak valid",
        });
      }

      console.log("🔄 =============== UPDATE PENAWARAN DEBUG ===============");
      console.log("🔄 Update penawaran ID:", penawaranId);
      console.log("📝 Raw request body keys:", Object.keys(updateData));
      console.log(
        "📝 Update data received:",
        JSON.stringify(updateData, null, 2)
      );
      console.log("📊 Update data analysis:");
      console.log("  1. Has layananItems:", !!updateData.layananItems);
      console.log("  2. LayananItems type:", typeof updateData.layananItems);
      console.log(
        "  3. LayananItems is array:",
        Array.isArray(updateData.layananItems)
      );
      console.log(
        "  4. LayananItems length:",
        updateData.layananItems?.length || 0
      );
      console.log("  5. LayananItems content:", updateData.layananItems);
      console.log(
        "  6. Has single layanan:",
        !!(updateData.namaLayanan && updateData.detailLayanan)
      );
      console.log("  7. referensiHJT:", updateData.referensiHJT);
      console.log("  8. hjtWilayah:", updateData.hjtWilayah);
      console.log("👤 User info:", req.user);
      console.log("🔄 ====================================================");

      const existingPenawaran = await PenawaranModel.getPenawaranById(
        penawaranId
      );
      if (!existingPenawaran) {
        console.error(`❌ Penawaran with ID ${penawaranId} not found`);
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      console.log("📋 Existing penawaran:", existingPenawaran);

      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat memperbarui penawaran milik Anda sendiri.",
        });
      }

      updateData.id_user = existingPenawaran.id_user;

      const requiredFields = ["pelanggan", "nomorKontrak", "durasiKontrak"];
      const missingFields = [];

      requiredFields.forEach((field) => {
        if (
          !updateData[field] &&
          !updateData[PenawaranController.getDbFieldName(field)]
        ) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Field yang wajib diisi: ${missingFields.join(", ")}`,
        });
      }

      const updatedPenawaran = await PenawaranModel.updatePenawaran(
        penawaranId,
        updateData
      );

      console.log("✅ Penawaran updated successfully:", updatedPenawaran);

      // Handle multiple layanan items update
      if (
        updateData.layananItems &&
        Array.isArray(updateData.layananItems) &&
        updateData.layananItems.length > 0
      ) {
        console.log(
          "✅ Multiple layanan items detected - proceeding with update"
        );
        console.log(
          "🔧 Processing multiple layanan items update:",
          updateData.layananItems.length
        );

        try {
          // First, delete existing layanan items for this penawaran
          const existingLayanan =
            await PenawaranLayananModel.getPenawaranLayananByPenawaranId(
              penawaranId
            );

          if (existingLayanan && existingLayanan.length > 0) {
            console.log(
              "🗑️ Deleting existing layanan items:",
              existingLayanan.length
            );
            for (const existing of existingLayanan) {
              await PenawaranLayananModel.deletePenawaranLayanan(
                existing.id_penawaran_layanan
              );
            }
          }

          // Then create new layanan items
          for (let i = 0; i < updateData.layananItems.length; i++) {
            const item = updateData.layananItems[i];
            console.log(`🔧 Processing layanan item ${i + 1}:`, item);

            if (!item.namaLayanan || !item.detailLayanan) {
              console.log(`⚠️ Skipping incomplete layanan item ${i + 1}`);
              continue;
            }

            // Find layanan from database to get pricing data
            let layananResult = null;
            try {
              console.log(`🔍 Searching layanan for item ${i + 1}:`, {
                namaLayanan: item.namaLayanan,
                detailLayanan: item.detailLayanan,
                wilayahHJT: updateData.referensiHJT || updateData.hjtWilayah,
              });

              layananResult = await LayananModel.getLayananByNameAndDetail(
                item.namaLayanan,
                item.detailLayanan,
                updateData.referensiHJT || updateData.hjtWilayah
              );

              if (!layananResult) {
                console.log(`❌ Layanan not found for item ${i + 1}`);
                console.log(
                  `❌ Search criteria: ${item.namaLayanan} - ${
                    item.detailLayanan
                  } - ${updateData.referensiHJT || updateData.hjtWilayah}`
                );
                throw new Error(
                  `Layanan tidak ditemukan untuk: ${item.namaLayanan} - ${
                    item.detailLayanan
                  } di wilayah ${
                    updateData.referensiHJT || updateData.hjtWilayah
                  }`
                );
              }

              console.log(
                `✅ Found layanan for item ${i + 1}:`,
                layananResult.id_layanan
              );
              console.log(`✅ Layanan details:`, layananResult);
            } catch (fetchError) {
              console.error(
                `❌ Error fetching layanan data for item ${i + 1}:`,
                fetchError
              );
              throw new Error(
                `Gagal mengambil data layanan untuk item ${i + 1}: ${
                  fetchError.message
                }`
              );
            }

            // Calculate discounted tarif based on contract duration
            let tarifAksesTerbaru = null;
            let tarifTerbaru = null;

            const originalTarifAkses = layananResult.tarif_akses;
            const originalTarif = layananResult.tarif;

            console.log(`💰 Original tarif data for item ${i + 1}:`, {
              originalTarifAkses,
              originalTarif,
              durasiKontrak: updateData.durasiKontrak,
              aksesExisting: item.aksesExisting,
            });

            // If akses existing is "ya", set tarif akses terbaru to null
            if (item.aksesExisting === "ya") {
              tarifAksesTerbaru = null;
              console.log(
                `🔒 Item ${
                  i + 1
                }: Akses existing = 'ya', setting tarif akses terbaru to null`
              );
            } else {
              tarifAksesTerbaru = calculateDiscountedTarif(
                originalTarifAkses,
                updateData.durasiKontrak
              );
              console.log(
                `💰 Item ${i + 1}: Calculated tarif akses terbaru:`,
                tarifAksesTerbaru
              );
            }

            tarifTerbaru = calculateDiscountedTarif(
              originalTarif,
              updateData.durasiKontrak
            );

            console.log(`💰 Final calculated tarif for item ${i + 1}:`, {
              tarifAksesTerbaru,
              tarifTerbaru,
            });

            // Calculate Harga Dasar for this item
            const calculateHargaDasar = () => {
              try {
                const backbone = parseFloat(layananResult.backbone) || 0;
                const port = parseFloat(layananResult.port) || 0;
                const tarifNTahun = parseFloat(tarifTerbaru) || 0;
                const kapasitas = parseFloat(item.kapasitas) || 0;
                const tarifAksesNTahun =
                  item.aksesExisting === "ya"
                    ? 0
                    : parseFloat(tarifAksesTerbaru) || 0;
                const qty = parseInt(item.qty) || 0;

                console.log(
                  `💰 Calculating Harga Dasar for item ${i + 1} (${
                    item.namaLayanan
                  }):`,
                  {
                    backbone,
                    port,
                    tarifNTahun,
                    kapasitas,
                    tarifAksesNTahun,
                    qty,
                    aksesExisting: item.aksesExisting,
                  }
                );

                // Formula: ((Backbone + Port + Tarif (n tahun)) × Kapasitas + Tarif Akses (n tahun)) × QTY
                const step1 = backbone + port + tarifNTahun;
                const step2 = step1 * kapasitas;
                const step3 = step2 + tarifAksesNTahun;
                const hargaDasar = step3 * qty;

                console.log(
                  `🧮 Harga Dasar calculation steps for item ${i + 1}:`,
                  {
                    step1_BackbonePortTarif: step1,
                    step2_TimesKapasitas: step2,
                    step3_PlusTarifAkses: step3,
                    final_HargaDasar: hargaDasar,
                  }
                );

                return hargaDasar;
              } catch (error) {
                console.error(
                  `❌ Error calculating Harga Dasar for item ${i + 1}:`,
                  error
                );
                return 0;
              }
            };

            const hargaDasarValue = calculateHargaDasar();

            // Calculate Harga Final for this item
            const calculateHargaFinal = () => {
              try {
                const hargaDasar = hargaDasarValue || 0;
                const marginPercent = parseFloat(item.marginPercent) || 0;

                console.log(
                  `  Calculating Harga Final for item ${i + 1} (${
                    item.namaLayanan
                  }):`,
                  {
                    hargaDasar,
                    marginPercent: `${marginPercent}%`,
                  }
                );

                // Formula: Harga Final = Harga Dasar + (Harga Dasar × Margin%)
                const marginAmount = hargaDasar * (marginPercent / 100);
                const hargaFinal = hargaDasar + marginAmount;

                console.log(`🧮 Harga Final calculation for item ${i + 1}:`, {
                  hargaDasar,
                  marginPercent: `${marginPercent}%`,
                  marginAmount,
                  hargaFinal,
                  formula: `${hargaDasar} + (${hargaDasar} × ${marginPercent}%) = ${hargaFinal}`,
                });

                return hargaFinal;
              } catch (error) {
                console.error(
                  `❌ Error calculating Harga Final for item ${i + 1}:`,
                  error
                );
                return hargaDasarValue || 0;
              }
            };

            const hargaFinalValue = calculateHargaFinal();

            const layananData = {
              id_penawaran: penawaranId,
              id_layanan: layananResult.id_layanan,
              nama_layanan: item.namaLayanan,
              detail_layanan: item.detailLayanan,
              kapasitas: item.kapasitas,
              qty: parseInt(item.qty) || 1,
              akses_existing: item.aksesExisting || null,
              satuan: layananResult.satuan,
              backbone: layananResult.backbone || null,
              port: layananResult.port || null,
              tarif_akses: layananResult.tarif_akses || null,
              tarif: layananResult.tarif || null,
              tarif_akses_terbaru: tarifAksesTerbaru,
              tarif_terbaru: tarifTerbaru,
              harga_dasar_icon: hargaDasarValue,
              harga_final_sebelum_ppn: hargaFinalValue,
              margin_percent: item.marginPercent
                ? parseFloat(item.marginPercent)
                : null,
            };

            console.log(
              `💰 Creating layanan item ${i + 1} with margin ${
                item.marginPercent
              }%:`,
              layananData
            );

            try {
              console.log(
                `💾 About to create layanan item ${i + 1} in database:`,
                layananData
              );
              const createResult =
                await PenawaranLayananModel.createPenawaranLayanan(layananData);
              console.log(
                `✅ Layanan item ${i + 1} created successfully:`,
                createResult
              );
            } catch (layananError) {
              console.error(
                `❌ Error creating layanan item ${i + 1}:`,
                layananError
              );
              console.error(`❌ Failed layanan data:`, layananData);
              console.error(`❌ Error details:`, layananError.stack);
              throw new Error(
                `Gagal membuat layanan item ${i + 1}: ${layananError.message}`
              );
            }
          }

          console.log("✅ All multiple layanan items updated successfully");
        } catch (layananItemsError) {
          console.error(
            "❌ Error processing multiple layanan items:",
            layananItemsError
          );
          console.error(
            "❌ LayananItems error stack:",
            layananItemsError.stack
          );
          console.error(
            "❌ Failed layanan items data:",
            updateData.layananItems
          );
          throw new Error(
            `Gagal memproses multiple layanan items: ${layananItemsError.message}`
          );
        }
      }
      // Fallback to single layanan update for backward compatibility
      else if (updateData.namaLayanan && updateData.detailLayanan) {
        console.log(
          "🔧 Processing single layanan update (backward compatibility)"
        );

        const existingLayanan =
          await PenawaranLayananModel.getPenawaranLayananByPenawaranId(
            penawaranId
          );

        let id_layanan = updateData.selectedLayananId;

        if (!id_layanan && existingLayanan && existingLayanan.length > 0) {
          id_layanan = existingLayanan[0].id_layanan;
        }

        let tarifAksesTerbaru = updateData.tarifAkses;
        let tarifTerbaru = updateData.tarif;

        try {
          // Fetch original tarif data from data_layanan table if we have layanan ID
          if (id_layanan && updateData.durasiKontrak) {
            const layananDetail = await LayananModel.getLayananById(id_layanan);
            console.log("📊 Fetched layanan detail for update:", layananDetail);

            if (layananDetail) {
              const originalTarifAkses = layananDetail.tarif_akses;
              const originalTarif = layananDetail.tarif;

              console.log("💰 Original tarif data for update:", {
                originalTarifAkses,
                originalTarif,
                durasiKontrak: updateData.durasiKontrak,
                aksesExisting: updateData.aksesExisting,
              });

              // Calculate discounted prices based on contract duration
              // If akses existing is "ya", set tarif akses terbaru to null
              if (updateData.aksesExisting === "ya") {
                tarifAksesTerbaru = null;
                console.log(
                  "🔒 Akses existing = 'ya', setting tarif akses terbaru to null"
                );
              } else {
                tarifAksesTerbaru = calculateDiscountedTarif(
                  originalTarifAkses,
                  updateData.durasiKontrak
                );
                console.log(
                  "💰 Akses existing = 'tidak', calculated tarif akses terbaru:",
                  tarifAksesTerbaru
                );
              }

              tarifTerbaru = calculateDiscountedTarif(
                originalTarif,
                updateData.durasiKontrak
              );

              console.log("💰 Final calculated tarif for update:", {
                tarifAksesTerbaru,
                tarifTerbaru,
              });
            }
          }
        } catch (fetchError) {
          console.error(
            "⚠️ Error fetching layanan detail for tarif calculation:",
            fetchError
          );
          // Continue with original values if fetch fails
        }

        // Calculate Harga Dasar: ((Backbone + Port + Tarif (n tahun)) × Kapasitas + Tarif Akses (n tahun)) × QTY
        const calculateHargaDasar = () => {
          try {
            const backbone = parseFloat(updateData.backbone) || 0;
            const port = parseFloat(updateData.port) || 0;
            const tarifNTahun = parseFloat(tarifTerbaru) || 0;
            const kapasitas = parseFloat(updateData.kapasitas) || 0;
            const tarifAksesNTahun =
              updateData.aksesExisting === "ya"
                ? 0
                : parseFloat(tarifAksesTerbaru) || 0;
            const qty = parseInt(updateData.qty) || 0;

            console.log(
              `💰 Calculating Harga Dasar for ${updateData.namaLayanan} (UPDATE):`,
              {
                backbone,
                port,
                tarifNTahun,
                kapasitas,
                tarifAksesNTahun,
                qty,
                aksesExisting: updateData.aksesExisting,
              }
            );

            // Formula: ((Backbone + Port + Tarif (n tahun)) × Kapasitas + Tarif Akses (n tahun)) × QTY
            const step1 = backbone + port + tarifNTahun;
            const step2 = step1 * kapasitas;
            const step3 = step2 + tarifAksesNTahun;
            const hargaDasar = step3 * qty;

            console.log(
              `🧮 Harga Dasar calculation steps for ${updateData.namaLayanan} (UPDATE):`,
              {
                step1_BackbonePortTarif: step1,
                step2_TimesKapasitas: step2,
                step3_PlusTarifAkses: step3,
                final_HargaDasar: hargaDasar,
              }
            );

            return hargaDasar;
          } catch (error) {
            console.error(
              `❌ Error calculating Harga Dasar for ${updateData.namaLayanan} (UPDATE):`,
              error
            );
            return 0;
          }
        };

        const hargaDasarValue = calculateHargaDasar();

        // Calculate Harga Final: Harga Dasar + (Harga Dasar × Margin%)
        const calculateHargaFinal = () => {
          try {
            const hargaDasar = hargaDasarValue || 0;
            const marginPercent = parseFloat(updateData.marginPercent) || 0;

            console.log(
              `💰 Calculating Harga Final for ${updateData.namaLayanan} (UPDATE):`,
              {
                hargaDasar,
                marginPercent: `${marginPercent}%`,
              }
            );

            // Formula: Harga Final = Harga Dasar + (Harga Dasar × Margin%)
            const marginAmount = hargaDasar * (marginPercent / 100);
            const hargaFinal = hargaDasar + marginAmount;

            console.log(
              `🧮 Harga Final calculation for ${updateData.namaLayanan} (UPDATE):`,
              {
                hargaDasar,
                marginPercent: `${marginPercent}%`,
                marginAmount,
                hargaFinal,
                formula: `${hargaDasar} + (${hargaDasar} × ${marginPercent}%) = ${hargaFinal}`,
              }
            );

            return hargaFinal;
          } catch (error) {
            console.error(
              `❌ Error calculating Harga Final for ${updateData.namaLayanan} (UPDATE):`,
              error
            );
            return hargaDasarValue || 0;
          }
        };

        const hargaFinalValue = calculateHargaFinal();

        const layananData = {
          id_penawaran: penawaranId,
          id_layanan: id_layanan,
          nama_layanan: updateData.namaLayanan,
          detail_layanan: updateData.detailLayanan,
          kapasitas: updateData.kapasitas,
          qty: parseInt(updateData.qty) || 1,
          akses_existing: updateData.aksesExisting || null,
          satuan: updateData.satuan,
          backbone: updateData.backbone || null,
          port: updateData.port || null,
          tarif_akses: updateData.tarifAkses || null,
          tarif: updateData.tarif || null,
          tarif_akses_terbaru: tarifAksesTerbaru,
          tarif_terbaru: tarifTerbaru,
          harga_dasar_icon: hargaDasarValue, // Add calculated harga dasar with correct column name
          harga_final_sebelum_ppn: hargaFinalValue, // Save calculated harga final
          margin_percent: updateData.marginPercent
            ? parseFloat(updateData.marginPercent)
            : null, // Save margin per layanan item
        };

        console.log(
          `💰 Updating margin ${updateData.marginPercent}% for layanan: ${updateData.namaLayanan}`
        );
        console.log("🔧 Layanan data to update:", layananData);

        try {
          if (existingLayanan && existingLayanan.length > 0) {
            const updateResult =
              await PenawaranLayananModel.updatePenawaranLayanan(
                existingLayanan[0].id_penawaran_layanan,
                layananData
              );
            console.log("✅ Layanan data updated successfully:", updateResult);
          } else {
            const createResult =
              await PenawaranLayananModel.createPenawaranLayanan(layananData);
            console.log("✅ Layanan data created successfully:", createResult);
          }
        } catch (layananError) {
          console.error("⚠️ Error updating layanan data:", layananError);
        }
      } else {
        console.log("ℹ️ No layanan data provided for update");
      }

      // Margin is now saved per layanan item in data_penawaran_layanan.margin_percent
      console.log(
        "ℹ️ Margin data migrated to data_penawaran_layanan.margin_percent"
      );

      res.status(200).json({
        success: true,
        message: "Penawaran berhasil diperbarui",
        data: updatedPenawaran[0] || updatedPenawaran,
      });
    } catch (error) {
      console.error("❌ Error in updatePenawaran:", error);
      console.error("❌ Stack trace:", error.stack);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));

      if (error.code) {
        console.error(`❌ Database error code: ${error.code}`);
      }
      if (error.details) {
        console.error(`❌ Error details: ${error.details}`);
      }

      if (error.message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
          error: error.message,
        });
      } else if (
        error.message.includes("violates") ||
        error.message.includes("constraint")
      ) {
        return res.status(400).json({
          success: false,
          message: "Data tidak valid untuk diperbarui",
          error: error.message,
        });
      } else if (
        error.message.includes("date/time") ||
        error.message.includes("out of range")
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Format tanggal tidak valid. Gunakan format DD/MM/YYYY atau YYYY-MM-DD.",
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Gagal memperbarui penawaran: " + error.message,
        error: error.message,
        details: error.details || error.stack,
      });
    }
  }

  // Helper function to convert frontend field names to database field names
  static getDbFieldName(frontendField) {
    const fieldMap = {
      pelanggan: "nama_pelanggan",
      nomorKontrak: "nomor_kontrak",
      kontrakTahunKe: "kontrak_tahun",
      referensiHJT: "wilayah_hjt",
      durasiKontrak: "durasi_kontrak",
      tanggal: "tanggal_dibuat",
      discount: "diskon",
    };

    return fieldMap[frontendField] || frontendField;
  }

  // Hapus penawaran
  static async deletePenawaran(req, res) {
    try {
      const { id } = req.params;

      console.log("🗑️ Delete penawaran ID:", id);
      console.log("👤 User info:", req.user);

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(id);
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      console.log("📋 Existing penawaran to delete:", existingPenawaran);

      // Sales hanya dapat menghapus penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat menghapus penawaran milik Anda sendiri.",
        });
      }

      await PenawaranModel.deletePenawaran(id);

      console.log("✅ Penawaran deleted successfully");

      res.status(200).json({
        success: true,
        message: "Penawaran berhasil dihapus",
      });
    } catch (error) {
      console.error("❌ Error in deletePenawaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus penawaran",
        error: error.message,
      });
    }
  }

  // Perbarui status penawaran (Khusus Admin)
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, catatan } = req.body;

      if (!["Menunggu", "Disetujui", "Ditolak"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status harus Menunggu, Disetujui, atau Ditolak",
        });
      }

      const updatedPenawaran = await PenawaranModel.updateStatus(
        id,
        status,
        catatan
      );

      if (!updatedPenawaran || updatedPenawaran.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Status penawaran berhasil diperbarui",
        data: updatedPenawaran[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui status penawaran",
        error: error.message,
      });
    }
  }

  // Perbarui discount penawaran (Khusus Admin)
  static async updateDiscount(req, res) {
    try {
      console.log("🎯 updateDiscount called");
      console.log("🎯 Request headers:", req.headers);
      console.log("🎯 Request params:", req.params);
      console.log("🎯 Request body:", req.body);
      console.log("🎯 Request body type:", typeof req.body);
      console.log("🎯 Request body stringified:", JSON.stringify(req.body));

      const { id } = req.params;
      const { discount, catatan } = req.body;

      console.log("🎯 Extracted values:", { id, discount, catatan });
      console.log("🎯 Discount type:", typeof discount);

      if (!discount) {
        console.log("❌ Discount validation failed: empty discount");
        return res.status(400).json({
          success: false,
          message: "Discount harus diisi",
        });
      }

      // Validasi nilai discount yang diizinkan
      const allowedDiscounts = ["0%", "10%", "20%"];
      console.log("🎯 Allowed discounts:", allowedDiscounts);
      console.log(
        "🎯 Is discount in allowed list?",
        allowedDiscounts.includes(discount)
      );

      if (!allowedDiscounts.includes(discount)) {
        console.log("❌ Discount validation failed: invalid value", discount);
        return res.status(400).json({
          success: false,
          message: "Discount harus 0%, 10%, atau 20%",
        });
      }

      console.log("🎯 About to call PenawaranModel.updateDiscount");
      const updatedPenawaran = await PenawaranModel.updateDiscount(
        id,
        discount,
        catatan || `Discount diubah menjadi ${discount} oleh Admin`
      );

      console.log("🎯 PenawaranModel.updateDiscount result:", updatedPenawaran);

      if (!updatedPenawaran || updatedPenawaran.length === 0) {
        console.log("❌ No penawaran found with id:", id);
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      // Convert discount percentage to numeric for response consistency
      let numericDiscount;
      switch (discount) {
        case "0%":
          numericDiscount = 0;
          break;
        case "10%":
          numericDiscount = 10;
          break;
        case "20%":
          numericDiscount = 20;
          break;
        default:
          numericDiscount =
            parseFloat(discount.toString().replace("%", "")) || 0;
      }

      console.log("✅ Discount updated successfully");
      res.status(200).json({
        success: true,
        message: "Discount penawaran berhasil diperbarui",
        data: {
          ...updatedPenawaran[0],
          diskon: numericDiscount, // Ensure we return the numeric value
        },
      });
    } catch (error) {
      console.error("❌ Error updating discount:", error);
      console.error("❌ Error stack:", error.stack);
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui discount penawaran",
        error: error.message,
      });
    }
  }

  // Ambil penawaran berdasarkan status
  static async getPenawaranByStatus(req, res) {
    try {
      const { status } = req.params;

      if (!["Menunggu", "Disetujui", "Ditolak"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status harus Menunggu, Disetujui, atau Ditolak",
        });
      }

      const penawaran = await PenawaranModel.getPenawaranByStatus(status);

      res.status(200).json({
        success: true,
        message: `Data penawaran dengan status ${status} berhasil diambil`,
        data: penawaran,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data penawaran berdasarkan status",
        error: error.message,
      });
    }
  }

  // Ambil hasil penawaran yang sudah dihitung
  static async getHasilPenawaran(req, res) {
    try {
      const { id } = req.params;

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(id);
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      // Sales hanya dapat melihat penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat melihat penawaran milik Anda sendiri.",
        });
      }

      // Ambil hasil penawaran yang sudah dihitung
      const hasilPenawaran =
        await HasilPenawaranModel.getHasilPenawaranByPenawaranId(id);

      if (!hasilPenawaran) {
        return res.status(404).json({
          success: false,
          message:
            "Hasil penawaran belum dihitung. Silakan hitung terlebih dahulu.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Hasil penawaran berhasil diambil",
        data: hasilPenawaran,
      });
    } catch (error) {
      console.error("❌ Error in getHasilPenawaran:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil hasil penawaran",
        error: error.message,
      });
    }
  }

  // Hitung hasil penawaran
  static async calculateResult(req, res) {
    try {
      const { id } = req.params;

      // Cek apakah penawaran ada dan user memiliki izin
      const existingPenawaran = await PenawaranModel.getPenawaranById(id);
      if (!existingPenawaran) {
        return res.status(404).json({
          success: false,
          message: "Penawaran tidak ditemukan",
        });
      }

      // Sales hanya dapat menghitung penawaran mereka sendiri
      if (
        req.user.role_user === "sales" &&
        existingPenawaran.id_user !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Anda hanya dapat menghitung penawaran milik Anda sendiri.",
        });
      }

      // Ambil layanan penawaran dan pengeluaran
      const layananList =
        await PenawaranLayananModel.getPenawaranLayananByPenawaranId(id);
      const pengeluaranList =
        await PengeluaranModel.getPengeluaranByPenawaranId(id);

      // Accept Total/Bulan values from frontend if provided
      let totalPerBulanHargaDasarIcon = 0;
      let totalPerBulanHargaFinalSebelumPPN = 0;

      // Check if frontend sends calculated totals
      if (
        req.body.totalPerBulanHargaDasar &&
        req.body.totalPerBulanHargaFinal
      ) {
        totalPerBulanHargaDasarIcon =
          parseFloat(req.body.totalPerBulanHargaDasar) || 0;
        totalPerBulanHargaFinalSebelumPPN =
          parseFloat(req.body.totalPerBulanHargaFinal) || 0;
        console.log("✅ Using Total/Bulan values from frontend:", {
          totalPerBulanHargaDasarIcon,
          totalPerBulanHargaFinalSebelumPPN,
        });
      } else {
        // Fallback: Calculate from layanan data
        console.log(
          "🔄 Calculating Total/Bulan from layanan data:",
          layananList.length,
          "items"
        );

        for (const layanan of layananList) {
          let hargaDasar = layanan.harga_dasar_icon;
          let hargaFinal = layanan.harga_final_sebelum_ppn;

          // If harga values are missing or 0, calculate them
          if (!hargaDasar || !hargaFinal) {
            console.log(
              `🔄 Calculating missing harga for layanan: ${layanan.nama_layanan}`
            );

            try {
              // Get layanan detail for calculation
              const layananDetail = await LayananModel.getLayananById(
                layanan.id_layanan
              );
              if (!layananDetail) {
                console.warn(
                  `⚠️ Layanan detail not found for ID: ${layanan.id_layanan}`
                );
                continue;
              }

              // Calculate discounted tarif based on contract duration
              let tarifAksesTerbaru = layananDetail.tarif_akses;
              let tarifTerbaru = layananDetail.tarif;

              if (existingPenawaran.durasi_kontrak) {
                if (layanan.akses_existing === "ya") {
                  tarifAksesTerbaru = null;
                } else {
                  tarifAksesTerbaru = calculateDiscountedTarif(
                    layananDetail.tarif_akses,
                    existingPenawaran.durasi_kontrak
                  );
                }

                tarifTerbaru = calculateDiscountedTarif(
                  layananDetail.tarif,
                  existingPenawaran.durasi_kontrak
                );
              }

              // Calculate Harga Dasar
              const backbone = parseFloat(layananDetail.backbone) || 0;
              const port = parseFloat(layananDetail.port) || 0;
              const tarifNTahun = parseFloat(tarifTerbaru) || 0;
              const kapasitas = parseFloat(layanan.kapasitas) || 0;
              const tarifAksesNTahun =
                layanan.akses_existing === "ya"
                  ? 0
                  : parseFloat(tarifAksesTerbaru) || 0;
              const qty = parseInt(layanan.qty) || 0;

              const step1 = backbone + port + tarifNTahun;
              const step2 = step1 * kapasitas;
              const step3 = step2 + tarifAksesNTahun;
              hargaDasar = step3 * qty;

              // Calculate Harga Final
              const marginPercent = parseFloat(layanan.margin_percent) || 0;
              const marginAmount = hargaDasar * (marginPercent / 100);
              hargaFinal = hargaDasar + marginAmount;

              console.log(`💰 Calculated for ${layanan.nama_layanan}:`, {
                hargaDasar,
                hargaFinal,
                marginPercent: `${marginPercent}%`,
              });

              // Update the layanan record with calculated values
              const layananId = layanan.id_penawaran_layanan || layanan.id;
              if (layananId) {
                await PenawaranLayananModel.updatePenawaranLayanan(layananId, {
                  harga_dasar_icon: hargaDasar,
                  harga_final_sebelum_ppn: hargaFinal,
                });
                console.log(
                  `✅ Updated harga values for layanan ID: ${layananId}`
                );
              } else {
                console.warn(
                  `⚠️ Could not find ID to update layanan: ${layanan.nama_layanan}`
                );
              }
            } catch (calcError) {
              console.error(
                `❌ Error calculating harga for ${layanan.nama_layanan}:`,
                calcError
              );
              hargaDasar = 0;
              hargaFinal = 0;
            }
          }

          totalPerBulanHargaDasarIcon += hargaDasar || 0;
          totalPerBulanHargaFinalSebelumPPN += hargaFinal || 0;
        }
      }

      // Hitung total 12 bulan
      const grandTotal12BulanHargaDasarIcon = totalPerBulanHargaDasarIcon * 12;
      const grandTotal12BulanHargaFinalSebelumPPN =
        totalPerBulanHargaFinalSebelumPPN * 12;

      // Hitung total pengeluaran
      const totalPengeluaranLainLain = pengeluaranList.reduce((total, item) => {
        return total + (item.total_harga || 0);
      }, 0);

      // Hitung diskon
      const discount = existingPenawaran.diskon || 0;
      const discountAmount =
        (grandTotal12BulanHargaFinalSebelumPPN * discount) / 100;

      // Hitung grand total dengan diskon dan pengeluaran
      const grandTotalDiscLain2HargaDasarIcon =
        grandTotal12BulanHargaDasarIcon -
        discountAmount -
        totalPengeluaranLainLain;
      const grandTotalDiscLain2HargaFinalSebelumPPN =
        grandTotal12BulanHargaFinalSebelumPPN -
        discountAmount -
        totalPengeluaranLainLain;

      // Hitung profit dan margin
      const profitDariHjtExclPPN =
        grandTotalDiscLain2HargaFinalSebelumPPN -
        grandTotalDiscLain2HargaDasarIcon;

      // Get margin from existing hasil_penawaran if available, otherwise calculate
      let marginDariHjt = 0;
      try {
        const existingHasil =
          await HasilPenawaranModel.getHasilPenawaranByPenawaranId(id);
        if (
          existingHasil &&
          existingHasil.margin_dari_hjt &&
          existingHasil.margin_dari_hjt > 0
        ) {
          marginDariHjt = parseFloat(existingHasil.margin_dari_hjt);
          console.log(
            "📊 Using existing margin from hasil_penawaran:",
            marginDariHjt
          );
        } else {
          // Fallback to calculated margin if no input margin found
          marginDariHjt =
            grandTotalDiscLain2HargaFinalSebelumPPN > 0
              ? (profitDariHjtExclPPN /
                  grandTotalDiscLain2HargaFinalSebelumPPN) *
                100
              : 0;
          console.log("📊 Using calculated margin (fallback):", marginDariHjt);
        }
      } catch (marginError) {
        console.log(
          "⚠️ Error getting existing margin, using calculated:",
          marginError
        );
        // Fallback to calculated margin
        marginDariHjt =
          grandTotalDiscLain2HargaFinalSebelumPPN > 0
            ? (profitDariHjtExclPPN / grandTotalDiscLain2HargaFinalSebelumPPN) *
              100
            : 0;
        console.log(
          "📊 Using calculated margin (error fallback):",
          marginDariHjt
        );
      }

      // Siapkan data hasil - hanya simpan 2 kolom yang diperlukan
      const hasilData = {
        total_per_bulan_harga_dasar_icon: totalPerBulanHargaDasarIcon,
        total_per_bulan_harga_final_sebelum_ppn:
          totalPerBulanHargaFinalSebelumPPN,
      };

      console.log(
        "💾 Saving only Total/Bulan data to hasil_penawaran:",
        hasilData
      );

      // Simpan atau perbarui hasil
      const result = await HasilPenawaranModel.createOrUpdateHasilPenawaran(
        id,
        hasilData
      );

      // Data lengkap untuk response frontend (tidak disimpan ke database)
      const responseData = {
        total_per_bulan_harga_dasar_icon: totalPerBulanHargaDasarIcon,
        total_per_bulan_harga_final_sebelum_ppn:
          totalPerBulanHargaFinalSebelumPPN,
        grand_total_12_bulan_harga_dasar_icon: grandTotal12BulanHargaDasarIcon,
        grand_total_12_bulan_harga_final_sebelum_ppn:
          grandTotal12BulanHargaFinalSebelumPPN,
        discount: discountAmount,
        total_pengeluaran_lain_lain: totalPengeluaranLainLain,
        grand_total_disc_lain2_harga_dasar_icon:
          grandTotalDiscLain2HargaDasarIcon,
        grand_total_disc_lain2_harga_final_sebelum_ppn:
          grandTotalDiscLain2HargaFinalSebelumPPN,
        profit_dari_hjt_excl_ppn: profitDariHjtExclPPN,
        margin_dari_hjt: marginDariHjt,
      };

      res.status(200).json({
        success: true,
        message: "Hasil penawaran berhasil dihitung",
        data: responseData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghitung hasil penawaran",
        error: error.message,
      });
    }
  }

  // Ambil statistik dashboard untuk SuperAdmin
  static async getDashboardStats(req, res) {
    try {
      console.log("📊 Getting dashboard stats for user:", req.user);

      // Hanya SuperAdmin dan Admin yang bisa mengakses
      if (
        req.user.role_user !== "superAdmin" &&
        req.user.role_user !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Akses ditolak. Hanya SuperAdmin dan Admin yang dapat mengakses statistik dashboard.",
        });
      }

      // Ambil semua penawaran untuk statistik
      const allPenawaran = await PenawaranModel.getAllPenawaran();

      // Hitung total penawaran
      const totalPenawaran = allPenawaran.length;

      // Hitung berdasarkan status
      const statusStats = {
        menunggu: 0,
        disetujui: 0,
        ditolak: 0,
      };

      // Hitung berdasarkan wilayah
      const wilayahStats = {
        "jawa-bali": 0,
        sumatra: 0,
        kalimantan: 0,
        sulawesi: 0,
        papua: 0,
        "nusa-tenggara": 0,
      };

      // Hitung berdasarkan sales
      const salesStats = {};

      // Hitung total nilai penawaran (estimasi)
      let totalNilaiPenawaran = 0;

      allPenawaran.forEach((penawaran) => {
        // Status statistics
        const status = penawaran.status?.toLowerCase();
        if (status === "menunggu" || status === "pending") {
          statusStats.menunggu++;
        } else if (status === "disetujui" || status === "approved") {
          statusStats.disetujui++;
        } else if (status === "ditolak" || status === "rejected") {
          statusStats.ditolak++;
        }

        // Wilayah statistics
        const wilayah = penawaran.wilayah_hjt;
        if (wilayahStats.hasOwnProperty(wilayah)) {
          wilayahStats[wilayah]++;
        }

        // Sales statistik
        const salesName = penawaran.data_user?.nama_user || "Unknown";
        salesStats[salesName] = (salesStats[salesName] || 0) + 1;

        // Estimasi nilai (jika ada harga_final)
        if (penawaran.harga_final) {
          totalNilaiPenawaran += parseFloat(penawaran.harga_final) || 0;
        }
      });

      const dashboardData = {
        totalPenawaran,
        statusStats,
        wilayahStats,
        salesStats,
        totalNilaiPenawaran,
        recentPenawaran: allPenawaran
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5), // 5 penawaran terbaru
        summary: {
          totalSales: Object.keys(salesStats).length,
          totalWilayah: Object.values(wilayahStats).filter((count) => count > 0)
            .length,
          avgNilaiPerPenawaran:
            totalPenawaran > 0 ? totalNilaiPenawaran / totalPenawaran : 0,
        },
      };

      console.log("✅ Dashboard stats calculated:", {
        totalPenawaran,
        totalSales: dashboardData.summary.totalSales,
        totalNilai: totalNilaiPenawaran,
      });

      res.status(200).json({
        success: true,
        message: "Statistik dashboard berhasil diambil",
        data: dashboardData,
      });
    } catch (error) {
      console.error("❌ Error in getDashboardStats:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil statistik dashboard",
        error: error.message,
      });
    }
  }
}

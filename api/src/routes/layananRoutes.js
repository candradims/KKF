import express from "express";
import { LayananController } from "../controllers/LayananController.js";
import { authenticate, adminOnly, adminOrSales } from "../middleware/auth.js";

const router = express.Router();

// Route publik untuk testing (tanpa autentikasi)
router.get("/public", LayananController.getAllLayanan);
router.post("/public", LayananController.createLayanan);
router.put("/public/:id", LayananController.updateLayanan);
router.delete("/public/:id", LayananController.deleteLayanan);

// Semua rute memerlukan autentikasi
router.use(authenticate);

// Rute yang dapat diakses oleh admin dan sales
router.get("/", adminOrSales, LayananController.getAllLayanan);
router.get("/:id", adminOrSales, LayananController.getLayananById);
router.get(
  "/wilayah/:wilayah",
  adminOrSales,
  LayananController.getLayananByWilayah
);

// Rute yang hanya dapat diakses oleh admin
router.post("/", adminOnly, LayananController.createLayanan);
router.put("/:id", adminOnly, LayananController.updateLayanan);
router.delete("/:id", adminOnly, LayananController.deleteLayanan);

export default router;

import express from "express";
import { PenawaranController } from "../controllers/PenawaranController.js";
import {
  authenticate,
  adminOnly,
  salesOnly,
  adminOrSales,
} from "../middleware/auth.js";

const router = express.Router();

// Semua rute memerlukan autentikasi
router.use(authenticate);

// Rute yang dapat diakses oleh admin dan sales
router.get("/", adminOrSales, PenawaranController.getAllPenawaran);
router.get(
  "/dashboard/stats",
  adminOnly,
  PenawaranController.getDashboardStats
);
router.get("/:id", adminOrSales, PenawaranController.getPenawaranById);
router.get(
  "/status/:status",
  adminOrSales,
  PenawaranController.getPenawaranByStatus
);

// Rute untuk membuat penawaran — dapat diakses oleh sales (membuat untuk diri sendiri) dan admin (membuat untuk siapa saja)
router.post("/", adminOrSales, PenawaranController.createPenawaran);
router.put("/:id", adminOrSales, PenawaranController.updatePenawaran);
router.delete("/:id", adminOrSales, PenawaranController.deletePenawaran);
router.get("/:id/hasil", adminOrSales, PenawaranController.getHasilPenawaran);
router.post(
  "/:id/calculate",
  adminOrSales,
  PenawaranController.calculateResult
);

// Rute yang hanya dapat diakses oleh admin
router.put("/:id/status", adminOnly, PenawaranController.updateStatus);
router.put("/:id/discount", adminOnly, PenawaranController.updateDiscount);

export default router;

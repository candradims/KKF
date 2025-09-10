import express from "express";
import { PengeluaranController } from "../controllers/PengeluaranController.js";
import { authenticate, adminOrSales } from "../middleware/auth.js";

const router = express.Router();

// Semua rute memerlukan autentikasi
router.use(authenticate);
router.use(adminOrSales);

// Test route untuk debugging
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Pengeluaran routes working",
    user: req.user,
    timestamp: new Date(),
  });
});

// Rute pengeluaran utama
router.get("/", PengeluaranController.getAllPengeluaran);
router.post("/", PengeluaranController.createPengeluaran);

// Rute pengeluaran berdasarkan penawaran
router.get(
  "/penawaran/:idPenawaran",
  PengeluaranController.getPengeluaranByPenawaranId
);
router.get(
  "/penawaran/:idPenawaran/total",
  PengeluaranController.getTotalPengeluaran
);
router.post(
  "/penawaran/:idPenawaran",
  PengeluaranController.addPengeluaranToPenawaran
);
router.post(
  "/penawaran/:idPenawaran/multiple",
  PengeluaranController.addMultiplePengeluaranToPenawaran
);
router.put("/:id", PengeluaranController.updatePengeluaran);
router.delete("/:id", PengeluaranController.deletePengeluaran);

export default router;

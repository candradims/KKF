import express from "express";
import { PenawaranLayananController } from "../controllers/PenawaranLayananController.js";
import { authenticate, adminOrSales } from "../middleware/auth.js";

const router = express.Router();

// Semua rute memerlukan autentikasi
router.use(authenticate);
router.use(adminOrSales);

// Rute layanan penawaran
router.get(
  "/penawaran/:idPenawaran",
  PenawaranLayananController.getPenawaranLayananByPenawaranId
);
router.post(
  "/penawaran/:idPenawaran",
  PenawaranLayananController.addLayananToPenawaran
);
router.post(
  "/penawaran/:idPenawaran/multiple",
  PenawaranLayananController.addMultipleLayananToPenawaran
);
router.put("/:id", PenawaranLayananController.updatePenawaranLayanan);
router.delete("/:id", PenawaranLayananController.deletePenawaranLayanan);

export default router;

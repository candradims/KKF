import express from "express";
import { AktivasiController } from "../controllers/AktivasiController.js";
import {
  authenticate,
  aktivasiOnly,
  adminOrSales,
} from "../middleware/auth.js";

const router = express.Router();

// Public endpoints (list & get)
router.get("/", AktivasiController.getAllAktivasi);
router.get("/:id", AktivasiController.getAktivasiById);
// Debug (dev only)
router.get("/debug/raw", AktivasiController.getRawAktivasi);

// Protected endpoints for admin (require authentication first)
router.post("/", authenticate, aktivasiOnly, AktivasiController.createAktivasi);
router.put(
  "/:id",
  authenticate,
  aktivasiOnly,
  AktivasiController.updateAktivasi
);
router.delete(
  "/:id",
  authenticate,
  aktivasiOnly,
  AktivasiController.deleteAktivasi
);
router.post(
  "/import",
  authenticate,
  aktivasiOnly,
  AktivasiController.importAktivasi
);

export default router;

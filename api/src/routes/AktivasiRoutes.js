import express from "express";
import { AktivasiController } from "../controllers/AktivasiController.js";
import { authenticate, adminOnly, adminOrSales } from "../middleware/auth.js";

const router = express.Router();

// Public endpoints (list & get)
router.get("/", AktivasiController.getAllAktivasi);
router.get("/:id", AktivasiController.getAktivasiById);
// Debug (dev only)
router.get("/debug/raw", AktivasiController.getRawAktivasi);

// Protected endpoints for admin
router.post("/", adminOnly, AktivasiController.createAktivasi);
router.put("/:id", adminOnly, AktivasiController.updateAktivasi);
router.delete("/:id", adminOnly, AktivasiController.deleteAktivasi);
router.post("/import", adminOnly, AktivasiController.importAktivasi);

export default router;

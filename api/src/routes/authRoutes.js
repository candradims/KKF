import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", AuthController.login);

// Protected routes
router.get("/profile", authenticate, AuthController.getProfile);

export default router;

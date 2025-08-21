import express from "express";
import { AdminController } from "../controllers/AdminController.js";
import { authenticate, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Semua rute admin memerlukan autentikasi dan role admin
router.use(authenticate);
router.use(adminOnly);

// Rute manajemen pengguna
router.get("/users", AdminController.getAllUsers);
router.get("/users/:id", AdminController.getUserById);
router.get("/users/role/:role", AdminController.getUsersByRole);
router.post("/users", AdminController.createUser);
router.put("/users/:id", AdminController.updateUser);
router.delete("/users/:id", AdminController.deleteUser);

export default router;

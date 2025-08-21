import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuthController } from './src/controllers/AuthController.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server API KKF sedang berjalan!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Basic API routes
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API dalam kondisi sehat",
    data: { status: "ok" },
  });
});

app.post("/api/auth/login", AuthController.login);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Kesalahan server internal",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Rute tidak ditemukan",
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 KKF API Server is running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
});

export default app;

import { UserModel } from "../models/UserModel.js";

// Middleware untuk autentikasi sederhana
export const authenticate = async (req, res, next) => {
  try {
    const { email_user, kata_sandi } = req.headers;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Email dan password diperlukan di headers",
      });
    }

    const user = await UserModel.getUserByEmail(email_user);

    if (!user || user.kata_sandi !== kata_sandi) {
      return res.status(401).json({
        success: false,
        message: "Email atau kata sandi salah",
      });
    }

    req.user = user;
    next();

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kesalahan autentikasi",
      error: error.message,
    });
  }
};

// Middleware untuk otorisasi role
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Pengguna belum terotentikasi",
        });
      }

      if (!allowedRoles.includes(req.user.role_user)) {
        return res.status(403).json({
          success: false,
          message: "Akses ditolak. Hak akses tidak mencukupi.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Kesalahan otorisasi",
        error: error.message,
      });
    }
  };
};

// Middleware khusus untuk admin
export const adminOnly = authorize(["admin"]);

// Middleware khusus untuk sales
export const salesOnly = authorize(["sales"]);

// Middleware untuk admin dan sales
export const adminOrSales = authorize(["admin", "sales"]);

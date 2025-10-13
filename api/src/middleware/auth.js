import { UserModel } from "../models/UserModel.js";

// Middleware untuk autentikasi sederhana
export const authenticate = async (req, res, next) => {
  try {
    console.log("🔐 Authentication middleware - Headers:", req.headers);

    // Express.js automatically converts headers to lowercase
    // But let's be safe and check both cases
    const userId = req.headers["x-user-id"] || req.headers["X-User-ID"];
    const userRole = req.headers["x-user-role"] || req.headers["X-User-Role"];
    const userEmail =
      req.headers["x-user-email"] || req.headers["X-User-Email"];

    console.log("🔍 Auth header values:", { userId, userRole, userEmail });

    if (!userId || !userRole || !userEmail) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication headers diperlukan (X-User-ID, X-User-Role, X-User-Email)",
      });
    }

    // Verify user exists in database
    const user = await UserModel.getUserById(parseInt(userId));

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Verify user role and email match
    console.log("🔍 Comparing user data:");
    console.log("  Database user object:", JSON.stringify(user, null, 2));
    console.log(
      "  Database role:",
      user.role_user,
      "(type:",
      typeof user.role_user,
      ")"
    );
    console.log("  Header role:", userRole, "(type:", typeof userRole, ")");
    console.log(
      "  Database email:",
      user.email_user,
      "(type:",
      typeof user.email_user,
      ")"
    );
    console.log("  Header email:", userEmail, "(type:", typeof userEmail, ")");
    console.log("  Role match:", user.role_user === userRole);
    console.log("  Email match:", user.email_user === userEmail);

    if (user.role_user !== userRole || user.email_user !== userEmail) {
      console.log("❌ Authentication mismatch detected!");
      console.log("❌ Mismatch details:");
      console.log("  - Role mismatch:", user.role_user !== userRole);
      console.log("  - Email mismatch:", user.email_user !== userEmail);
      return res.status(401).json({
        success: false,
        message: "Authentication data tidak valid",
      });
    }
    console.log("✅ Authentication successful for user:", user.email_user);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Authentication error:", error);
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
export const adminOnly = authorize(["admin", "superAdmin"]);

// Middleware khusus untuk sales
export const salesOnly = authorize(["sales"]);

// Middleware untuk admin dan sales
export const adminOrSales = authorize(["admin", "sales", "superAdmin"]);

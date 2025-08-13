import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Get user from token
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Not authorized, token expired" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Admin middleware - require admin role
export const admin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized, admin access required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Optional auth middleware - doesn't require authentication but adds user if available
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key"
        );
        const user = await User.findById(decoded.userId).select("-password");

        if (user && user.isActive) {
          req.userId = decoded.userId;
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't throw error for optional auth
      }
    }

    next();
  } catch (error) {
    next();
  }
};

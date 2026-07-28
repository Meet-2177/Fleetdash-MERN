import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// ===========================
// Logged-in User Profile
// ===========================
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

// ===========================
// Update Logged-in User Profile
// ===========================
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

// ===========================
// Get All Users
// Admin Only
// ===========================
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  getUsers
);

// ===========================
// Get User By ID
// Admin Only
// ===========================
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getUserById
);

// ===========================
// Update User
// Admin Only
// ===========================
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateUser
);

// ===========================
// Delete User
// Admin Only
// ===========================
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
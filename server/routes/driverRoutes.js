import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  assignVehicle,
} from "../controllers/driverController.js";

const router = express.Router();

// ======================================
// Create Driver (Admin & Manager)
// ======================================
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  createDriver
);

// ======================================
// Get All Drivers (All Logged-in Users)
// ======================================
router.get(
  "/",
  authMiddleware,
  getDrivers
);

// ======================================
// Get Driver By ID (All Logged-in Users)
// ======================================
router.get(
  "/:id",
  authMiddleware,
  getDriverById
);

// ======================================
// Update Driver (Admin & Manager)
// ======================================
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  updateDriver
);

// ======================================
// Assign Vehicle to Driver
// Admin & Manager
// ======================================
router.put(
  "/:id/assign-vehicle",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  assignVehicle
);

// ======================================
// Delete Driver (Admin Only)
// ======================================
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteDriver
);

export default router;
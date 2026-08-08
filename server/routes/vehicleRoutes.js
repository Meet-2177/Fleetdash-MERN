import express from "express";
import authMiddleware, { protect, adminOnly } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import { vehicleSchema } from "../validators/vehicleValidator.js";

import {
  createVehicle,
  getVehicles,
  getVehiclesForMap,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

// ==========================
// Create Vehicle
// Only Admin & Manager
// ==========================
router.post(
  "/",
  protect,
  adminOnly,
  validate(vehicleSchema),
  createVehicle
);

// ==========================
// Get All Vehicles
// All Logged-in Users
// ==========================
router.get(
  "/",
  authMiddleware,
  getVehicles
);

// ==========================
// Get Vehicle By ID
// All Logged-in Users
// ==========================

router.get(
  "/map",
  authMiddleware,
  getVehiclesForMap
);

router.get(
  "/:id",
  authMiddleware,
  getVehicleById
);

// ==========================
// Update Vehicle
// Only Admin & Manager
// ==========================
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  updateVehicle
);

// ==========================
// Delete Vehicle
// Only Admin
// ==========================
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteVehicle
);

export default router;
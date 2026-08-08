import express from "express";

import authMiddleware, {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import authorizeRoles from "../middleware/roleMiddleware.js";

import validate from "../middleware/validate.js";

import {
  createGeofence,
  getGeofences,
  getGeofenceById,
  updateGeofence,
  deleteGeofence,
  toggleGeofenceStatus,
} from "../controllers/geofenceController.js";

import {
  geofenceSchema,
} from "../validators/geofenceValidator.js";

const router = express.Router();

// ==========================================
// GET ALL GEOFENCES
// Admin / Manager / Driver
// ==========================================

router.get(
  "/",
  authMiddleware,
  getGeofences
);

// ==========================================
// GET GEOFENCE BY ID
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getGeofenceById
);

// ==========================================
// CREATE
// Admin / Manager
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("admin", "manager"),
  validate(geofenceSchema),
  createGeofence
);

// ==========================================
// UPDATE
// Admin / Manager
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  validate(geofenceSchema),
  updateGeofence
);

// ==========================================
// TOGGLE STATUS
// Admin / Manager
// ==========================================

router.patch(
  "/:id/toggle",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  toggleGeofenceStatus
);

// ==========================================
// DELETE
// Admin only
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteGeofence
);

export default router;
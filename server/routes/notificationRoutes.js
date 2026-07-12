import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// ======================================
// Create Notification
// Admin & Manager
// ======================================
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  createNotification
);

// ======================================
// Get All Notifications
// All Logged-in Users
// ======================================
router.get(
  "/",
  authMiddleware,
  getNotifications
);

// ======================================
// Mark Notification as Read
// ======================================
router.put(
  "/:id/read",
  authMiddleware,
  markAsRead
);

// ======================================
// Delete Notification
// Admin Only
// ======================================
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteNotification
);

export default router;
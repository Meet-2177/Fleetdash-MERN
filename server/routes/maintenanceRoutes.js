import express from "express";
import {
  addMaintenance,
  getMaintenances,
  getMaintenanceById,
  deleteMaintenance,
} from "../controllers/maintenanceController.js";

import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, addMaintenance);

router.get("/", protect, getMaintenances);

router.get("/:id", protect, getMaintenanceById);

router.delete("/:id", protect, adminOnly, deleteMaintenance);

export default router;
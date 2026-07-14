import express from "express";

import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/tripController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Trip
router.post("/", protect, adminOnly, createTrip);

// Get All Trips
router.get("/", protect, getTrips);

// Get Trip By ID
router.get("/:id", protect, getTripById);

// Update Trip
router.put("/:id", protect, adminOnly, updateTrip);

// Delete Trip
router.delete("/:id", protect, adminOnly, deleteTrip);

export default router;
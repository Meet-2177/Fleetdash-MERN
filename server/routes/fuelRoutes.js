import express from "express";
import {
  addFuel,
  getFuelEntries,
  getFuelById,
  deleteFuel,
} from "../controllers/fuelController.js";

import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, addFuel);

router.get("/", protect, getFuelEntries);

router.get("/:id", protect, getFuelById);

router.delete("/:id", protect, adminOnly, deleteFuel);

export default router;
import express from "express";
import {
    dashboardReport,
    fuelAnalysis,
    tripAnalysis
} from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, dashboardReport);
router.get(
    "/fuel-analysis",
    protect,
    fuelAnalysis
);

router.get(
    "/trip-analysis",
    protect,
    tripAnalysis
);
export default router;
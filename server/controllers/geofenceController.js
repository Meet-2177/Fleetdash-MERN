import Geofence from "../models/Geofence.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==========================================
// CREATE GEOFENCE
// ==========================================

export const createGeofence = asyncHandler(
  async (req, res) => {
    const {
      name,
      description,
      latitude,
      longitude,
      radius,
      status,
    } = req.body;

    const existingGeofence =
      await Geofence.findOne({ name });

    if (existingGeofence) {
      return res.status(400).json({
        success: false,
        message: "Geofence with this name already exists",
      });
    }

    const geofence = await Geofence.create({
      name,
      description,
      latitude,
      longitude,
      radius,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Geofence created successfully",
      geofence,
    });
  }
);

// ==========================================
// GET ALL GEOFENCES
// ==========================================

export const getGeofences = asyncHandler(
  async (req, res) => {
    const geofences = await Geofence.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      totalGeofences: geofences.length,
      geofences,
    });
  }
);

// ==========================================
// GET GEOFENCE BY ID
// ==========================================

export const getGeofenceById = asyncHandler(
  async (req, res) => {
    const geofence = await Geofence.findById(
      req.params.id
    );

    if (!geofence) {
      return res.status(404).json({
        success: false,
        message: "Geofence not found",
      });
    }

    res.status(200).json({
      success: true,
      geofence,
    });
  }
);

// ==========================================
// UPDATE GEOFENCE
// ==========================================

export const updateGeofence = asyncHandler(
  async (req, res) => {
    const geofence =
      await Geofence.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!geofence) {
      return res.status(404).json({
        success: false,
        message: "Geofence not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Geofence updated successfully",
      geofence,
    });
  }
);

// ==========================================
// DELETE GEOFENCE
// ==========================================

export const deleteGeofence = asyncHandler(
  async (req, res) => {
    const geofence =
      await Geofence.findByIdAndDelete(
        req.params.id
      );

    if (!geofence) {
      return res.status(404).json({
        success: false,
        message: "Geofence not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Geofence deleted successfully",
    });
  }
);

// ==========================================
// TOGGLE STATUS
// ==========================================

export const toggleGeofenceStatus =
  asyncHandler(async (req, res) => {
    const geofence =
      await Geofence.findById(req.params.id);

    if (!geofence) {
      return res.status(404).json({
        success: false,
        message: "Geofence not found",
      });
    }

    geofence.status =
      geofence.status === "Active"
        ? "Inactive"
        : "Active";

    await geofence.save();

    res.status(200).json({
      success: true,
      message: `Geofence ${
        geofence.status === "Active"
          ? "activated"
          : "deactivated"
      } successfully`,
      geofence,
    });
  });
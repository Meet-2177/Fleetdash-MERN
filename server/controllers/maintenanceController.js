import Maintenance from "../models/Maintenance.js";
import Vehicle from "../models/Vehicle.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==========================
// Add Maintenance Record
// ==========================
export const addMaintenance = asyncHandler(async (req, res) => {
  const {
    vehicle,
    serviceType,
    description,
    nextServiceDate,
    cost,
    workshop,
    status,
  } = req.body;

  // Check Vehicle
  const vehicleExists = await Vehicle.findById(vehicle);

  if (!vehicleExists) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
    });
  }

  // Create Maintenance Record
  const maintenance = await Maintenance.create({
    vehicle,
    serviceType,
    description,
    nextServiceDate,
    cost,
    workshop,
    status,
  });

  // ==========================
  // Create Notification
  // ==========================
  await Notification.create({
    title: "Vehicle Maintenance",
    message: `${vehicleExists.vehicleNumber} has been sent for ${serviceType}.`,
    type: "Maintenance",
    createdFor: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Maintenance Record Added Successfully",
    maintenance,
  });
});

// ==========================
// Get All Maintenance Records
// ==========================
export const getMaintenances = asyncHandler(async (req, res) => {
  const maintenances = await Maintenance.find()
    .populate("vehicle", "vehicleNumber brand model")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: maintenances.length,
    maintenances,
  });
});

// ==========================
// Get Maintenance By ID
// ==========================
export const getMaintenanceById = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id)
    .populate("vehicle", "vehicleNumber brand model");

  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: "Maintenance record not found",
    });
  }

  res.status(200).json({
    success: true,
    maintenance,
  });
});

// ==========================
// Delete Maintenance
// ==========================
export const deleteMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: "Maintenance record not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Maintenance Record Deleted Successfully",
  });
});
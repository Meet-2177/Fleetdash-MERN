import Fuel from "../models/Fuel.js";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==========================
// Add Fuel Entry
// ==========================
export const addFuel = asyncHandler(async (req, res) => {
  const {
    vehicle,
    driver,
    liters,
    pricePerLiter,
    odometer,
    fuelStation,
  } = req.body;

  // Check Vehicle
  const vehicleExists = await Vehicle.findById(vehicle);

  if (!vehicleExists) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
    });
  }

  // Check Driver
  const driverExists = await Driver.findById(driver);

  if (!driverExists) {
    return res.status(404).json({
      success: false,
      message: "Driver not found",
    });
  }

  // Calculate Total Cost
  const totalCost = liters * pricePerLiter;

  // Create Fuel Entry
  const fuel = await Fuel.create({
    vehicle,
    driver,
    liters,
    pricePerLiter,
    totalCost,
    odometer,
    fuelStation,
  });

  // ==========================
  // Create Notification
  // ==========================
  await Notification.create({
    title: "Fuel Added",
    message: `${liters} liters of fuel added to vehicle ${vehicleExists.vehicleNumber}.`,
    type: "Fuel",
    createdFor: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Fuel Entry Added Successfully",
    fuel,
  });
});

// ==========================
// Get All Fuel Entries
// ==========================
export const getFuelEntries = asyncHandler(async (req, res) => {
  const fuels = await Fuel.find()
    .populate("vehicle", "vehicleNumber brand")
    .populate("driver", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: fuels.length,
    fuels,
  });
});

// ==========================
// Get Fuel Entry By ID
// ==========================
export const getFuelById = asyncHandler(async (req, res) => {
  const fuel = await Fuel.findById(req.params.id)
    .populate("vehicle", "vehicleNumber brand")
    .populate("driver", "name");

  if (!fuel) {
    return res.status(404).json({
      success: false,
      message: "Fuel entry not found",
    });
  }

  res.status(200).json({
    success: true,
    fuel,
  });
});

// ==========================
// Delete Fuel Entry
// ==========================
export const deleteFuel = asyncHandler(async (req, res) => {
  const fuel = await Fuel.findByIdAndDelete(req.params.id);

  if (!fuel) {
    return res.status(404).json({
      success: false,
      message: "Fuel entry not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Fuel Entry Deleted Successfully",
  });
});
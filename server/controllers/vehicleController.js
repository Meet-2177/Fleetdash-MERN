import Vehicle from "../models/Vehicle.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==========================
// Create Vehicle
// ==========================
export const createVehicle = asyncHandler(async (req, res) => {
  const existingVehicle = await Vehicle.findOne({
    vehicleNumber: req.body.vehicleNumber,
  });

  if (existingVehicle) {
    return res.status(400).json({
      success: false,
      message: "Vehicle already exists",
    });
  }

  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    success: true,
    message: "Vehicle Added Successfully",
    vehicle,
  });
});

export const addVehicle = createVehicle;

// ==========================
// Get All Vehicles
// ==========================
export const getVehicles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const status = req.query.status || "";
  const sort = req.query.sort || "-createdAt";

  const skip = (page - 1) * limit;

  const query = {};

  if (search) {
    query.$or = [
      { vehicleNumber: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  const vehicles = await Vehicle.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalVehicles = await Vehicle.countDocuments(query);

  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages: Math.ceil(totalVehicles / limit),
    totalVehicles,
    vehicles,
  });
});

// ==========================
// Get Vehicles For Live Map
// ==========================
export const getVehiclesForMap = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({
    latitude: { $ne: null },
    longitude: { $ne: null },
  }).sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    totalVehicles: vehicles.length,
    vehicles,
  });
});

// ==========================
// Get Vehicle By ID
// ==========================
export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
    });
  }

  res.status(200).json({
    success: true,
    vehicle,
  });
});

// ==========================
// Update Vehicle
// ==========================
export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Vehicle Updated Successfully",
    vehicle,
  });
});

// ==========================
// Delete Vehicle
// ==========================
export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  res.status(200).json({
    success: true,
    message: "Vehicle Deleted Successfully",
  });
});
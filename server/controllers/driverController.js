import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==========================
// Create Driver
// ==========================
export const createDriver = asyncHandler(async (req, res) => {
  const existingDriver = await Driver.findOne({
    email: req.body.email,
  });

  if (existingDriver) {
    return res.status(400).json({
      success: false,
      message: "Driver already exists",
    });
  }

  const driver = await Driver.create(req.body);

  res.status(201).json({
    success: true,
    message: "Driver Added Successfully",
    driver,
  });
});

// ==========================
// Get All Drivers
// ==========================
export const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find().populate(
    "assignedVehicle",
    "vehicleNumber brand model status"
  );

  res.status(200).json({
    success: true,
    count: drivers.length,
    drivers,
  });
});

// ==========================
// Get Driver By ID
// ==========================
export const getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id).populate(
    "assignedVehicle",
    "vehicleNumber brand model status"
  );

  if (!driver) {
    return res.status(404).json({
      success: false,
      message: "Driver not found",
    });
  }

  res.status(200).json({
    success: true,
    driver,
  });
});

// ==========================
// Update Driver
// ==========================
export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!driver) {
    return res.status(404).json({
      success: false,
      message: "Driver not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Driver Updated Successfully",
    driver,
  });
});

// ==========================
// Delete Driver
// ==========================
export const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);

  if (!driver) {
    return res.status(404).json({
      success: false,
      message: "Driver not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Driver Deleted Successfully",
  });
});

// ==========================
// Assign Vehicle to Driver
// ==========================
export const assignVehicle = asyncHandler(async (req, res) => {
  const { vehicleId } = req.body;

  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    return res.status(404).json({
      success: false,
      message: "Driver not found",
    });
  }

  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
    });
  }

  driver.assignedVehicle = vehicle._id;
  await driver.save();

  res.status(200).json({
    success: true,
    message: "Vehicle Assigned Successfully",
    driver,
  });
});

// ==========================
// Upload Driver Photo
// ==========================
export const uploadDriverPhoto = asyncHandler(async (req, res) => {

    console.log("Controller reached");
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    const driver = await Driver.findById(req.params.id);

    if (!driver) {
        return res.status(404).json({
            success: false,
            message: "Driver not found",
        });
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No image uploaded",
        });
    }

    driver.photo = req.file.path;

    await driver.save();

    res.status(200).json({
        success: true,
        message: "Driver photo uploaded successfully",
        photo: driver.photo,
    });

});
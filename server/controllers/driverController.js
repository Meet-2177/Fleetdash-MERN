import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";

// =======================================
// Add Driver
// =======================================
export const createDriver = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      licenseNumber,
      experience,
      address,
      status,
      assignedVehicle,
    } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({
      $or: [
        { email },
        { phone },
        { licenseNumber }
      ]
    });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver already exists",
      });
    }

    const driver = await Driver.create({
      name,
      email,
      phone,
      licenseNumber,
      experience,
      address,
      status,
      assignedVehicle,
    });

    res.status(201).json({
      success: true,
      message: "Driver Added Successfully",
      driver,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Get All Drivers
// =======================================
export const getDrivers = async (req, res) => {
  try {

    const drivers = await Driver.find()
      .populate("assignedVehicle");

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Get Driver By ID
// =======================================
export const getDriverById = async (req, res) => {
  try {

    const driver = await Driver.findById(req.params.id)
      .populate("assignedVehicle");

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Update Driver
// =======================================
export const updateDriver = async (req, res) => {
  try {

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("assignedVehicle");

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Assign Vehicle to Driver
// =======================================

export const assignVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.body;

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Check if driver exists
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    driver.assignedVehicle = vehicleId;

    await driver.save();

    const updatedDriver = await Driver.findById(driver._id)
      .populate("assignedVehicle");

    res.status(200).json({
      success: true,
      message: "Vehicle Assigned Successfully",
      driver: updatedDriver,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Delete Driver
// =======================================
export const deleteDriver = async (req, res) => {
  try {

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
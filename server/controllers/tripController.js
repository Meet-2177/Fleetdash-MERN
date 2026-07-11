import Trip from "../models/Trip.js";
import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==========================
// Create Trip
// ==========================
export const createTrip = asyncHandler(async (req, res) => {

  const {
    driver,
    vehicle,
    source,
    destination,
    distance,
    cargo,
    status,
  } = req.body;

  // Check Driver
  const driverData = await Driver.findById(driver);

  if (!driverData) {
    return res.status(404).json({
      success: false,
      message: "Driver not found",
    });
  }

  // Check Vehicle
  const vehicleData = await Vehicle.findById(vehicle);

  if (!vehicleData) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
    });
  }

  // Driver Availability
  if (driverData.status !== "Available") {
    return res.status(400).json({
      success: false,
      message: "Driver is already on a trip",
    });
  }

  // Vehicle Availability
  if (vehicleData.status !== "Available") {
    return res.status(400).json({
      success: false,
      message: "Vehicle is already on a trip",
    });
  }

  const trip = await Trip.create({
    driver,
    vehicle,
    source,
    destination,
    distance,
    cargo,
    status,
    createdBy: req.user.id,
  });

  driverData.status = "On Trip";
  await driverData.save();

  vehicleData.status = "On Trip";
  await vehicleData.save();

  res.status(201).json({
    success: true,
    message: "Trip Created Successfully",
    trip,
  });

});

// ==========================
// Get All Trips
// ==========================
export const getTrips = asyncHandler(async (req, res) => {

  const trips = await Trip.find()
    .populate("driver", "name phone")
    .populate("vehicle", "vehicleNumber vehicleType")
    .populate("createdBy", "name email");

  res.status(200).json({
    success: true,
    count: trips.length,
    trips,
  });

});

// ==========================
// Get Trip By ID
// ==========================
export const getTripById = asyncHandler(async (req, res) => {

  const trip = await Trip.findById(req.params.id)
    .populate("driver", "name phone")
    .populate("vehicle", "vehicleNumber vehicleType")
    .populate("createdBy", "name email");

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found",
    });
  }

  res.status(200).json({
    success: true,
    trip,
  });

});

// ==========================
// Update Trip
// ==========================
export const updateTrip = asyncHandler(async (req, res) => {

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found",
    });
  }

  Object.assign(trip, req.body);

  if (req.body.status === "Completed") {

    const driver = await Driver.findById(trip.driver);
    const vehicle = await Vehicle.findById(trip.vehicle);

    if (driver) {
      driver.status = "Available";
      await driver.save();
    }

    if (vehicle) {
      vehicle.status = "Available";
      await vehicle.save();
    }

    trip.endTime = new Date();
  }

  await trip.save();

  res.status(200).json({
    success: true,
    message: "Trip Updated Successfully",
    trip,
  });

});

// ==========================
// Delete Trip
// ==========================
export const deleteTrip = asyncHandler(async (req, res) => {

  const trip = await Trip.findByIdAndDelete(req.params.id);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Trip Deleted Successfully",
  });

});
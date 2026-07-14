import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";

export const getDashboardStats = async (req, res) => {
  try {

    const totalVehicles = await Vehicle.countDocuments();

    const availableVehicles = await Vehicle.countDocuments({
      status: "Available",
    });

    const onTripVehicles = await Vehicle.countDocuments({
      status: "On Trip",
    });

    const totalDrivers = await Driver.countDocuments();

    const availableDrivers = await Driver.countDocuments({
      status: "Available",
    });

    const onTripDrivers = await Driver.countDocuments({
      status: "On Trip",
    });

    const totalTrips = await Trip.countDocuments();

    const pendingTrips = await Trip.countDocuments({
      status: "Pending",
    });

    const activeTrips = await Trip.countDocuments({
      status: "On Trip",
    });

    const completedTrips = await Trip.countDocuments({
      status: "Completed",
    });

    res.status(200).json({
      success: true,

      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        onTrip: onTripVehicles,
      },

      drivers: {
        total: totalDrivers,
        available: availableDrivers,
        onTrip: onTripDrivers,
      },

      trips: {
        total: totalTrips,
        pending: pendingTrips,
        active: activeTrips,
        completed: completedTrips,
      },

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
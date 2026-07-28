import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";
import Notification from "../models/Notification.js";
import Fuel from "../models/Fuel.js";
import Maintenance from "../models/Maintenance.js";

export const getDashboardStats = async (req, res) => {
  try {
    // ==========================
    // Vehicle Statistics
    // ==========================
    const totalVehicles = await Vehicle.countDocuments();

    const availableVehicles = await Vehicle.countDocuments({
      status: "Available",
    });

    const onTripVehicles = await Vehicle.countDocuments({
      status: "On Trip",
    });

    // ==========================
    // Driver Statistics
    // ==========================
    const totalDrivers = await Driver.countDocuments();

    const availableDrivers = await Driver.countDocuments({
      status: "Available",
    });

    const onTripDrivers = await Driver.countDocuments({
      status: "On Trip",
    });

    // ==========================
    // Trip Statistics
    // ==========================
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

    // ==========================
    // Fuel Statistics
    // ==========================
    const totalFuelRecords = await Fuel.countDocuments();

    const totalFuelCost = await Fuel.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalCost",
          },
        },
      },
    ]);

    // ==========================
    // Maintenance Statistics
    // ==========================
    const totalMaintenance = await Maintenance.countDocuments();

    const maintenanceCost = await Maintenance.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$cost",
          },
        },
      },
    ]);

    // ==========================
    // Recent Notifications
    // ==========================
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================
    // Recent Trips
    // ==========================
    const recentTrips = await Trip.find()
      .populate("driver", "name")
      .populate("vehicle", "vehicleNumber")
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================
    // Response
    // ==========================
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

      fuel: {
        totalRecords: totalFuelRecords,
        totalCost: totalFuelCost[0]?.total || 0,
      },

      maintenance: {
        totalRecords: totalMaintenance,
        totalCost: maintenanceCost[0]?.total || 0,
      },

      recentTrips,

      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
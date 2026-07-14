import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";
import Fuel from "../models/Fuel.js";
import Maintenance from "../models/Maintenance.js";
import asyncHandler from "../utils/asyncHandler.js";

// ====================================
// Dashboard Report
// ====================================
export const dashboardReport = asyncHandler(async (req, res) => {

    const totalVehicles = await Vehicle.countDocuments();

    const totalDrivers = await Driver.countDocuments();

    const totalTrips = await Trip.countDocuments();

    const completedTrips = await Trip.countDocuments({
        status: "Completed"
    });

    const pendingTrips = await Trip.countDocuments({
        status: "Pending"
    });

    const fuel = await Fuel.aggregate([
        {
            $group: {
                _id: null,
                totalFuelCost: {
                    $sum: "$totalCost"
                }
            }
        }
    ]);

    const maintenance = await Maintenance.aggregate([
        {
            $group: {
                _id: null,
                totalMaintenanceCost: {
                    $sum: "$cost"
                }
            }
        }
    ]);

    res.status(200).json({
        success: true,

        dashboard: {

            totalVehicles,

            totalDrivers,

            totalTrips,

            completedTrips,

            pendingTrips,

            totalFuelCost:
                fuel.length > 0
                    ? fuel[0].totalFuelCost
                    : 0,

            totalMaintenanceCost:
                maintenance.length > 0
                    ? maintenance[0].totalMaintenanceCost
                    : 0,
        },
    });

});

// ====================================
// Fuel Analysis
// ====================================
export const fuelAnalysis = asyncHandler(async (req, res) => {

    const report = await Fuel.aggregate([

        {
            $lookup: {
                from: "vehicles",
                localField: "vehicle",
                foreignField: "_id",
                as: "vehicle"
            }
        },

        {
            $unwind: "$vehicle"
        },

        {
            $group: {

                _id: "$vehicle.vehicleNumber",

                totalFuelCost: {
                    $sum: "$totalCost"
                },

                totalLiters: {
                    $sum: "$liters"
                },

                totalEntries: {
                    $sum: 1
                }

            }

        },

        {
            $sort: {
                totalFuelCost: -1
            }
        }

    ]);

    res.status(200).json({
        success: true,
        report
    });

});

// ====================================
// Trip Analysis
// ====================================
export const tripAnalysis = asyncHandler(async (req, res) => {

    const report = await Trip.aggregate([

        {
            $lookup: {
                from: "vehicles",
                localField: "vehicle",
                foreignField: "_id",
                as: "vehicle"
            }
        },

        {
            $unwind: "$vehicle"
        },

        {
            $group: {

                _id: "$vehicle.vehicleNumber",

                totalTrips: {
                    $sum: 1
                },

                totalDistance: {
                    $sum: "$distance"
                },

                completedTrips: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$status",
                                    "Completed"
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }

            }

        },

        {
            $sort: {
                totalTrips: -1
            }
        }

    ]);

    res.status(200).json({
        success: true,
        report
    });

});
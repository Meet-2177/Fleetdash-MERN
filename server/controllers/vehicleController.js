import Vehicle from "../models/Vehicle.js";

// ==========================
// Create Vehicle
// ==========================
export const createVehicle = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const addVehicle = createVehicle;

// ==========================
// Get All Vehicles
// ==========================
// ==========================
// Get All Vehicles
// ==========================
export const getVehicles = async (req, res) => {
    try {

        // Query Parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const status = req.query.status || "";
        const sort = req.query.sort || "-createdAt";

        const skip = (page - 1) * limit;

        // Search & Filter
        const query = {};

        if (search) {
            query.$or = [
                { vehicleNumber: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { model: { $regex: search, $options: "i" } }
            ];
        }

        if (status) {
            query.status = status;
        }

        // Database Queries
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

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ==========================
// Get Vehicle By ID
// ==========================
export const getVehicleById = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================
// Update Vehicle
// ==========================
export const updateVehicle = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================
// Delete Vehicle
// ==========================
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
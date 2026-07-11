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
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();

        res.status(200).json({
            success: true,
            count: vehicles.length,
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
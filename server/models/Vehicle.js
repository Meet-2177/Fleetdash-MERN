import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      required: true,
      enum: ["Car", "Truck", "Bus", "Bike", "Van"],
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "On Trip", "Maintenance"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Vehicle", vehicleSchema);
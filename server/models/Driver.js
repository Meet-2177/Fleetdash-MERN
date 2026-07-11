import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    address: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "On Trip", "Inactive"],
      default: "Available",
    },

    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
import mongoose from "mongoose";

const fuelSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },

    liters: {
      type: Number,
      required: true,
    },

    pricePerLiter: {
      type: Number,
      required: true,
    },

    totalCost: {
      type: Number,
      required: true,
    },

    odometer: {
      type: Number,
      required: true,
    },

    fuelStation: {
      type: String,
      required: true,
    },

    filledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Fuel", fuelSchema);
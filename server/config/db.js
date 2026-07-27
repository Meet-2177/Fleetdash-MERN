import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/fleetdash";

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      retryWrites: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("⚠️ MongoDB Connection Failed:", error.message);
    console.warn("⚠️ Continuing without MongoDB for now. API routes that require the database will remain unavailable until a connection is established.");
    return false;
  }
};

export default connectDB;
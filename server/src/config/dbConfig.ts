import mongoose from "mongoose";
export default mongoose;
/**
 * Connects to the MongoDB database using the provided URL.
 * @param {string} dbUrl - The MongoDB connection string.
 */
export const connectToDatabase = async (dbUrl: string): Promise<void> => {
  try {
    await mongoose.connect(dbUrl, {});
    console.log("✅ Connected to the database");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1); // Exit the process if the database connection fails
  }
};

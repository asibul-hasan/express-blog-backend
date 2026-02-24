import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function cleanTokens() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Connect to 'users' collection with strict: false to access fields not in schema
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

    // Remove legacy 'refreshTokens' arrays from all users
    const result = await User.updateMany(
      { refreshTokens: { $exists: true } }, 
      { $unset: { refreshTokens: 1 } }
    );

    console.log(`Cleaned up legacy refresh tokens from ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error("Error cleaning database:", error);
    process.exit(1);
  }
}

cleanTokens();

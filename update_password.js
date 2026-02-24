import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/user.model.js";

dotenv.config();

async function updatePassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "asibulhasan23@gmail.com";
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User ${email} not found!`);
      process.exit(1);
    }

    // Set new password (this will trigger the pre-save hook to hash it)
    user.password = "password123";
    await user.save();

    console.log(`Password for ${email} successfully updated to: password123`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating password:", error);
    process.exit(1);
  }
}

updatePassword();

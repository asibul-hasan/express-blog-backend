import mongoose from "mongoose";

const internProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "terminated"],
      default: "pending",
    },
    startDate: {
      type: Date,
    },
    certificateId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined to not break uniqueness
    },
  },
  { timestamps: true }
);

const InternProfile = mongoose.model("InternProfile", internProfileSchema);

export default InternProfile;

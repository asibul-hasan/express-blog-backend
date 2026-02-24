import mongoose from "mongoose";

const masterDomainTaskSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

const MasterDomainTask = mongoose.model("MasterDomainTask", masterDomainTaskSchema);

export default MasterDomainTask;

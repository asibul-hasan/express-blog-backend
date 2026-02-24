import mongoose from "mongoose";

const internTaskSubmissionSchema = new mongoose.Schema(
  {
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternProfile",
      required: true,
    },
    domainTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterDomainTask",
      required: true,
    },
    submissionUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "submitted", "approved", "rejected"],
      default: "pending",
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent an intern from having duplicate instances of the same task
internTaskSubmissionSchema.index({ internId: 1, domainTaskId: 1 }, { unique: true });

const InternTaskSubmission = mongoose.model("InternTaskSubmission", internTaskSubmissionSchema);

export default InternTaskSubmission;

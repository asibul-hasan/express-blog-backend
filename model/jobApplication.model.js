import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    coverLetter: { type: String },
    cvUrl: { type: String, required: true },

    interviewDateWithTime: {
      type: Date,
      validate: {
        validator: function (v) {
          if (["interviewed"].includes(this.isSelected)) {
            return v != null;
          }
          return true;
        },
        message: "Interview date is required for interviewed candidates",
      },
    },

    interviewMode: {
      type: String,
      enum: ["online", "offline", "hybrid", "phone", "video"],
      default: "online",
      validate: {
        validator: function (v) {
          if (["interviewed"].includes(this.isSelected)) {
            return v != null;
          }
          return true;
        },
        message: "Interview mode is required for interviewed candidates",
      },
    },

    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interviewed",
        "selected",
        "rejected",
        "offered",
        "on-hold",
        "withdrawn",
      ],
      default: "applied",
    },

    joiningDate: {
      type: Date,
      validate: {
        validator: function (v) {
          if (["selected", "offered"].includes(this.isSelected)) {
            return v != null;
          }
          return true;
        },
        message: "Joining date is required for selected/offered candidates",
      },
    },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;

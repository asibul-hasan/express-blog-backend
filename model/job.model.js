import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    employmentStatus: {
      type: String,
      required: true,
    }, // fulltime, parttime, contract, internship, temporary
    vacancy: {
      type: Number,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    workplace: {
      type: String,
      required: true,
    },
    des1: {
      type: String,
    },
    des2: {
      type: String,
    },
    des3: {
      type: String,
    },
  },
  { timestamps: true }
);
// title, location, job, description, employmentStatus, vacancy, salary, workplace;
const Job = mongoose.model("Job", jobSchema);

export default Job;

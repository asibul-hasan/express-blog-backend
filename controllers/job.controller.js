import mongoose from "mongoose";
import Job from "../model/job.model.js";

export const createJob = async (req, res) => {
  try {
    const category = await Job.create(req.body);
    res
      .status(201)
      .json({ body: category, message: "Job created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobList = async (req, res) => {
  try {
    const categoryList = await Job.find({});
    res
      .status(201)
      .json({ body: categoryList, message: "Job fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const { id } = req.params;
    let singleJob;

    // Check if the provided id is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      singleJob = await Job.findById(id);
    } else {
      singleJob = await Job.findOne({ slug: id });
    }

    if (!singleJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ body: singleJob, message: "Job fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(201).json({
      body: updatedJob,
      message: "Job updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(201).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

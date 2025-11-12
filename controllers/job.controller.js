import mongoose from "mongoose";
import Job from "../model/job.model.js";
import JobApplication from "../model/jobApplication.model.js";

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

export const getJobBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const job = await Job.findOne({ slug });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      body: job,
      message: "Job fetched successfully",
    });
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

export const applyForJob = async (req, res) => {
  try {
    const { jobId, fullName, email, phone, coverLetter, cvUrl } = req.body;

    // Validate required fields
    if (!jobId || !fullName || !email || !phone || !cvUrl) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Create job application
    const jobApplication = new JobApplication({
      jobId,
      fullName,
      email,
      phone,
      coverLetter,
      cvUrl,
    });

    const savedApplication = await jobApplication.save();

    // Return a more applicant-friendly response with job details
    const applicationResponse = {
      id: savedApplication._id,
      jobId: savedApplication.jobId,
      jobTitle: job.title,
      fullName: savedApplication.fullName,
      email: savedApplication.email,
      phone: savedApplication.phone,
      coverLetter: savedApplication.coverLetter,
      cvUrl: savedApplication.cvUrl,
      appliedAt: savedApplication.createdAt,
    };

    res.status(201).json({
      body: applicationResponse,
      message: `Application for ${job.title} submitted successfully with status: ${savedApplication.status}. We'll review your application and contact you soon.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.appliedAt;

    // Validate status transitions if status is being updated
    if (updates.status) {
      const validStatuses = [
        "applied",
        "shortlisted",
        "interviewed",
        "selected",
        "rejected",
        "offered",
        "on-hold",
        "withdrawn",
      ];

      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({
          message: `Invalid status. Valid statuses are: ${validStatuses.join(
            ", "
          )}`,
        });
      }
    }

    // Validate interview fields
    if (
      updates.status === "interviewed" &&
      (!updates.interviewDateWithTime || !updates.interviewMode)
    ) {
      return res.status(400).json({
        message:
          "Interview date and mode are required when status is set to interviewed",
      });
    }

    // Validate joining date for selected/offered candidates
    if (
      (updates.status === "selected" || updates.status === "offered") &&
      !updates.joiningDate
    ) {
      return res.status(400).json({
        message: "Joining date is required for selected/offered candidates",
      });
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("jobId", "title slug");

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      body: updatedApplication,
      message: `Application updated successfully. Current status: ${updatedApplication.status}`,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { jobId } = req.query;

    // If jobId is provided, filter applications by jobId
    const filter = jobId ? { jobId } : {};

    const applications = await JobApplication.find(filter)
      .populate("jobId", "title slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      body: applications,
      message: "Applications fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id).populate(
      "jobId",
      "title slug"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      body: application,
      message: "Application fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

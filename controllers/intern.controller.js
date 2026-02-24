import User from "../model/user.model.js";
import InternProfile from "../model/internProfile.model.js";
import MasterDomainTask from "../model/masterDomainTask.model.js";
import InternTaskSubmission from "../model/internTaskSubmission.model.js";
import crypto from "crypto";

// --- NOTE: Will implement nodemailer later in the module ---
// import nodemailer from "nodemailer";

// Generate a random secure password for the intern
const generateRandomPassword = () => {
  return crypto.randomBytes(6).toString("hex"); // e.g. a1b2c3d4e5f6
};

// ==========================================
// PUBLIC: Apply for Internship
// ==========================================
export const applyForInternship = async (req, res) => {
  try {
    const { name, email, phone, domain } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // 2. Generate secure password
    const generatedPassword = generateRandomPassword();

    // 3. Create User account with role 'intern'
    const newUser = await User.create({
      name,
      email,
      password: generatedPassword,
      role: "intern",
    });

    // 4. Create Intern Profile
    const internProfile = await InternProfile.create({
      userId: newUser._id,
      domain,
      phone,
      startDate: new Date(),
    });

    // 5. TODO: Send Email via Nodemailer (Implement properly when ready)
    console.log(`[SIMULATED EMAIL] Sent to: ${email}`);
    console.log(`[SIMULATED EMAIL] Subject: Welcome to InfoAidTech Internship!`);
    console.log(`[SIMULATED EMAIL] Body: Your password is ${generatedPassword}`);

    res.status(201).json({
      message: "Application submitted successfully! Please check your email for login credentials.",
      // In production we WOULD NOT send the password back here, but for testing:
      _dev_password: generatedPassword 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// INTERN: Get Dashboard Profile
// ==========================================
export const getMyInternProfile = async (req, res) => {
  try {
    const internProfile = await InternProfile.findOne({ userId: req.userId }).populate("userId", "name email avatar");
    
    if (!internProfile) {
      return res.status(200).json({ body: null, message: "Intern profile not found." });
    }

    res.status(200).json({
      body: internProfile,
      message: "Profile fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN: Get All Interns
// ==========================================
export const getAllInterns = async (req, res) => {
  try {
    const interns = await InternProfile.find()
      .populate("userId", "name email isActive")
      .sort({ createdAt: -1 });

    res.status(200).json({
      body: interns,
      message: "Interns fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// INTERN: Get My Tasks
// ==========================================
export const getMyTasks = async (req, res) => {
  try {
    const internProfile = await InternProfile.findOne({ userId: req.userId });
    if (!internProfile) {
      // If the user hasn't completed an intern profile, return an empty task list gracefully
      return res.status(200).json({ body: [], message: "No intern profile found. Tasks cannot be displayed." });
    }

    // Find all master tasks for this intern's domain
    const masterTasks = await MasterDomainTask.find({ domain: internProfile.domain }).sort('order');

    // Find all submissions by this intern
    const submissions = await InternTaskSubmission.find({ internId: internProfile._id });

    // Merge them into a single response payload so the frontend can display status
    const tasksWithStatus = masterTasks.map(task => {
      const submission = submissions.find(sub => sub.domainTaskId.equals(task._id));
      return {
        _id: task._id,
        title: task.title,
        description: task.description,
        order: task.order,
        status: submission ? submission.status : 'pending',
        submissionUrl: submission ? submission.submissionUrl : '',
        feedback: submission ? submission.feedback : ''
      };
    });

    res.status(200).json({
      body: tasksWithStatus,
      message: "Tasks fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// INTERN: Submit a Task
// ==========================================
export const submitTask = async (req, res) => {
  try {
    const { submissionUrl } = req.body;
    const { taskId } = req.params;

    const internProfile = await InternProfile.findOne({ userId: req.userId });
    if (!internProfile) {
      return res.status(404).json({ message: "Intern profile not found." });
    }

    // Verify task exists
    const masterTask = await MasterDomainTask.findById(taskId);
    if (!masterTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Create or update submission
    const submission = await InternTaskSubmission.findOneAndUpdate(
      { internId: internProfile._id, domainTaskId: taskId },
      { 
        submissionUrl, 
        status: 'submitted',
        feedback: '' // Reset feedback on resubmission
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      body: submission,
      message: "Task submitted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN: Get All Domain Tasks
// ==========================================
export const getAllDomainTasks = async (req, res) => {
  try {
    const tasks = await MasterDomainTask.find().sort('domain order');
    res.status(200).json({ body: tasks, message: "Domain tasks fetched" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN: Create Master Domain Task
// ==========================================
export const createDomainTask = async (req, res) => {
  try {
    const { domain, title, description, order } = req.body;

    const newTask = await MasterDomainTask.create({
      domain,
      title,
      description,
      order,
    });

    res.status(201).json({
      body: newTask,
      message: "Domain task created successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN: Review Task Submission
// ==========================================
export const reviewTaskSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, feedback } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const submission = await InternTaskSubmission.findByIdAndUpdate(
      submissionId,
      { status, feedback },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json({
      body: submission,
      message: `Submission ${status} successfully`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN: Update Intern Status
// ==========================================
export const updateInternStatus = async (req, res) => {
  try {
    const { internId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'active', 'completed', 'terminated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid intern status" });
    }

    const intern = await InternProfile.findByIdAndUpdate(
      internId,
      { status },
      { new: true }
    );

    if (!intern) {
       return res.status(404).json({ message: "Intern profile not found" });
    }

    res.status(200).json({
      body: intern,
      message: `Intern status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN: Get All Pending Submissions
// ==========================================
export const getAllPendingSubmissions = async (req, res) => {
  try {
    const submissions = await InternTaskSubmission.find({ status: 'submitted' })
      .populate({
        path: 'internId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('domainTaskId', 'title domain order')
      .sort({ updatedAt: 1 });

    res.status(200).json({
      body: submissions,
      message: "Pending submissions fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

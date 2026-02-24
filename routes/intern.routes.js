import express from "express";
import { applyForInternship, getMyInternProfile, getAllInterns, getMyTasks, submitTask, createDomainTask, getAllDomainTasks, reviewTaskSubmission, updateInternStatus, getAllPendingSubmissions } from "../controllers/intern.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const internRouter = express.Router();

/**
 * @swagger
 * /api/intern/apply:
 *   post:
 *     summary: Apply for an internship
 *     tags: [Internship]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - domain
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               domain:
 *                 type: string
 */
internRouter.post("/apply", applyForInternship);

/**
 * @swagger
 * /api/intern/me:
 *   get:
 *     summary: Get logged-in intern's profile
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 */
internRouter.get("/me", protect, getMyInternProfile);

/**
 * @swagger
 * /api/intern/my-tasks:
 *   get:
 *     summary: Get logged-in intern's assigned tasks
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 */
internRouter.get("/my-tasks", protect, getMyTasks);

/**
 * @swagger
 * /api/intern/submit-task/{taskId}:
 *   post:
 *     summary: Submit a task (Interns only)
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 */
internRouter.post("/submit-task/:taskId", protect, submitTask);

// ==========================================
// ADMIN ROUTES
// ==========================================

/**
 * @swagger
 * /api/intern/admin/all:
 *   get:
 *     summary: Get all interns (Admin only)
 *     tags: [Internship (Admin)]
 *     security:
 *       - bearerAuth: []
 */
internRouter.get("/admin/all", protect, admin, getAllInterns);

/**
 * @swagger
 * /api/intern/admin/domain-tasks:
 *   post:
 *     summary: Create a master task for a domain (Admin only)
 *     tags: [Internship (Admin)]
 *     security:
 *       - bearerAuth: []
 */
internRouter.post("/admin/domain-tasks", protect, admin, createDomainTask);
internRouter.get("/admin/domain-tasks", protect, admin, getAllDomainTasks);

/**
 * @swagger
 * /api/intern/admin/tasks/{submissionId}/review:
 *   patch:
 *     summary: Approve or Reject an intern's task submission (Admin only)
 *     tags: [Internship (Admin)]
 *     security:
 *       - bearerAuth: []
 */
internRouter.patch("/admin/tasks/:submissionId/review", protect, admin, reviewTaskSubmission);

/**
 * @swagger
 * /api/intern/admin/interns/{internId}/status:
 *   patch:
 *     summary: Update an intern's status (Admin only)
 *     tags: [Internship (Admin)]
 *     security:
 *       - bearerAuth: []
 */
internRouter.patch("/admin/interns/:internId/status", protect, admin, updateInternStatus);

/**
 * @swagger
 * /api/intern/admin/submissions/pending:
 *   get:
 *     summary: Get all pending task submissions (Admin only)
 *     tags: [Internship (Admin)]
 *     security:
 *       - bearerAuth: []
 */
internRouter.get("/admin/submissions/pending", protect, admin, getAllPendingSubmissions);

export default internRouter;

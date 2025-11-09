import express from "express";
import {
  createJob,
  getJobList,
  getJob,
  getJobBySlug,
  updateJob,
  deleteJob,
  applyForJob,
  getApplications,
  getApplicationById,
  updateApplication,
} from "../controllers/job.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const careerRouter = express.Router();

/**
 * @swagger
 * /api/career/jobs:
 *   get:
 *     summary: Get a list of jobs
 *     tags: [Careers]
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/job'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
careerRouter.get("/jobs", getJobList);

/**
 * @swagger
 * /api/career/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/job'
 *                 message:
 *                   type: string
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
careerRouter.get("/jobs/:id", getJob);

/**
 * @swagger
 * /api/career/get-job-by-slug/{slug}:
 *   get:
 *     summary: Get a job by slug
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Job slug
 *     responses:
 *       200:
 *         description: Job fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/job'
 *                 message:
 *                   type: string
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
careerRouter.get("/get-job-by-slug/:slug", getJobBySlug);

/**
 * @swagger
 * /api/career/jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Careers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: string
 *               requirements:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/job'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
careerRouter.post("/jobs", protect, admin, createJob);

/**
 * @swagger
 * /api/career/jobs/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: string
 *               requirements:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/job'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
careerRouter.put("/jobs/:id", protect, admin, updateJob);

/**
 * @swagger
 * /api/career/jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
careerRouter.delete("/jobs/:id", protect, admin, deleteJob);

/**
 * @swagger
 * /api/career/apply:
 *   post:
 *     summary: Apply for a job
 *     tags: [Careers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID of the job to apply for
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *               cvUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created successfully with 'applied' status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/jobApplication'
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: applied
 *       400:
 *         description: Bad request
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
careerRouter.post("/apply", applyForJob);

/**
 * @swagger
 * /api/career/applications:
 *   get:
 *     summary: Get all job applications
 *     tags: [Careers]
 *     parameters:
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *         description: Filter applications by job ID
 *     responses:
 *       200:
 *         description: Applications fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/jobApplication'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
careerRouter.get("/applications", protect, admin, getApplications);

/**
 * @swagger
 * /api/career/applications/{id}:
 *   get:
 *     summary: Get a job application by ID
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/jobApplication'
 *                 message:
 *                   type: string
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
careerRouter.get("/applications/:id", protect, admin, getApplicationById);

/**
 * @swagger
 * /api/career/applications/{id}:
 *   put:
 *     summary: Update a job application by ID
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isShortlisted:
 *                 type: boolean
 *               isInterviewed:
 *                 type: boolean
 *               interviewDateWithTime:
 *                 type: string
 *                 format: date-time
 *               interviewMode:
 *                 type: string
 *               isSelected:
 *                 type: boolean
 *               joiningDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/jobApplication'
 *                 message:
 *                   type: string
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
careerRouter.put("/applications/:id", protect, admin, updateApplication);

export default careerRouter;

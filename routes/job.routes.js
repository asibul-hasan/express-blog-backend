import express from "express";
import {
  createJob,
  getJobList,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const careerRouter = express.Router();

/**
 * @swagger
 * /api/career/create-job:
 *   post:
 *     summary: Create a new job
 *     tags: [Careers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/job'
 *     responses:
 *       201:
 *         description: job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/job'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
careerRouter.post("/create-job", protect, admin, createJob);

/**s
 * @swagger
 * /api/career/get-job-list:
 *   get:
 *     summary: Get all jobs
 *     tags: [Careers]
 *     responses:
 *       201:
 *         description: jobs fetched successfully
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
careerRouter.get("/get-job-list", getJobList);

/**
 * @swagger
 * /api/career/get-job/{id}:
 *   get:
 *     summary: Get a single job by ID
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: job ID
 *     responses:
 *       201:
 *         description: job fetched successfully
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
 *         description: job not found
 *       500:
 *         description: Internal server error
 */
careerRouter.get("/get-job/:id", getJob);

/**
 * @swagger
 * /api/career/edit-job/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/job'
 *     responses:
 *       201:
 *         description: job updated successfully
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
 *         description: job not found
 *       500:
 *         description: Internal server error
 */
careerRouter.put("/edit-job/:id", protect, admin, updateJob);

/**
 * @swagger
 * /api/career/delete-job/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: job ID
 *     responses:
 *       201:
 *         description: job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: job not found
 *       500:
 *         description: Internal server error
 */
careerRouter.delete("/delete-job/:id", protect, admin, deleteJob);

export default careerRouter;

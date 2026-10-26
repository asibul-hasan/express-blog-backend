import express from "express";
import { generateCommit } from "../controllers/commit-generator.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/commit-generator/generate:
 *   post:
 *     summary: Generate conventional commit message
 *     tags: [CommitGenerator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *                 example: "fixed the login button not working on mobile devices, refs #42"
 *               scope:
 *                 type: string
 *                 example: "auth"
 *               type:
 *                 type: string
 *                 example: "fix"
 *               breaking:
 *                 type: boolean
 *                 example: false
 *               issues:
 *                 type: string
 *                 example: "Fixes #42"
 *               useAi:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Commit generated successfully
 */
router.post("/generate", generateCommit);

export default router;

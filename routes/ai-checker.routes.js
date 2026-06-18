import express from "express";
import { checkAI } from "../controllers/ai-checker.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/ai-checker:
 *   post:
 *     summary: Analyze text to determine AI generation probability
 *     tags: [AI Checker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Analysis of text detailing AI vs Human percentages and highlighted segments.
 */
router.post("/", checkAI);

export default router;

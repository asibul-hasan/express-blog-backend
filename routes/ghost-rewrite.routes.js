import express from "express";
import { ghostRewrite } from "../controllers/ghost-rewrite.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/ghost-rewrite:
 *   post:
 *     summary: Humanize text to bypass AI detectors using Ghost Rewrite (Dual-Pass Streaming)
 *     tags: [Ghost Rewrite]
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
 *         description: Stream of heavily humanized text.
 */
router.post("/", ghostRewrite);

export default router;

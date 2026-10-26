import express from "express";
import { getAnalyticsOverview } from "../controllers/analytics.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Retrieve GA4 reader analytics overview
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: GA4 Analytics report or connection status
 */
router.get("/overview", getAnalyticsOverview);

export default router;

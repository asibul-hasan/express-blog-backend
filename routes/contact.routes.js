import express from "express";
import {
  submitContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contact.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const contactRouter = express.Router();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a new contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *               serviceInterest:
 *                 type: string
 *               message:
 *                 type: string
 *               companyUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 */
contactRouter.post("/", submitContactMessage);

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Get all contact messages (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (unread, read, replied, archived)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, subject, or message
 *     responses:
 *       200:
 *         description: List of contact messages
 */
contactRouter.get("/", protect, admin, getContactMessages);

/**
 * @swagger
 * /api/contact/{id}:
 *   get:
 *     summary: Get a contact message by ID (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact message details
 */
contactRouter.get("/:id", protect, admin, getContactMessageById);

/**
 * @swagger
 * /api/contact/{id}/status:
 *   patch:
 *     summary: Update contact message status (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [unread, read, replied, archived]
 *               adminNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 */
contactRouter.patch("/:id/status", protect, admin, updateContactMessageStatus);

/**
 * @swagger
 * /api/contact/{id}:
 *   delete:
 *     summary: Delete contact message (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 */
contactRouter.delete("/:id", protect, admin, deleteContactMessage);

export default contactRouter;

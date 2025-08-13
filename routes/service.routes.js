import express from "express";
import {
  createService,
  getServiceList,
  getService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const serviceRouter = express.Router();

/**
 * @swagger
 * /api/create-service:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/Service'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
serviceRouter.post("/create-service", createService);

/**
 * @swagger
 * /api/get-service-list:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Services fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
serviceRouter.get("/get-service-list", getServiceList);

/**
 * @swagger
 * /api/get-service/{id}:
 *   get:
 *     summary: Get a single service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/Service'
 *                 message:
 *                   type: string
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
serviceRouter.get("/get-service/:id", getService);

/**
 * @swagger
 * /api/edit-service/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/Service'
 *                 message:
 *                   type: string
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
serviceRouter.put("/edit-service/:id", updateService);

/**
 * @swagger
 * /api/delete-service/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
serviceRouter.delete("/delete-service/:id", deleteService);

export default serviceRouter;

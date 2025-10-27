import express from "express";
import {
  createCategory,
  getCategoryList,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const categoryRouter = express.Router();

/**
 * @swagger
 * /api/category/create-category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
categoryRouter.post("/create-category", protect, admin, createCategory);

/**
 * @swagger
 * /api/category/get-category-list:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       201:
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
categoryRouter.get("/get-category-list", getCategoryList);

/**
 * @swagger
 * /api/category/get-category/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       201:
 *         description: Category fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
categoryRouter.get("/get-category/:id", getCategory);

/**
 * @swagger
 * /api/category/edit-category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
categoryRouter.put("/edit-category/:id", protect, admin, updateCategory);

/**
 * @swagger
 * /api/category/delete-category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       201:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
categoryRouter.delete("/delete-category/:id", protect, admin, deleteCategory);

export default categoryRouter;

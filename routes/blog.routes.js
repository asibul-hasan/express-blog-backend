import express from "express";
import {
  createBlog,
  getBlogList,
  getBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const blogRouter = express.Router();

/**
 * @swagger
 * /api/blog/create-blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/Blog'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
blogRouter.post("/create-blog", protect, createBlog);

/**
 * @swagger
 * /api/blog/get-blog-list:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blogs]
 *     responses:
 *       201:
 *         description: Blogs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
blogRouter.get("/get-blog-list", getBlogList);

/**
 * @swagger
 * /api/blog/get-blog/{id}:
 *   get:
 *     summary: Get a single blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       201:
 *         description: Blog fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/Blog'
 *                 message:
 *                   type: string
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
blogRouter.get("/get-blog/:id", getBlog);

/**
 * @swagger
 * /api/blog/edit-blog/{id}:
 *   put:
 *     summary: Update a blog post
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       201:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   $ref: '#/components/schemas/Blog'
 *                 message:
 *                   type: string
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
blogRouter.put("/edit-blog/:id", protect, updateBlog);

/**
 * @swagger
 * /api/blog/delete-blog/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       201:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
blogRouter.delete("/delete-blog/:id", protect, deleteBlog);

export default blogRouter;

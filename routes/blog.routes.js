import express from "express";
import {
  createBlog,
  getBlogList,
  getBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { swaggerDocs } from "./swagger.js"; // import Swagger setup

const blogRouter = express.Router();
swaggerDocs(blogRouter);

/**
 * @swagger
 * /api/get-blog-list:
 *   post:
 *     summary: Create a new blog post
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       500:
 *         description: Internal server error
 *     params:
 */
blogRouter.post("/create-blog", createBlog);
// get blog list
/**
 * @swagger
 * /api/get-blog/:id:
 *   post:
 *     summary: Get a single blog post using id
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       500:
 *         description: Internal server error
 *     params:
 */
blogRouter.get("/get-blog-list", getBlogList);
// get single blog
/**
 * @swagger
 * /api/edit-blog/:id:
 *   post:
 *     summary: Get a single blog post using id
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       500:
 *         description: Internal server error
 *     params:
 */
blogRouter.get("/get-blog/:id", getBlog);
/**
 * @swagger
 * /api/edit-blog/:id:
 *   post:
 *     summary: Get a single blog post using id
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       500:
 *         description: Internal server error
 *     params:
 */
// update blog
blogRouter.put("/edit-blog/:id", updateBlog);
/**
 * @swagger
 * /api/create-blog:
 *   post:
 *     summary: Create a new blog post
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       500:
 *         description: Internal server error
 *     params:
 */
// delete blog
blogRouter.delete("/delete-blog/:id", deleteBlog);

export default blogRouter;

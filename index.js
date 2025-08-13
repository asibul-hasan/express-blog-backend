// index.js

// Import required modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import Mongoose models
import Blog from "./model/blog.model.js";
import Category from "./model/category.model.js";
import blogRouter from "./routes/blog.routes.js";
import categoryRouter from "./routes/category.routes.js";
import serviceRouter from "./routes/service.routes.js";
import authRouter from "./routes/auth.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
// Import Swagger setup
import { swaggerDocs } from "./routes/swagger.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Initialize Swagger docs
swaggerDocs(app);
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Docs",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Path to your route files with Swagger comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Set up PORT and MongoDB URI from environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
// const __base_url__ = process.env.BASE_URL || "http://localhost:3000";

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Hello World"
 */
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Auth routing
app.use("/api/auth", authRouter);

// Blog routing
app.use("/api/blog", blogRouter);

// Category routing
app.use("/api/category", categoryRouter);

// Service routing
app.use("/api/service", serviceRouter);

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start Express server once DB connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(
        `📚 Swagger documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
  });

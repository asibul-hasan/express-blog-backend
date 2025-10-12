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
 *       201:
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
// --- CORS Setup: allow only infoaidtech.net, subdomains, and localhost ---
const allowedOrigins = [
  /^https?:\/\/([a-z0-9-]+\.)*infoaidtech\.net(:\d+)?$/i, // infoaidtech.net + subdomains
  /^https?:\/\/localhost(:\d+)?$/i, // localhost + any port
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((pattern) => pattern.test(origin));
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked request from origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you use cookies or authentication tokens
  })
);

// app.use(
//   cors({
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

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

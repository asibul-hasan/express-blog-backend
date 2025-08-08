// index.js

// Import required modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import Mongoose models
import Blog from "./model/blog.model.js";
import Category from "./model/category.model.js";
import blogRouter from "./routes/blog.routes.js";

// ... other imports
import { swaggerDocs } from "./routes/swagger.js"; // import Swagger setup

// ... Express config

// Initialize Swagger docs

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
swaggerDocs(app);

// Set up PORT and MongoDB URI from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const __base_url__ = process.env.BASE_URL;

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route (basic test endpoint)
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route to create a new category
app.post("/create-category", async (req, res) => {
  try {
    // Create category from request body
    const category = await Category.create(req.body);
    res.status(201).json(category); // Respond with created category and 201 status
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Generic error response
  }
});

//blog routing
app.use("/api", blogRouter);

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start Express server once DB connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${__base_url__}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
  });

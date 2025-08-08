// swagger.js

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();
const __base_url__ = process.env.BASE_URL;

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "0.0.0",
      description: "API documentation for the Blog app",
    },
    servers: [
      {
        url: `${__base_url__}`, // Update if you're using a different port or URL
      },
    ],
  },
  // Paths to files containing OpenAPI definitions (this includes your route docs)
  apis: ["./blog.routes.js", "../controllers/blog.controller.js"], // You can include other route files as needed
};

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJsdoc(options);

// Export the Swagger middleware
export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

// swagger.js

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();
const __base_url__ = process.env.BASE_URL || "http://localhost:5000";

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "API documentation for the Blog application",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: __base_url__,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Blog: {
          type: "object",
          properties: {
            metaTitle: {
              type: "string",
              description: "Meta title for SEO",
            },
            metaDescription: {
              type: "string",
              description: "Meta description for SEO",
            },
            title: {
              type: "string",
              description: "Blog title",
              required: true,
            },
            content: {
              type: "string",
              description: "Blog content",
              required: true,
            },
            author: {
              type: "string",
              description: "Blog author",
            },
            isPublished: {
              type: "boolean",
              description: "Publication status",
              default: false,
            },
            category: {
              type: "array",
              description: "Category id (MongoDB ObjectId), ref: Category",
              example: "64ef1d2c8f9b1a23c4567890",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Blog tags",
            },
            image: {
              type: "string",
              description: "Blog image URL",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Category name",
              required: true,
            },
          },
        },
        Service: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Service title",
              required: true,
            },
            description: {
              type: "string",
              description: "Service description",
              required: true,
            },
            imageUrl: {
              type: "string",
              description: "Service image URL",
              required: true,
            },
          },
        },
        User: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "User's full name",
              required: true,
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
              required: true,
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user",
              description: "User's role",
            },
            isActive: {
              type: "boolean",
              default: true,
              description: "User account status",
            },
            avatar: {
              type: "string",
              description: "User's avatar URL",
            },
          },
        },
        jobApplication: {
          type: "object",
          properties: {
            jobId: {
              type: "string",
              description: "ID of the job applied for",
            },
            fullName: {
              type: "string",
              description: "Applicant's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "Applicant's email address",
            },
            phone: {
              type: "string",
              description: "Applicant's phone number",
            },
            coverLetter: {
              type: "string",
              description: "Applicant's cover letter",
            },
            cvUrl: {
              type: "string",
              description: "URL to applicant's CV",
            },
          },
        },
      },
    },
  },
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js", "./controllers/*.js"], // Updated paths
};

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJsdoc(options);

// Export the Swagger middleware
export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

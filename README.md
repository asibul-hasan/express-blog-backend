# Blog API

This is the backend API for a blog application, providing functionalities for managing blog posts, categories, services, and user authentication.

## Features

- User registration and authentication (JWT-based)
- User profile management
- Password change and recovery
- Admin and user roles
- CRUD operations for blog posts
- CRUD operations for categories
- CRUD operations for services
- API documentation with Swagger

## Project Structure

```
.
├── controllers
│   ├── auth.controller.js
│   ├── blog.controller.js
│   ├── category.controller.js
│   ├── job.controller.js
│   └── service.controller.js
├── middleware
│   └── auth.middleware.js
├── models
│   ├── blog.model.js
│   ├── category.model.js
│   ├── job.model.js
│   ├── service.model.js
│   └── user.model.js
├── routes
│   ├── auth.routes.js
│   ├── blog.routes.js
│   ├── category.routes.js
│   ├── job.routes.js
│   ├── service.routes.js
│   └── swagger.js
├── .env
├── .gitignore
├── index.js
├── LICENSE
├── package-lock.json
├── package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login an existing user.
- `GET /api/auth/profile`: Get the profile of the currently logged-in user.
- `PUT /api/auth/profile`: Update the profile of the currently logged-in user.
- `POST /api/auth/change-password`: Change the password of the currently logged-in user.
- `POST /api/auth/logout`: Logout the currently logged-in user.
- `GET /api/auth/users`: Get a list of all users (Admin only).
- `DELETE /api/auth/users/:id`: Delete a user by ID (Admin only).

### Blogs

- `POST /api/blog/create-blog`: Create a new blog post.
- `GET /api/blog/get-blog-list`: Get a list of all blog posts.
- `GET /api/blog/get-blog/:id`: Get a single blog post by ID.
- `PUT /api/blog/edit-blog/:id`: Update a blog post by ID.
- `DELETE /api/blog/delete-blog/:id`: Delete a blog post by ID.

### Categories

- `POST /api/category/create-category`: Create a new category.
- `GET /api/category/get-category-list`: Get a list of all categories.
- `GET /api/category/get-category/:id`: Get a single category by ID.
- `PUT /api/category/edit-category/:id`: Update a category by ID.
- `DELETE /api/category/delete-category/:id`: Delete a category by ID.

### Services

- `POST /api/service/create-service`: Create a new service.
- `GET /api/service/get-service-list`: Get a list of all services.
- `GET /api/service/get-service/:id`: Get a single service by ID.
- `PUT /api/service/edit-service/:id`: Update a service by ID.
- `DELETE /api/service/delete-service/:id`: Delete a service by ID.

### Jobs

- `POST /api/career/create-job`: Create a new job.
- `GET /api/career/get-job-list`: Get a list of all jobs.
- `GET /api/career/get-job/:id`: Get a single job by ID.
- `PUT /api/career/edit-job/:id`: Update a job by ID.
- `DELETE /api/career/delete-job/:id`: Delete a job by ID.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT (JSON Web Token)**: For user authentication.
- **bcryptjs**: For password hashing.
- **Swagger**: For API documentation.
- **dotenv**: For managing environment variables.
- **cors**: For enabling Cross-Origin Resource Sharing.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/blog-api.git
    ```

2.  Install the dependencies:

    ```bash
    cd blog-api
    npm install
    ```

3.  Create a `.env` file in the root directory and add the following environment variables:

    ```
    PORT=3000
    MONGO_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    ```

### Running the Application

- To start the server, run:

  ```bash
  npm start
  ```

- To start the server in development mode with auto-reloading, run:

  ```bash
  npm run dev
  ```

## API Documentation

The API documentation is generated using Swagger. Once the server is running, you can access the documentation at `http://localhost:3000/api-docs`.

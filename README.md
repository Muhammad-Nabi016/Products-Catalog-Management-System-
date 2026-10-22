# Product Catalog Management System

A full-stack web application for managing products using React.js, Node.js, Express.js, and MongoDB. The system allows users to add, view, update, delete, and search products through a user-friendly interface.

## Features

- Add new products
- View all products
- Update existing product details
- Delete products
- Search and filter products
- Store product data in MongoDB
- RESTful API built with Express.js
- Responsive React.js frontend

## Technologies Used

**Frontend**
- React.js
- Vite
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- Mongoose

**Database**
- MongoDB Atlas

## Project Structure

```text
Product Catalog Management/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── index.html
├── server.js
├── index.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd "Product Catalog Management"
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
PORT=3000
```

Replace the placeholder with your MongoDB Atlas connection string. Never share or upload your database credentials.

### 4. Start the Backend Server

```bash
npm start
```

Backend API runs at:

`http://localhost:3000`

### 5. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Open the local URL shown in your terminal, usually:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| POST | `/api/products` | Add a product |
| GET | `/api/products` | Retrieve all products |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

## Learning Outcomes

- Built CRUD APIs using Express.js
- Connected a Node.js application to MongoDB Atlas
- Used Mongoose for database operations
- Developed a React.js user interface
- Integrated frontend requests with backend APIs
- Practiced environment variable configuration and project organization

## Author

**Muhammad Nabi**

Software Engineer
# Syntecxhub Backend Development Internship

A complete REST API backend built with **Node.js**, **Express**, and **MongoDB** as part of the Syntecxhub Backend Development Internship program.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| multer | File/image uploads |
| dotenv | Environment variables |

---

## Project Structure

```
Syntecxhub_Backend_Projects/
├── controllers/         # Route handlers (business logic)
│   ├── users.js
│   ├── products.js
│   ├── files.js
│   ├── auth.js
│   ├── posts.js
│   ├── userUpload.js
│   ├── notes.js
│   ├── analytics.js
│   └── search.js
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Post.js
│   ├── Note.js
│   └── File.js
├── middleware/
│   ├── authMiddleware.js  # JWT verification
│   └── upload.js          # Multer config
├── uploads/             # Stored uploaded images
├── .env                 # Environment variables
├── server.js            # Entry point
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally or MongoDB Atlas URI

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Syntecxhub_Backend_Projects.git
cd Syntecxhub_Backend_Projects

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Then edit .env with your values
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/syntecxhub
JWT_SECRET=your_secret_key_here
```

### Run the Server

```bash
node server.js
```

Server runs at: `http://localhost:5000`

---

## All API Endpoints

### Task 1 — CRUD APIs

#### Project 1: User CRUD (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a user |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

#### Project 2: Product CRUD (`/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create a product |
| GET | `/products` | Get all (filter + paginate) |
| GET | `/products/:id` | Get product by ID |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

Query params: `?category=electronics`, `?minPrice=500&maxPrice=80000`, `?page=1&limit=10`

#### Project 3: File/Image Upload (`/upload`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload an image (form-data) |
| GET | `/upload/:id` | Get file metadata |
| DELETE | `/upload/:id` | Delete file |

---

### Task 2 — Auth + Blog + Profile Upload

#### Project 1: Authentication (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login, returns JWT token |
| GET | `/auth/me` | Get logged-in user (Protected) |

#### Project 2: Blog API (`/posts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts` | Create a post |
| GET | `/posts` | Get all posts (filter + sort + paginate) |
| GET | `/posts/:id` | Get post by ID |
| PUT | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |

Query params: `?tag=node`, `?author=john`, `?sort=oldest`, `?from=2025-01-01&to=2025-12-31`

#### Project 3: Profile Picture (`/users/:id`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/:id/upload` | Upload profile picture |
| GET | `/users/:id/picture` | Get profile picture URL |
| DELETE | `/users/:id/picture` | Delete profile picture |

---

### Task 3 — Notes + Analytics + Search

#### Project 1: Notes App (`/notes`) — Protected

> All routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create a note |
| GET | `/notes` | Get all my notes |
| GET | `/notes/:id` | Get single note |
| PUT | `/notes/:id` | Update note |
| PATCH | `/notes/:id/archive` | Toggle archive |
| DELETE | `/notes/:id` | Soft delete note |

#### Project 2: Analytics (`/analytics`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/notes-per-category` | Count notes grouped by category |
| GET | `/analytics/posts-per-month` | Count posts grouped by month |
| GET | `/analytics/products-by-category` | Count products + avg price per category |

Query params: `?userId=...`, `?from=2025-01-01&to=2025-12-31`

#### Project 3: Text Search (`/search`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search/posts?q=keyword` | Full-text search posts by relevance |
| GET | `/search/notes?q=keyword` | Regex search notes by title/body |

Combine with filters: `?q=node&tag=backend&author=john`

---

## Authentication

Protected routes need a JWT token in the header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get your token by calling `POST /auth/login`.

---

## Testing

Import `Syntecxhub_Backend.postman_collection.json` into Postman. Run requests in this order:
1. Signup → Login → (copy TOKEN) → Create Notes → Analytics → Search

---

## Author

**Shubhanjali**
Syntecxhub Backend Development Project

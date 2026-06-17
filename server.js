const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Task 1 Routes ---
app.use('/users', require('./controllers/users'));           // Project 1: User CRUD
app.use('/products', require('./controllers/products'));     // Project 2: Product CRUD
app.use('/upload', require('./controllers/files'));          // Project 3: File/Image Upload

// --- Task 2 Routes ---
app.use('/auth', require('./controllers/auth'));             // Project 1: Auth (signup/login/JWT)
app.use('/posts', require('./controllers/posts'));           // Project 2: Blog API
app.use('/users', require('./controllers/userUpload'));      // Project 3: File Upload with User Metadata

// --- Task 3 Routes ---
app.use('/notes', require('./controllers/notes'));           // Project 1: Notes App (protected)
app.use('/analytics', require('./controllers/analytics'));  // Project 2: Data Analytics API
app.use('/search', require('./controllers/search'));         // Project 3: Text Search API

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

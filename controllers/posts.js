const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// POST /posts - Create
router.post('/', async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /posts - Read all with filtering, pagination, sorting
router.get('/', async (req, res) => {
  try {
    const { tag, author, from, to, sort = 'newest', page = 1, limit = 10 } = req.query;
    const filter = {};

    if (tag) filter.tags = tag;
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter).sort(sortOrder).skip(skip).limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: posts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /posts/:id - Read one
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /posts/:id - Update
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /posts/:id - Delete
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

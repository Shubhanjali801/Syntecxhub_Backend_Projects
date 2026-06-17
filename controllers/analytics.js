const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Post = require('../models/Post');
const mongoose = require('mongoose');

// GET /analytics/notes-per-category
// Optional query: ?userId=...&from=...&to=...
router.get('/notes-per-category', async (req, res) => {
  try {
    const match = { isDeleted: false };
    if (req.query.userId) match.userId = new mongoose.Types.ObjectId(req.query.userId);
    if (req.query.from || req.query.to) {
      match.createdAt = {};
      if (req.query.from) match.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) match.createdAt.$lte = new Date(req.query.to);
    }

    const result = await Note.aggregate([
      { $match: match },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /analytics/posts-per-month
// Optional query: ?from=...&to=...
router.get('/posts-per-month', async (req, res) => {
  try {
    const match = {};
    if (req.query.from || req.query.to) {
      match.createdAt = {};
      if (req.query.from) match.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) match.createdAt.$lte = new Date(req.query.to);
    }

    const result = await Post.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
      { $sort: { year: -1, month: -1 } },
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /analytics/total-products-by-category (bonus)
const Product = require('../models/Product');
router.get('/products-by-category', async (req, res) => {
  try {
    const result = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $project: { _id: 0, category: '$_id', count: 1, avgPrice: { $round: ['$avgPrice', 2] } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

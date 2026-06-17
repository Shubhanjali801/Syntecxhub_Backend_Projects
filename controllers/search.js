const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Note = require('../models/Note');

// GET /search/posts?q=keyword&tag=node&author=john
router.get('/posts', async (req, res) => {
  try {
    const { q, tag, author } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
    }

    const filter = { $text: { $search: q } };
    if (tag) filter.tags = tag;
    if (author) filter.author = { $regex: author, $options: 'i' };

    const posts = await Post.find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } });

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /search/notes?q=keyword  (regex search on title/body)
router.get('/notes', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
    }

    const regex = new RegExp(q, 'i');
    const notes = await Note.find({
      isDeleted: false,
      $or: [{ title: regex }, { body: regex }],
    }).populate('userId', 'name email');

    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

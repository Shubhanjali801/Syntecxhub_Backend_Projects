const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const protect = require('../middleware/authMiddleware');

// All note routes are protected
router.use(protect);

// POST /notes - Create a note
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /notes - Get all notes of the logged-in user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, isDeleted: false })
      .populate('userId', 'name email');
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /notes/:id - Get single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id, isDeleted: false })
      .populate('userId', 'name email');
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /notes/:id - Update note
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /notes/:id/archive - Soft archive/unarchive
router.patch('/:id/archive', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id, isDeleted: false });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({ success: true, message: `Note ${note.isArchived ? 'archived' : 'unarchived'}`, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /notes/:id - Soft delete
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isDeleted: true },
      { new: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, message: 'Note deleted (soft)' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

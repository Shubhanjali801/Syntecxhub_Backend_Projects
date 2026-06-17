const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../uploads/upload');
const File = require('../models/File');

// POST /upload - Upload a file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const fileDoc = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({ success: true, data: fileDoc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /upload/:id - Get file metadata
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    res.status(200).json({ success: true, data: file });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /upload/:id - Delete file
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await file.deleteOne();
    res.status(200).json({ success: true, message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

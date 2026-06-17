const express = require('express');
const router = express.Router();
const fs = require('fs');
const upload = require('../uploads/upload');
const User = require('../models/User');

// POST /users/:id/upload - Upload profile picture for a user
router.post('/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Remove old picture if exists
    if (user.profilePicture && user.profilePicture.path && fs.existsSync(user.profilePicture.path)) {
      fs.unlinkSync(user.profilePicture.path);
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    user.profilePicture = {
      filename: req.file.filename,
      path: req.file.path,
      url: fileUrl,
    };
    await user.save();

    res.status(200).json({ success: true, data: user.profilePicture });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /users/:id/picture - Get profile picture URL
router.get('/:id/picture', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('profilePicture');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!user.profilePicture || !user.profilePicture.url) {
      return res.status(404).json({ success: false, message: 'No profile picture uploaded' });
    }
    res.status(200).json({ success: true, data: user.profilePicture });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /users/:id/picture - Delete profile picture
router.delete('/:id/picture', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.profilePicture && user.profilePicture.path && fs.existsSync(user.profilePicture.path)) {
      fs.unlinkSync(user.profilePicture.path);
    }

    user.profilePicture = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Profile picture deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

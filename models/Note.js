const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  body: { type: String, required: [true, 'Body is required'] },
  category: { type: String, default: 'general' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isDeleted: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);

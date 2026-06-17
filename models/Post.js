const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  body: { type: String, required: [true, 'Body is required'] },
  author: { type: String, required: [true, 'Author is required'] },
  tags: [{ type: String }],
}, { timestamps: true });

postSchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('Post', postSchema);

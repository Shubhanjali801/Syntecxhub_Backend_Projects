const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  path: { type: String, required: true },
  url: { type: String, required: true },
  mimetype: { type: String },
  size: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);

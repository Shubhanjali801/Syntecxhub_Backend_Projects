const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
  age: { type: Number },
  password: { type: String },
  profilePicture: {
    filename: String,
    path: String,
    url: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

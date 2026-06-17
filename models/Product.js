const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  description: { type: String },
  category: { type: String, required: [true, 'Category is required'] },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

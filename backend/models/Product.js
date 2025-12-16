const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  image: { type: String, default: 'https://via.placeholder.com/400x500' },
  isPromo: { type: Boolean, default: false },
  oldPrice: { type: Number },
});

module.exports = mongoose.model('Product', ProductSchema);

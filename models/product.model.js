const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing whitespace
    },
    details: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing whitespace
    },
    price: {
      type: Number,
      required: true,
      min: 0.01, // Enforce minimum price (optional)
    },
    discount: {
      type: Number,
      // min: 0, // Enforce minimum price (optional)
    },
    images: {
      type: Array, // Store image URL (consider using cloud storage for efficiency)
    },
    sizes: {
      type: Array,
    },
    colors: {
      type: Array,
    },
    category: {
      type: String,
    },
    sub_category: {
      type: String,
    },
    dress: {
      type: String,
    }
  });

module.exports = mongoose.model('Products',productSchema)
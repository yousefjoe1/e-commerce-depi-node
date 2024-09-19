const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing whitespace
    },
    image: {
      type: String, // Store image URL (consider using cloud storage for efficiency)
    },

  });

module.exports = mongoose.model('Category',categorySchema)
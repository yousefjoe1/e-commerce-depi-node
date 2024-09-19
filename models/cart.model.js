const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user_id: {
      type: String,
      required: true,
    },
    product: {
      type: Object,
      required: true,
      uniqe:true
    },
    count: {
      type: String || Number,
      required: true,
    },
  });

module.exports = mongoose.model('Cart',cartSchema)
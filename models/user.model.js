const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing whitespace
    },
    email: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing whitespace,
      uniqe:true
    },
    password: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing whitespace
    },
    phone: {
      type: String,
      trim: true, // Remove leading/trailing whitespace
    },
    role: {
      type: String,
      enum: ['user', 'vendor'],
      default: 'user',
      trim: true, // Remove leading/trailing whitespace
    },
  });

module.exports = mongoose.model('Users',userSchema)
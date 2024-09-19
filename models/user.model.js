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
    // avatar: {
    //   type: String,
    //   required: false
    // }
  });

module.exports = mongoose.model('Users',userSchema)
const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name can not be blank'],
    },
    age: {
      type: Number,
      required: true,
      min: 10,
      max: 70,
    },
    public_key: {
      type: String,
    },
    secret_key: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);

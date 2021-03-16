const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name can not be blank'],
    },
    email: {
      type: String,
      required: [true, 'Email can not be blank'],
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password can not be blank'],
    },
    age: {
      type: Number,
      required: [true, 'Age can not be blank'],
      min: 18,
      max: 100,
    },
    public_key: {
      type: String,
    },
    secret_key: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);
// Hash Password
UserSchema.pre('save', function(next){
  // This is ES5 and not working with arrow function with use ES6
  const user = this;
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  // Generate a salt
  bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR), function(err, salt) {
    if (err) return next(err);
    // Hash the password using the new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      // Override the password
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

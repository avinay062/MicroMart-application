const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxLength: [10, 'Name cannot exceed 10 characters'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxLength: [10, 'Name cannot exceed 10 characters'],
    trim: true,
  },
  emailId: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // prevent accidental exposure in queries
    validate: {
      validator(value) {
        return /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(value);
      },
      message: 'Password must contain at least one number and one special character',
    }
  }
}, { timestamps: true });

  userSchema.index({firstName : 1});

// offloads creation of JWT token
userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "MICRO@MART$05", {
        expiresIn: "7d"
    });
    return token;
};

//offloads password validation

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  if (!this.password) return false;
  return bcrypt.compare(passwordInputByUser, this.password);
};


module.exports = mongoose.model('User', userSchema);

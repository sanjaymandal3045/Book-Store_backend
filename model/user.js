const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Full name was not provided"],
    maxLength: 30,
  },
  email: {
    type: String,
    unique: [true, "Email should be unique"], 
    required: [true, "Email was not provided"],
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: "Invalid email format",
    },
  },
  userName: {
    type: String,
    unique: [true, "userName should be unique"],
    required: [true, "Username was not provided"],
    maxLength: 30,
  },
  phoneNo: {
    type: String,
    unique: [true, "This Phone No is already registered!"],
    required: [true, "Phone No was not provided..."],
    length: 11,
  },
  access: {
    type: String,
    required: false,
    default:"user",
  },
  balance:{
    type: Number,
    required:false,
    default:0.00,
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;

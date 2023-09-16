const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: false,
  },
  lastLogin: [
    {
      type: Date,
      default: [],
    },
  ],
  isBlocked: {
    type: Boolean,
    default: false,
    required: false,
  },
  loginAttempts:{
    type:Number,
    required:false,
    default:0,
  }

});

const Auth = mongoose.model("authentication", authSchema);
module.exports = Auth;

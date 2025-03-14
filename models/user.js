const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  city: { type: String, required: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  userId: { type: String },
  jwtToken: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);

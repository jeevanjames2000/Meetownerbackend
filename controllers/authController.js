const User = require("../models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

async function generateUserId() {
  const lastUser = await User.findOne({ userId: { $ne: null } })
    .sort({ userId: -1 })
    .select("userId");

  if (!lastUser || !lastUser.userId || isNaN(lastUser.userId)) {
    return "20250001";
  }

  return (Number(lastUser.userId) + 1).toString();
}

module.exports = {
  sample: async (req, res) => {
    return res.status(200).send("Sample test API");
  },

  signup: async (req, res) => {
    const { mobile, fullName, city } = req.body;
    try {
      if (!mobile || !fullName || !city) {
        return res.status(400).json({ message: "All fields are required" });
      }

      let user = await User.findOne({ mobile });

      if (user) {
        return res.status(409).json({ message: "User already exists" });
      }

      const userId = await generateUserId();

      user = new User({ userId, mobile, fullName, city });
      await user.save();

      return res.status(201).json({
        message: "User registered successfully",
        userId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  sendOtp: async (req, res) => {
    const { mobile } = req.body;

    try {
      if (!mobile) {
        return res.status(200).json({
          status: "error",
          message: "Mobile number is required",
        });
      }

      const user_id = "meetowner2023";
      const pwd = "Meet@123";
      const sender_id = "METOWR";
      const sys_otp = Math.floor(100000 + Math.random() * 900000);
      const message = `Dear customer, ${sys_otp} is the OTP for Login it will expire in 2 minutes. Don't share to anyone -MEET OWNER`;
      const user = await User.findOne({ mobile });

      user.otp = sys_otp;
      user.otpExpiry = Date.now() + 2 * 60 * 1000;
      const api_url = "http://tra.bulksmshyderabad.co.in/websms/sendsms.aspx";
      const params = {
        userid: user_id,
        password: pwd,
        sender: sender_id,
        mobileno: mobile,
        msg: message,
        peid: "1101542890000073814",
        tpid: "1107169859354543707",
      };
      try {
        const response = await axios.get(api_url, { params });
        await user.save();
        return res.status(200).json({
          status: "success",
          message: "OTP sent successfully!",
        });
      } catch (error) {
        console.error("Error sending SMS:", error.message);
        return res.status(500).json({
          status: "error",
          message: "Error sending SMS",
          error: error.message,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  },

  login: async (req, res) => {
    const { mobile, otp } = req.body;
    try {
      if (!mobile || !otp) {
        return res.status(400).json({ message: "Mobile and OTP are required" });
      }

      const user = await User.findOne({ mobile });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (Date.now() > user.otpExpiry) {
        return res
          .status(400)
          .json({ message: "OTP expired. Please request a new one." });
      }

      if (otp !== user.otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      const token = jwt.sign(
        { userId: user._id, mobile: user.mobile },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      user.jwtToken = token;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      return res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  logout: async (req, res) => {
    const { userId } = req.body;
    console.log(userId);
    try {
      const user = await User.findOne({ userId });
      console.log("user: ", user);
      if (!userId) {
        console.log("User Not Foun: ");
        return res.status(400).send("User Not Found");
      }

      user.jwtToken = null;
      user.otp = null;
      await user.save();
      return res.status(200).send("Logout successful");
    } catch (error) {
      console.log(error);
    }
  },
};

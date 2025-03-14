const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { default: axios } = require("axios");

const prisma = new PrismaClient();

const AuthLogin = async (req, res) => {
  const { mobile } = req.body;

  try {
    const user = await prisma.users.findFirst({
      where: {
        mobile: mobile,
        user_type: {
          notIn: [1, 2],
        },
      },
    });

    if (!user) {
      return res.status(200).json({
        status: "error_user_not_found",
        message: "user not found",
      });
    }

    const otpNumber = Math.floor(100000 + Math.random() * 900000);

    let user_id = user.id.toString();
    // generate a access token
    const accessToken = jwt.sign({ user_id: user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    let user_details = {
      user_id: user.id.toString(),
      name: user.name,
      user_type: user.user_type,
      mobile: user.mobile,
      // otpNumber: otpNumber.toString(),
    };

    // diconnect prisma
    await prisma.$disconnect();
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user_details: user_details,
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const AuthRegister = async (req, res) => {
  const { userType, name, mobile, city } = req.body;

  try {
    //get type id user_types
    const userTypeData = await prisma.user_types.findFirst({
      where: {
        login_type: userType,
      },
    });

    let user_type_id = userTypeData.login_type_id;

    // check if user type is invalid
    if (user_type_id == 1 || user_type_id == 2) {
      return res.status(200).json({
        status: "error_user_type",
        message: "Invalid user type",
      });
    }

    // get city name
    const cityData = await prisma.cities.findFirst({
      where: {
        id: city,
      },
    });

    if (!cityData) {
      return res.status(200).json({
        status: "error_city_not_found",
        message: "City not found",
      });
    }

    let city_name = cityData?.name;

    const existingUser = await prisma.users.findFirst({
      where: {
        mobile: mobile,
        user_type: {
          notIn: [1, 2],
        },
      },
    });

    if (existingUser) {
      return res.status(200).json({
        status: "error_user_exists",
        message: "user already exists",
      });
    }

    const newUser = await prisma.users.create({
      data: {
        user_type: parseInt(user_type_id),
        name: name,
        mobile: mobile,
        city: city_name,
        created_date: new Date(),
        created_time: new Date(),
      },
    });

    let user_id = newUser.id.toString();

    // generate a access token
    const accessToken = jwt.sign({ user_id: user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    let user_details = {
      user_id: newUser.id.toString(),
      user_type: newUser.user_type,
      name: newUser.name,
      mobile: newUser.mobile,
    };

    await prisma.$disconnect();
    return res.status(200).json({
      status: "success",
      message: "User created successfully",
      user_details: user_details,
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const sendOtp = async (req, res) => {
  const { mobile } = req.query;

  try {
    if (!mobile) {
      return res.status(200).json({
        status: "error",
        message: "Mobile number is required",
      });
    }

    const user_id = "meetowner2023"; // Your Username
    const pwd = "Meet@123"; // Your Password
    const sender_id = "METOWR"; // Add 6 char sender ID
    const sys_otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    const message = `Dear customer, ${sys_otp} is the OTP for Login it will expire in 2 minutes. Don't share to anyone -MEET OWNER`;

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
      // Make a GET request to the SMS API
      const response = await axios.get(api_url, { params });
      return res.status(200).json({
        status: "success",
        message: "OTP sent successfully!",
        otp: sys_otp,
        apiResponse: response.data,
      });
    } catch (error) {
      console.error("Error sending SMS:", error.message);
      return res
        .status(500)
        .json({
          status: "error",
          message: "Error sending SMS",
          error: error.message,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.AuthLogin = AuthLogin;
exports.AuthRegister = AuthRegister;
exports.sendOtp = sendOtp;

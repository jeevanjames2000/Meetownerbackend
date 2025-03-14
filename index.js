require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/mongoDB");
const Routes = require("./routes/mainRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();
connectDB();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", Routes);
app.use("/pay", paymentRoutes);
const PORT = process.env.PORT || 5002;
const sslOptions = {
  key: fs.readFileSync("/home/ubuntu/Meetownerbackend/ssl/private-key.pem"),
  cert: fs.readFileSync("/home/ubuntu/Meetownerbackend/ssl/certificate.pem"),
};
https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HTTPS Server running on https://0.0.0.0:${PORT}`);
});

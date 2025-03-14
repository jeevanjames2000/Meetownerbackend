require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const path = require("path");
const connectDB = require("./config/mongoDB");
const Routes = require("./routes/mainRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();
const privateKey = fs.readFileSync(
  path.join(__dirname, "ssl", "private-key.pem"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "ssl", "certificate.pem"),
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };
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
const PORT = process.env.PORT || 5001;
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
  console.log(`🚀 HTTPS Server is running on port ${PORT}`);
});

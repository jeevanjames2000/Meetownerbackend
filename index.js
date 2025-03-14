const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

const backupDatainsertConroller = require("./routes/backupDatainsertRoute");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const propertyRoute = require("./routes/propertyRoute");
const generalRoute = require("./routes/generalRoute");
const listingsRoute = require("./routes/listingsRoute");
const enquiresRoute = require("./routes/enquiresRoute");
const packageRoute = require("./routes/packagesRoute");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Disable the X-Powered-By header for security
app.disable("x-powered-by");

// Disable the X-Powered-By header for security
app.disable("x-powered-by");

const corsOptions = {
  origin: true,
  credentials: true, // Allow cookies and Authorization headers
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  exposedHeaders: ["Content-Disposition"], // Allow the Content-Disposition header to be accessed by the frontend
};

app.use(cors(corsOptions));

app.use(helmet());

// Gzip compression
app.use(
  compression({
    level: 6,
  })
);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware for parsing incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route for testing
app.get("/", async (req, res) => {
  res.send("Hello Seller Panel API");
});

// API routes
app.use("/backupdatainsert", backupDatainsertConroller);
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/property", propertyRoute);
app.use("/general", generalRoute);
app.use("/listings", listingsRoute);
app.use("/enquires", enquiresRoute);
app.use("/packages", packageRoute);
app.use("/payments", paymentRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// Start the server on the specified port
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

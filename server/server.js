require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

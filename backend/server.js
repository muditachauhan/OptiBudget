// backend/server.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import DB (IMPORTANT)
require("./database/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Start server
app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});
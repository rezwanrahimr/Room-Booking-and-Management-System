const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const path = require('path');
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(cors());

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/rooms", roomRoutes); // Room routes
app.use("/api/booking", bookingRoutes); // Booking routes

app.get("/", (req, res) => {
    res.send("Room Booking Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

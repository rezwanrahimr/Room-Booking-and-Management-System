const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");
const router = express.Router();

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

module.exports = router;

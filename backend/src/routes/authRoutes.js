const express = require("express");
const { loginUser, registerUser, getAllUser } = require("../controllers/authController");
const router = express.Router();

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

// get all user
router.get("/users", getAllUser)

module.exports = router;

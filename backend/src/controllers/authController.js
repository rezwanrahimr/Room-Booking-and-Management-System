const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id, name, email, role) => {
    return jwt.sign(
        { id, name, email, role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};


// Register User
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.name, user.email, user.role),
    });
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.name, user.email, user.role),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

// Get All Users with role 'user'
const getAllUser = async (req, res) => {
    const users = await User.find({ role: "user" });

    if (!users) {
        return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
        status: true,
        message: 'user retrieved successfully',
        data: users
    });
};



module.exports = { registerUser, loginUser, getAllUser };

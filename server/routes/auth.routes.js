// routes/auth.routes.js
import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Generate Token helper (Uses JWT_SECRET from process.env)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all required fields." });
        }

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already exists" });

        const user = new User({ name, email, password }); // Password hashing handled by pre('save') middleware
        await user.save();

        // After successful registration, log them in automatically (optional)
        const token = generateToken(user._id);
        
        res.status(201).json({
            user: { _id: user._id, name: user.name, email: user.email, profilePic: user.profilePic },
            token,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during registration." });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email and password." });
        }
        
        const user = await User.findOne({ email });
        
        // 400 Bad Request if user not found
        if (!user) return res.status(400).json({ message: "User not found" }); 

        // 400 Bad Request if passwords don't match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Success (200)
        const token = generateToken(user._id);

        res.json({
            user: { _id: user._id, name: user.name, email: user.email, profilePic: user.profilePic },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during login." });
    }
});

export default router;
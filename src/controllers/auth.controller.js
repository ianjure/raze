const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const redisClient = require("../config/redisClient");
const generateToken = require("../utils/generateToken");

const signup = async (req, res) => {
    // Get the username and password from the request body (role is optional)
    const { username, password, role } = req.body;

    // Check if the username and password are provided
    if(!username || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields." });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        return res.status(500).json({ success: false, message: "Username is not available." });
    
    // If credentials are valid, hash the password and save the user
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        try {
            if (role === "Admin") {
                const newUser = new User({ username: username, password: hashedPassword, role: role });
                await newUser.save();
                return res.status(201).json({ success: true, message: "Signed-up successfully!", data: newUser });
            } else {
                const newUser = new User({ username: username, password: hashedPassword, role: "User" });
                await newUser.save();
                return res.status(201).json({ success: true, message: "Signed-up successfully!", data: newUser });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

const login = async (req, res) => {
    // Get the username and password from the request body
    const { username, password } = req.body;

    // Check if the username and password are provided
    if(!username || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields." });
    }

    try {
        // Check if the user exists
        const existingUser = await User.findOne({ username: username });
        if (!existingUser) {
            return res.status(500).json({ success: false, message: "User does not exist." });
        }

        // Check if the password is correct
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            return res.status(500).json({ success: false, message: "You entered the wrong password." });
        }

        // If the password is correct, generate a token and send it to the user
        else {
            const token = generateToken(existingUser._id, existingUser.role );
            return res.status(200).json({ success: true, message: "Logged-in successfully!", token: token, role: existingUser.role, level: existingUser.level });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const logout = async (req, res) => {
    // Get the token from the header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided." });
    }

    try {
        // Decode the token
        const decoded = jwt.decode(token);

        // Extract the expiration time from the token
        const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);

        // Store token in Redis with expiration time
        await redisClient.setEx(`blacklist:${token}`, expiryTime, "blacklisted");
        return res.status(200).json({ success: true, message: "Logged-out successfully!" });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }
};

const validate = async (req, res) => {
    // Get the token from the header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user exists
        const existingUser = await User.findOne({ _id: decoded.id });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        return res.status(200).json({ success: true, message: "Token is valid." });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

module.exports = { signup, login, logout, validate };
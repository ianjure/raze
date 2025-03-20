const mongoose = require("mongoose");
const User = require("../models/user.model");

const getLeaderboard = async (req, res) => {
    // Get the user ID from the authenticated user
    const userId = req.user.id;

    // Check if the user ID is provided
    if (!userId) {
        return res.status(401).json({ success: false, message: "User ID is required." });
    }

    // Check if the user ID is valid
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ success: false, message: "Invalid user ID." });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
        return res.status(500).json({ success: false, message: "User not found." });
    }

    try {
        // Find the top 10 users and sort them by level and experience points in descending order
        const users = await User.find().select(["-_id", "username", "level", "exp"]).sort({ level: -1, exp: -1 }).limit(10);
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
;}

const getStatus = async (req, res) => {
    // Get the user ID from the authenticated user
    const userId = req.user.id;

    // Check if the user ID is provided
    if (!userId) {
        return res.status(401).json({ success: false, message: "User ID is required." });
    }

    // Check if the user ID is valid
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ success: false, message: "Invalid user ID." });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
        return res.status(500).json({ success: false, message: "User not found." });
    }

    try {
        // Return the user's status
        return res.status(200).json({ success: true, exp: existingUser.exp, level: existingUser.level });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getLeaderboard, getStatus };
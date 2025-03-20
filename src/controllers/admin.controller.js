const mongoose = require("mongoose");
const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Task = require("../models/task.model");

const getUsers = async (req, res) => {
    // Get the admin ID from the authenticated user
    const adminId = req.user.id;

    // Check if the admin ID is provided
    if (!adminId) {
        return res.status(401).json({ success: false, message: "Admin ID is required." });
    }

    // Check if the admin ID is valid
    if(!mongoose.Types.ObjectId.isValid(adminId)) {
        return res.status(404).json({ success: false, message: "Invalid admin ID." });
    }

    // Check if the admin exists
    const existingAdmin = await Admin.findOne({ _id: adminId });
    if (!existingAdmin) {
        return res.status(500).json({ success: false, message: "Admin not found." });
    }

    try {
        // Find all users and sort them by created date in descending order
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
;}

const deleteUser = async (req, res) => {
    // Get the user ID from the request parameters and the admin ID from the authenticated user
    const userId = req.params.id;
    const adminId = req.user.id;

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

    // Check if the admin ID is provided
    if (!adminId) {
        return res.status(401).json({ success: false, message: "Admin ID is required." });
    }

    // Check if the admin ID is valid
    if(!mongoose.Types.ObjectId.isValid(adminId)) {
        return res.status(404).json({ success: false, message: "Invalid admin ID." });
    }

    // Check if the admin exists
    const existingAdmin = await Admin.findOne({ _id: adminId });
    if (!existingAdmin) {
        return res.status(500).json({ success: false, message: "Admin not found." });
    }

    try {
        // Delete the user and all tasks that belong to the user
        await User.findOneAndDelete({ _id: userId });
        await Task.deleteMany({ user: userId });
        return res.status(201).json({ success: true, message: "User deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getUsers, deleteUser };
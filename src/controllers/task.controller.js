const mongoose = require("mongoose");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const calculateExp = require("../utils/calculateExp");
const updateLevel = require("../utils/updateLevel");

// ----- Admin ----- //

const getAllTasks = async (req, res) => {
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
    const existingAdmin = await User.findOne({ _id: adminId, role: "Admin" });
    if (!existingAdmin) {
        return res.status(500).json({ success: false, message: "Admin not found." });
    }

    try {
        // Find all tasks in the database and select only the status field
        const tasks = await Task.find({}).select(["status"]);
        return res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ----- User ----- //

const getTasks = async (req, res) => {
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
        // Find all tasks that belong to the user and sort them by created date in descending order
        const tasks = await Task.find({ user: userId }).select(["task", "status"]).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const createTask = async (req, res) => {
    // Get the user ID from the authenticated user and the task from the request body
    const userId = req.user.id;
    const { task } = req.body;

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

    // Check if the task is provided
    if(!task) {
        return res.status(400).json({ success: false, message: "Please provide a task." });
    }

    try {
        // Create a new task and save it to the database
        const newTask = new Task({ user: userId, task: task });
        await newTask.save();
        return res.status(201).json({ success: true, message: "Task created successfully!", data: newTask });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateTask = async (req, res) => {
    // Get the task ID from the request parameters and the user ID from the authenticated user
    const taskId = req.params.id;
    const userId = req.user.id;

    // Get the new task and status from the request body
    let { task, status } = req.body;

    // Check if the task ID is provided
    if (!taskId) {
        return res.status(401).json({ success: false, message: "Task ID is required." });
    }
    
    // Check if the task ID is valid
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(404).json({ success: false, message: "Invalid Task ID." });
    }

    // Check if the task exists
    const existingTask = await Task.findOne({ _id: taskId });
    if (!existingTask) {
        return res.status(500).json({ success: false, message: "Task not found." });
    }

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
        // If the task is already "Done", do not allow status changes
        if (existingTask.status === "Done") {
            return res.status(400).json({ success: false, message: "Task is already marked as 'Done' and cannot be changed." });
        }

        // If the new status is "Done" and the current status is not "Done", update the user's exp and level
        if (status === "Done" && existingTask.status !== "Done") {
            const expAdd = calculateExp(existingUser.level);
            const { newExp, levelIncrease } = updateLevel(existingUser.exp, expAdd);

            // Check if the task is completed on a new day
            const today = new Date().toLocaleDateString("en-CA");
            const lastTaskDate = existingUser.lastTaskCompleted
                ? existingUser.lastTaskCompleted.toISOString().split("T")[0]
                : null;
            
            let streakUpdate = {};

            // Same day, no streak update
            if (lastTaskDate === today) {
                streakUpdate = { lastTaskCompleted: new Date() };
            } else if (lastTaskDate === null || new Date(lastTaskDate) < new Date(today)) {
                const daysDifference = Math.floor(
                    (new Date(today) - new Date(lastTaskDate)) / (1000 * 60 * 60 * 24)
                );

                // More than one day has passed, reset the streak
                if (daysDifference > 1) {
                    streakUpdate = { lastTaskCompleted: new Date(today), streak: 1 };
                 // Increment streak for a new day
                } else {
                    streakUpdate = { lastTaskCompleted: new Date(today), streak: existingUser.streak + 1 };
                }
            }

            await User.findOneAndUpdate(
                { _id: userId },
                { $set: { exp: newExp, ...streakUpdate }, $inc: { level: levelIncrease } },
                { new: true }
            );
        }

        // Update the task with the new task and status
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, user: userId },
            { $set: { task, status } },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteTask = async (req, res) => {
    // Get the task ID from the request parameters and the user ID from the authenticated user
    const taskId = req.params.id;
    const userId = req.user.id;

    // Check if the task ID is provided
    if (!taskId) {
        return res.status(401).json({ success: false, message: "Task ID is required." });
    }
    
    // Check if the task ID is valid
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(404).json({ success: false, message: "Invalid Task ID." });
    }

    // Check if the task exists
    const existingTask = await Task.findOne({ _id: taskId });
    if (!existingTask) {
        return res.status(500).json({ success: false, message: "Task not found." });
    }

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
        // Find the task by ID and user, then delete it
        await Task.findOneAndDelete({ _id: taskId, user: userId });
        return res.status(200).json({ success: true, message: "Task deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllTasks, getTasks, createTask, updateTask, deleteTask };
const mongoose = require("mongoose");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const calculateExp = require("../utils/calculateExp");
const updateLevel = require("../utils/updateLevel");

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
        const tasks = await Task.find({ user: userId }).select(["-_id", "task", "status"]).sort({ createdAt: -1 });
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

    // Add experience points to the user if the task is marked as done for the first time
    // Increase user level if the new experience points triggered the level-up criteria
    if (status === "Done" && existingTask.status != "Done") {
        try {
            const expAdd = calculateExp(existingUser.level);
            const { newExp, levelIncrease } = updateLevel(existingUser.exp, expAdd);
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { exp: newExp }, $inc: { level: levelIncrease } }, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "Invalid user ID." });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    try {
        // Check if the task is already marked as done, then update the task while keeping the status as done
        if (existingTask.status === "Done") {
            status = "Done";
            const updatedTask = await Task.findOneAndUpdate({ _id: taskId, user: userId }, { $set: { task, status } }, { new: true, runValidators: true });
            if (!updatedTask) {
                return res.status(404).json({ success: false, message: "Invalid user ID." });
            }
            return res.status(200).json({ success: true, data: updatedTask });

        // If the task is not marked as done, update the task with the new status
        } else {
            const updatedTask = await Task.findOneAndUpdate({ _id: taskId, user: userId }, { $set: { task, status } }, { new: true, runValidators: true });
            if (!updatedTask) {
                return res.status(404).json({ success: false, message: "Invalid user ID." });
            }
            return res.status(200).json({ success: true, data: updatedTask });
        }
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
        const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: userId });
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Invalid user ID." });
        }
        return res.status(200).json({ success: true, message: "Task deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
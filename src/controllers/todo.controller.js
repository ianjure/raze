const mongoose = require("mongoose");
const Todo = require("../models/todo.model");

const getTodos = async (req, res) => {
    const userId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    try {
        const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 }); // Get user's todos, sorted by newest first
        return res.status(200).json({ success: true, data: todos });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const createTodo = async (req, res) => {
    const { description, status } = req.body;
    const userId = req.params.id || req.user?._id; // Extract user ID from params or authenticated user

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    if(!description) {
        return res.status(400).json({ success: false, message: "Please create a task." });
    }

    if (!userId) {
        return res.status(401).json({ success: false, message: "User ID is required." });
    }

    try {
        const newTodo = new Todo({
            description: description,
            status: status,
            user: userId
        });
        await newTodo.save();
        return res.status(201).json({ success: true, data: newTodo });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateTodo = async (req, res) => {
    const updateTodo = async (req, res) => {
        const todoId = req.params.id;
        const { description, status } = req.body; // Get data from request body
        const userId = req.user?._id; // Get the authenticated user's ID
    
        if (!mongoose.Types.ObjectId.isValid(todoId)) {
            return res.status(404).json({ success: false, message: "Invalid todoId" });
        }
    
        try {
            // Find the todo by ID and user ID and update it
            const updatedTodo = await Todo.findOneAndUpdate(
                { _id: todoId, user: userId }, // Ensure the todo belongs to the authenticated user
                { description, status },
                { new: true, runValidators: true } // Return the updated document
            );
    
            if (!updatedTodo) {
                return res.status(404).json({ success: false, message: "Todo not found" });
            }
    
            res.json({ success: true, data: updatedTodo });
        } catch (error) {
            console.error("Error updating todo:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    };
    
};

const deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.id; // Get the ToDo ID from the request parameters
        const userId = req.user?._id; // Get the authenticated user's ID

        if (!mongoose.Types.ObjectId.isValid(todoId)) {
            return res.status(404).json({ message: "Invalid todoId" });
        }

        // Find the todo by ID and user ID and delete it
        const deletedTodo = await Todo.findOneAndDelete({
            _id: todoId,
            user: userId, // Ensure the todo belongs to the authenticated user
        });

        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
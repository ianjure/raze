const mongoose = require("mongoose");

// Define the task schema
const taskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    task: {
        type: String,
        required: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ["To Do", "Priority", "In Progress", "Done"],
        default: "To Do"
    }
}, {
    timestamps: true
});

// Create the task model
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
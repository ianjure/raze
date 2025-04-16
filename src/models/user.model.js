const mongoose = require("mongoose");

// Define the user schema
const userSchema = mongoose.Schema({
    role : {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    exp: {
        type: Number,
        required: true,
        default: 0
    },
    streak: {
        type: Number,
        required: true,
        default: 0
    },
    lastTaskCompleted: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Create the user model
const User = mongoose.model("User", userSchema);

module.exports = User;
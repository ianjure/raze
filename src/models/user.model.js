const mongoose = require("mongoose");

// Define the user schema
const userSchema = mongoose.Schema({
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
    role : {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    }
}, {
    timestamps: true
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
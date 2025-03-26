const express = require("express");
const path = require("path");

const router = express.Router();

// Signup and Login
router.get("/", (req, res) => {
    res.redirect("/login");
});
router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/signup.html"));
});
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/login.html"));
});

// User Dashboard
router.get("/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/user-dashboard.html"));
});

// Admin Dashboard
router.get("/admin/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/admin-dashboard.html"));
});

module.exports = router;
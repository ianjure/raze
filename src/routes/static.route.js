const express = require("express");
const path = require("path");

// Initialize the router
const router = express.Router();

// ----- Signup and Login Page ----- //
router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/signup.html"));
});
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/login.html"));
});
router.get("/", (req, res) => {
    res.redirect("/login");
});

router.get("/leaderboards", (req, res) => {
     console.log("Serving leaderboards.html");
    res.sendFile(path.join(__dirname, "../../public/views/leaderboards.html"));
});

// ----- User Dashboard Page ----- //
router.get("/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/user-dashboard.html"));
});

// ----- Admin Dashboard Page ----- //
router.get("/admin/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/admin-dashboard.html"));
});

module.exports = router;
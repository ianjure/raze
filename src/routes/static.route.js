const express = require("express");
const path = require("path");

const router = express.Router();

// User static routes
router.get("/", (req, res) => {
    res.redirect("/login");
});
router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/user/user-signup.html"));
});
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/user/user-login.html"));
});
router.get("/:username", (req, res) => {
    const username = req.params.username;
    res.sendFile(path.join(__dirname, "../../public/user/user-dashboard.html"));
});

// Admin static routes
router.get("/admin", (req, res) => {
    res.redirect("/admin/login");
});
router.get("/admin/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/admin/admin-login.html"));
});
router.get("/admin/:username", (req, res) => {
    const username = req.params.username;
    res.sendFile(path.join(__dirname, "../../public/admin/admin-dashboard.html"));
});

module.exports = router;

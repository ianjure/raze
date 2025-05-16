const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { signup, login, logout, validate } = require("../controllers/auth.controller");
const { getUsers, deleteUser, getLeaderboard, getRank, getStatus, updateStreak } = require("../controllers/user.controller");

// Initialize the router
const router = express.Router();

// ----- Authentication ----- //
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/validate", validate);

// ----- Admin ----- //
router.get("/users", authMiddleware, getUsers);
router.delete("/:id", authMiddleware, deleteUser);

// ----- User ----- //
router.get("/leaderboard", authMiddleware, getLeaderboard);
router.get("/rank", authMiddleware, getRank);
router.get("/", authMiddleware, getStatus);
router.post("/streak", authMiddleware, updateStreak);

module.exports = router;
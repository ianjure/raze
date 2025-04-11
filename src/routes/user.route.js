const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { signup, login, logout } = require("../controllers/auth.controller");
const { getUsers, deleteUser, getLeaderboard, getStatus } = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/users", authMiddleware, getUsers);
router.delete("/:id", authMiddleware, deleteUser);

router.get("/leaderboard", authMiddleware, getLeaderboard);
router.get("/", authMiddleware, getStatus);

module.exports = router;
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { getAllTasks, getTasks, createTask, updateTask, deleteTask } = require("../controllers/task.controller");

// Initialize the router
const router = express.Router();

// ----- Admin ----- //
router.get("/all", authMiddleware, getAllTasks);

// ----- User ----- //
router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
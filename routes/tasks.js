// routes/tasks.js

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { authMiddleware } = require("../middleware/auth");
const {
  taskCreationSchema,
  taskUpdateSchema,
} = require("../middleware/validate");
const { getCurrentUserId } = require("../middleware/user");

// Middleware to validate task creation data
const validateTaskCreation = (req, res, next) => {
  try {
    taskCreationSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.errors });
  }
};

// Middleware to validate task update data
const validateTaskUpdate = (req, res, next) => {
  try {
    taskUpdateSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.errors });
  }
};

// Middleware to protect routes
router.use(authMiddleware);

// Create Task
router.post("/create", async (req, res) => {
  try {
    const userId = getCurrentUserId(req);

    // Validate request body
    const taskData = taskCreationSchema.parse(req.body);

    // Create new task with user ID
    const task = new Task({
      ...taskData,
      // createdBy: userId,
    });

    // Save task to database
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    if (error.errors) {
      // Validation error
      res.status(400).json({ message: error.errors });
    } else {
      // Other errors
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// Update Single Task

router.patch("/:id", validateTaskUpdate, async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskUpdates = req.body;

    // Ensure that task ID is provided
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    // Find the task by ID and update it
    const updatedTask = await Task.findByIdAndUpdate(taskId, taskUpdates, {
      new: true,
    });

    // Check if task exists
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Return the updated task
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Tasks
router.get("/", async (req, res) => {
  try {
    // Get the current user's ID from the request
    const userId = getCurrentUserId(req);

    // Retrieve tasks created by the current user
    const tasks = await Task.find({ createdBy: userId });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get Single Task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Single Task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

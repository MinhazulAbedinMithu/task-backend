// routes/chat.js

const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const { authMiddleware } = require("../middleware/auth");

// Middleware to protect routes
router.use(authMiddleware);

// Add a new message to the chat
router.post("/", async (req, res) => {
  const { userName, message } = req.body;

  if (!userName || !message) {
    return res
      .status(400)
      .json({ message: "User name and message are required" });
  }

  try {
    const newMessage = new ChatMessage({
      userName,
      message,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all chat messages
router.get("/", async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ time: "asc" });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

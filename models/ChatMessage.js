// models/ChatMessage.js

const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);

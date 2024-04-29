// app.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Allow all origins
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://minhaz:minhaz@cluster0.im4eiq6.mongodb.net/task-management?retryWrites=true&w=majority&appName=Cluster0",
      {}
    );
    console.log("🚀 Connected to MongoDB");
  } catch (err) {
    console.log(`❌ Connection Failed to MongoDB: ${err}`);
  }
};
connectToDB();
// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/chat", require("./routes/chat"));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

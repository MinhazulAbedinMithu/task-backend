// routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod"); // Import z from Zod
const User = require("../models/User");
const { getCurrentUserId } = require("../middleware/user");

const router = express.Router();

// Define Zod schemas for input validation
const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register
router.post("/register", async (req, res) => {
  try {
    // Validate request body against schema
    const { name, email, password, phone } = registerSchema.parse(req.body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Save the user
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod validation error
      return res.status(400).json({ message: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Validate request body against schema
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "8h" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod validation error
      return res.status(400).json({ message: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    // Get user information from request
    const userId = getCurrentUserId(req);

    // Fetch user profile from database
    const user = await User.findById(userId);

    // Send user profile in response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update user profile
router.post("/profile", async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate request body
    const userData = profileUpdateSchema.parse(req.body);

    // Update user profile in database
    await User.findByIdAndUpdate(userId, userData);

    res.status(200).json({ message: "User profile updated successfully" });
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

// Change user password
router.post("/change-password", async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate request body
    const { currentPassword, newPassword } = passwordChangeSchema.parse(
      req.body
    );

    // Fetch user from database
    const user = await User.findById(userId);

    // Compare current password with stored password
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password in database
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  // Here, you may want to handle additional tasks like blacklisting the token if needed.
  // For simplicity, we'll just send a success response without any further action.

  res.json({ message: "Logout successful" });
});

module.exports = router;

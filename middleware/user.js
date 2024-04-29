// middleware/user.js

const jwt = require("jsonwebtoken");

const getCurrentUserId = (req) => {
  // Extract token from Authorization header
  const token = req.header("Authorization");

  // Verify token and extract user ID
  const decoded = jwt.verify(token, "secret"); // Replace 'your-secret-key' with your actual JWT secret key

  // Extract user ID from decoded token
  const userId = decoded.userId;

  return userId;
};

module.exports = { getCurrentUserId };

// middleware/auth.js

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization");

  // Check if token doesn't exist
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization denied, please log in" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "secret");

    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authMiddleware };

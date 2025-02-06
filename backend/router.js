const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./schemas/User");

// Function to create JWT token
const createToken = (userId) => {
  const payload = { userId };
  const secretKey = process.env.KEY;
  const options = { expiresIn: "1h" };
  return jwt.sign(payload, secretKey, options);
};

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Step 1: Find user by username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  // Step 2: Compare password with stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({ message: "Invalid password" });
  }

  // Step 3: Create a JWT token
  const token = createToken(user._id);

  // Step 4: Set the token in cookies (secure and httpOnly flags)
  res.cookie("token", token, {
    secure: process.env.NODE_ENV === "production", // Only true in production (use HTTPS in prod)
    httpOnly: true, // Prevent client-side access to the cookie
    maxAge: 3600000, // 1 hour
    sameSite: "strict", // Strict mode for cookies (enhances security)
  });

  // Step 5: Send the response with a message
  res.status(200).send({ message: "Login successful", token });
});

module.exports = router;

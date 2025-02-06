const express = require("express");
const router = express.Router();
const authenticateUser = require("./middleware"); // Correct import for authentication

// Protected route
router.get("/dashboard", authenticateUser, (req, res) => {
  res
    .status(200)
    .send({ message: "Welcome to the dashboard!", user: req.user });
});

module.exports = router;

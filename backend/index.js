
const express = require("express");
const app = express();
const port = 3001;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./schemas/User"); // User schema
const router = express.Router(); // Define your router here

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    await mongoose.disconnect();
    console.log("Error:", error);
  }
}

run().catch(console.dir);

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Sign-In Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Create JWT token
  const token = jwt.sign({ userId: user._id }, process.env.KEY, {
    expiresIn: "1h",
  });

  // Send the token in the response
  res.status(200).json({ message: "Login successful", token });
});

// Protect routes with JWT
const authenticateUser = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    }
    return res.status(403).json({ message: "Invalid token." });
  }
};

app.use(router); // Use the router with the defined routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// inside of this have a function which 
// gets the JWT token from the cookies and decodes it and passes it to the next function. 
const jwt = require("jsonwebtoken"); // Assuming you're using JWT for authentication

const authenticateUser = (req, res, next) => {
    console.log(JSON.stringify(req.cookies))
  const token = req.cookies?.token; // Read token from cookies

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY); // Verify token
    req.user = decoded; // Attach user info to request
    next(); // Proceed to next middleware/route
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authenticateUser;

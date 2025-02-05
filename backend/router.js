const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const User = require("./schemas/User")
const authenticateUser = require("./middleware.js")


const createToken = (userId) => {
    // Define the payload (data to store inside the JWT)
    const payload = {
      userId: userId,  // Add user ID to the payload
    };
  
    // Define your secret key (this should be kept private and secure)
    const secretKey = process.env.KEY;  // Change this to a secure key
  
    // Set options like the expiration time (optional)
    const options = {
      expiresIn: '1h',  // Token will expire in 1 hour
    };
  
    // Create the token
    const token = jwt.sign(payload, secretKey, options);
  
    return token;
  };
  

const getFromDB = (request, response) => {response.send('qq')}

const login = async (req, res) => {

    const { username, password} = req.body;

    const user = await User.findOne({
        username, 
        password
    })

    if (!user) {
        return res.sendStatus(404);
    }

    const token = createToken(user._id)

    console.log(`the token is ${token}`)

    res.cookie("token", token, {
        secure: process.env.NODE_ENV !== "development",
        httpOnly: true,
        maxAge: 3600000 // 1 hour in milliseconds
    });

    res.sendStatus(200)

}   
 
router.get('/chats', getFromDB)
router.post("/login", login)
router.get("/testing", authenticateUser, (req, res) => {
    console.log(req.user)
    res.sendStatus(200)
})

module.exports = router
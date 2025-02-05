const express = require('express')
const app = express()
const port = 3001
const cookieParser = require("cookie-parser")

const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require('cors')

const router = require('./router')
const User = require('./schemas/User')

app.use(express.json())
app.use(cors())
app.use(cookieParser())
dotenv.config()

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {

  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(process.env.MONGODB_URL, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }

}

run().catch(console.dir);

/*
app.use(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const user = await User.findOne({ token: authHeader });
  if (user) {
    next();
  } else {
    res.sendStatus(403);
  }
});
*/

app.use(router)

app.get('/', (req, res, next) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
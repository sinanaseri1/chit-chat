const express = require('express')
const router = express.Router()

const getFromDB = (request, response) => {response.send('qq')}

router.get('/chats', getFromDB)

module.exports = router
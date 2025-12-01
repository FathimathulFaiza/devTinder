
const express = require('express')

const requestRouter = express.Router()   // creating an express router

const { userAuth } = require('../middlewares/auth') // middleware for checking the validation of emailid and password


// sending connection request Api

requestRouter.post('/sendConnectionRequest',userAuth,(req,res)=>{  // calling the userAuth middleware to authenticate the user
    const user = req.user
    // sending a connection request
    console.log("sending a connection request")

    res.send(user.firstName + " sent the connection Request!")
})






module.exports = requestRouter    // exporting the requestRouter
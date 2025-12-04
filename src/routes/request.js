
const express = require('express')

const ConnectionRequest = require('../models/connectionRequest')
const requestRouter = express.Router()   // creating an express router
const { userAuth } = require('../middlewares/auth') // middleware for checking the validation of emailid and password
const User = require('../models/user')


// sending connection request Api       ->    fromUserId to toUserId -> sending the id of the person we want to send request
// userAuth -> checks the token from cookies , fromUserId is logged in user ,attaches found user in to req.user
// :status -> dynamic
requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req,res)=>{  // calling the userAuth middleware to authenticate the user
    try{

        const fromUserId = req.user._id        // -> user who is logged in sending the request
        const toUserId = req.params.toUserId   // -> userId in the req.params -> user who recieves the request
        const status = req.params.status     // -> status : " interested " or " ignored "


// This creates a new document using your ConnectionRequest model.
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

// validation for 'status' coming from url

        const allowedStatus = ["ignored","interested"]

        if(!allowedStatus.includes(status)){
            return res.status(400).json("Invalid Status Type! " + status)
        }

  
 // checking the 'toUserId' is exists or present in our database , then only it can send or recieve connections

        const toUser = await User.findById(toUserId)

        if(!toUser){
            res.status(404).json( {message : "User Not Found..!"} )
        }
 
 


 // finding wheather the connection request already exists or the 'toUserId' has sent the connection request -> to 'fromUserId' already
 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                { fromUserId,toUserId },     // checking is there any existing connection request
                { fromUserId : toUserId, toUserId : fromUserId }    //
            ]
        })

        if(existingConnectionRequest){      // if already finds a connection requests -> ERROR..!
            return res.status(400).send("Connection Requests Already Exists..!")
        }






// save to database
        const data = await connectionRequest.save()

         return res.json({
            message : `${req.user.firstName} is ${status} in ${toUser.firstName}` })

    }
    catch(err){
        res.status(400).send("ERROR..!" + err.message)
    }

  


})






module.exports = requestRouter    // exporting the requestRouter
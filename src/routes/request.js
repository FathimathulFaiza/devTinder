
const express = require('express')

const ConnectionRequest = require('../models/connectionRequest')
const requestRouter = express.Router()   // creating an express router
const { userAuth } = require('../middlewares/auth') // middleware for checking the validation of emailid and password
const User = require('../models/user')


// Receiver-side request review”
// sending connection request Api       ->    fromUserId to toUserId -> sending the id of the person we want to send request
// userAuth -> checks the token from cookies , fromUserId is logged in user ,attaches found user in to req.user
// :status -> dynamic       => http://localhost:7777/request/send/interested/692e885fed223224b4aa7028

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





// api for "accepted" or "rejected" dynamically from reciever side  => http://localhost:7777/request/review/accepted/69313d34a69a29bfeeef970c

requestRouter.post('/request/review/:status/:requestId', userAuth , async (req,res)=>{

    try{
       const loggedInUser = req.user  // extracting the id of logged in user from req.body

       const { status ,requestId } = req.params   // extracting status and request id from req.params (dynamic) -> onnectionRequest id from db


       // checking whether the requestId and  status are allowed (except "rejected" or "ignored")
    const allowedStatus = ["accepted", "rejected" ]
    
    if(!allowedStatus){
      return res.status(400).json({message : "Status Not Allowed..!"})
      

    }

// find the request Id is present in the db
    const connectionRequest = await ConnectionRequest.findOne({
        _id : requestId,   // -> id from connection request collection from database
        toUserId : loggedInUser._id,   // -> the person who gets the request 
        status : "interested"
    })



// if there is no such connection request
    if(!connectionRequest){
       return res.status(400).json({message : "Connection Request Not Found..!"})
    }

// if everything is ok, the  change the status of the connectio request is to dynamic status -> accepted / rejected
    connectionRequest.status = status


// save the data
    const data = await connectionRequest.save()

   return res.json({
   message: "Connection Request "  + status , data
  
})
    }
    catch(err){
        res.status(400).send("ERROR..!" + err.message)
    }
   
})






module.exports = requestRouter    // exporting the requestRouter 
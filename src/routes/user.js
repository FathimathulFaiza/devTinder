
const express = require('express')
const { userAuth } = require('../middlewares/auth')
const userRouter = express.Router()
const ConnectionRequest = require('../models/connectionRequest')

const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills " // data shown for the user  

// api for getting all the pending request for the logged in user

userRouter.get('/user/requests/recieved', userAuth, async (req,res)=>{
     try{
        const loggedInUser = req.user

// find the connection requests
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId",USER_SAFE_DATA) // -> asking to user collection to give the details of firstName & lastName along with (JOINING 2 COLLECTIONS)


        res.json({
            message : "Data fetched successfully..",
            data : connectionRequests
        })


     }
     catch(err){
        res.status(400).send("ERROR..!" + err.message)

     } 
    
})



// retrieve all connections of the log

userRouter.get('/user/connections', userAuth, async (req,res)=>{
    try{

        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            $or :[
                {toUserId : loggedInUser._id, status : "accepted"}, //requests the user accepted from others, and requests the user sent — as long as status is accepted.
                {fromUserId : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)

        const data = connectionRequests.map((row) => row.fromUserId)

        res.json({data})

    }
    catch(err){
        res.status(400).send({message : err.message})
    }
})



module.exports = userRouter


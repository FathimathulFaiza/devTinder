
const express = require('express')
const { userAuth } = require('../middlewares/auth')
const userRouter = express.Router()
const connectionRequest = require('../models/connectionRequest')


// api for getting all the pending request for the logged in user

userRouter.get('/user/requests/recieved', userAuth, async (req,res)=>{
     try{
        const loggedInUser = req.user

// find the connection requests
        const connectionRequests = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "skills", "about"]) // -> asking to user collection to give the details of firstName & lastName along with


        res.json({
            message : "Data fetched successfully..",
            data : connectionRequests
        })


     }
     catch(err){
        res.status(400).send("ERROR..!" + err.message)

     } 
    
})



module.exports = userRouter


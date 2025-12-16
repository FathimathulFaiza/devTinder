
const express = require('express')
const { userAuth } = require('../middlewares/auth')
const userRouter = express.Router()
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills about " // data shown for the user  

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



// retrieve all connections of the logged in user

userRouter.get('/user/connections', userAuth, async (req,res)=>{
    try{

        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            $or :[
                {toUserId : loggedInUser._id, status : "accepted"}, //requests the user accepted from others, and requests the user sent — as long as status is accepted.
                {fromUserId : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({data})

    }
    catch(err){
        res.status(400).send({message : err.message})
    }
})



// /feed api ->  gets you the profile of other users on platform || Shows you new developer profiles 

userRouter.get('/feed',userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user

        const page = parseInt(req.query.page) || 1  // extract the page no from req.params and convert the string no. into integer => /feed?page=1&limit=10
        
        let limit = parseInt(req.query.limit) || 10 // extract the limit from req.params or set the limit to 10

        // if the limit more than 50 , then set limit to 50 by default, else limit = that number (beloe 50)
       if (limit > 50) {
        limit = 50;
     } else {
     limit = limit;
}

        const skip = (page - 1) * limit      // formula to skip the user


        // find out all the connection either the user sent or he recieved (sent + recieved -> shouldnt show )
        const connectionRequests = await ConnectionRequest.find({
            $or :[{fromUserId : loggedInUser._id},     // sent  by loggedInInUser
                {toUserId : loggedInUser._id}          // recieved
            ]
        }).select("fromUserId toUserId")   // what to show

 // hide the users from '/feed'  -> find 'unique' people -> to not to show on feed

      const hideUsersFromFeed = new Set()
      connectionRequests.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString())
        hideUsersFromFeed.add(req.toUserId.toString())
      })

      console.log(hideUsersFromFeed)



// find all users from 'User' collection who is not present in the  'hideUserFromFeed' Array. -> users show on feed -> except from 'hideUsersFromFeed' Array
// hide his own profile -> loggedInUser

         const users = await User.find({
         $and : [
        {_id : { $nin : Array.from(hideUsersFromFeed) }},  // users _id 'not-in' hideUsersFeed array
        {_id : { $ne : loggedInUser._id}}     // users _id 'not-equal' to loggedInUser
         ]
     }).select(USER_SAFE_DATA).skip(skip).limit(limit)     // shows only this data, skip the no.of user & put a limit for users showing
     

     res.json({data : users})   // show all the other users in db


    }
    catch(err){
        res.status(400).json({message : err.message})
    }
})

module.exports = userRouter


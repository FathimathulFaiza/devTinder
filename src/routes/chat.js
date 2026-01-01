
const express = require('express')
const {userAuth } = require('../middlewares/auth')
const Chat = require("../models/chat");

const chatRouter = express.Router()


// api for loading the previous chat
chatRouter.get("/chat/:targetUserId",userAuth, async (req,res) =>{
    const {  targetUserId } = req.params
 
    const userId = req.user._id
      
    try{
        let chat =  await Chat.findOne({
            participants : { $all : [userId, targetUserId]}
        }).populate({
            path : "messages.senderId",
            select : "firstName lastName"
        })

        if(!chat){             // if empty chat, no previous chat before
            chat = new Chat({
                participants : [userId, targetUserId],
                messages : []
            })
            await chat.save()
        }
        res.json(chat)


    }
    catch(err){
        console.log(err)
    }


})



module.exports = chatRouter
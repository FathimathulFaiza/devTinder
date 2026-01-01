
const socket = require('socket.io')
const crypto = require('crypto')
const Chat = require("../models/chat");


// hashing the roomId (secret)
const getSecretRoomId = (userId, targetUserId) =>{
     return crypto
     .createHash("sha256")
     .update([userId, targetUserId].sort().join("_"))
     .digest("hex")
}


// initializing the web socket
const initializeSocket = (server) =>{

    const socket = require("socket.io");


const io = socket(server, {
  cors : {
    origin : "http://localhost:5173"
  }
})

// accept connections -> recieving connections
io.on ("connection",(socket) =>{
// event handlers

  socket.on('joinChat', ({firstName, userId, targetUserId})=>{   // -> creating a seperate roo for indivitual chats with 'unique id'
    const roomId = getSecretRoomId(userId,targetUserId)

    console.log(firstName + " joined the  room : " + roomId)
    socket.join(roomId)
  })



  socket.on('sendMessage',async ({firstName,lastName, userId, targetUserId, text })=>{
         

// save message to the database
      
    try{
          if (!text || !text.trim()) {
      return; // ⛔ block empty messages
          }

        const roomId = getSecretRoomId(userId,targetUserId)
         console.log(firstName + " " + text)

      let chat =  await Chat.findOne({
        participants : { $all : [userId, targetUserId]}
      })

      // first time chat -> creating a new chat\
      if(!chat){
        chat = new Chat({
          participants : [userId, targetUserId],
          messages : []
        })
      }

      chat.messages.push({
        senderId : userId,
        text
      })

      //save
      await chat.save()
       io.to(roomId).emit("messageRecieved", {firstName, lastName, text})
    }
    catch(err){
        console.log(err)
    }

       
 
  })

  socket.on('disconnect', ()=>{})

  

})
}



module.exports = initializeSocket
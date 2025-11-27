

const express = require('express')

const app = express()

app.use((express.json()))   // middleware to convert the 'json data' to 'js object' from req.body => works for all routes

const connectDB = require("./config/database")   //  => requiring the 'database.js' from the 'confifg' folder

const User = require("./models/user")



app.post('/signup',async (req,res)=>{

    console.log(req.body)
    const user = new User (req.body)    // creating a new instance of user using req.body
    
    try{
        await user.save()
        res.send("user added successfully..")  // saving the user
    }
    catch(err){
        res.status(400).send("error..!! user not saved..!")

    }
  

})


// connecting the database

connectDB()
.then(()=>{
    console.log("Database connected successfully...")

    app.listen(7777,()=> console.log("server running on port 7777")) // connected to the server only after successfully connected to the database

})
.catch((err)=>{
    console.log("Database connection went wrong.!!")

})




const express = require('express')

const app = express()

app.use((express.json()))

const connectDB = require("./config/database")   //  => requiring the 'database.js' from the 'confifg' folder

const User = require("./models/user")



app.post('/signup',async (req,res)=>{
    const user = new User({
        firstName : "fathimathul",
        lastName : "faiza.TK",
        emailId : "fathimthulfaiza@gmail.com",
        password : "faiza123"
    })

    try{
        await user.save()
        res.send("user added successfully..")
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






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


// get users detaols  by emailId ({find})

app.get('/users',async (req,res)=>{
    const userEmail = req.body.emailId

    try{
        const users = await User.find({emailId : userEmail})  // trying to find the users with 'emailId' also can use ({findOne})

        if(users.length === 0){
            res.status(404).send("user not found")
        }
        else{
            res.send(users)
        }
    }
    catch(err){
        res.status(400).send("Something went wrong")
    }
})



// get the users detail by password ({find})

app.get('/users',async(req,res)=>{

    const userPassword = req.body.password 

    try{
        const users = await User.find({password : userPassword})

        if(users.length === 0){
            res.status(404).send("user not found..!")
        }
        else{
        res.send(users)
        }
    }
    catch(err){
        res.status(400).send("something went wrong..!")
    }
})


// get the user by _id ({find :_id})

app.get('/users/:id',async (req,res)=>{

    const userId = req.params.id     // getting id from URL

    try{

        const users = await User.findById({_id : userId})
        console.log(users)

        if(!users){
            res.status(404).send("user not found..!!")
        }
        else{

             res.send(users)
        }
       
    }
    catch(err){
        res.status(404).send("something went wrong..!")
    }
})



// get the all users from the database

app.get('/feed',async(req,res)=>{

    try{
        const users = await User.find({})
        res.send(users)
    }
    catch(err){
        res.status(404).send("Error...! users not avilable..!!")
    }
})





// delete one user through req.params.id  =>  http://localhost:7777/users/6927e880e1116b2b05349611

app.delete('/users/:id',async(req,res)=>{
    const userId = req.params.id     // 6927e880e1116b2b05349611

    try{
        const users = await User.findByIdAndDelete(userId)
        console.log(userId)

    res.send("User deleted Successfully..")

    }
    catch(err){
        res.status(400).send("something went wrong...!")
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


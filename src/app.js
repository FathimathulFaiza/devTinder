

const express = require('express')

const app = express()

app.use((express.json()))   // middleware to convert the 'json data' to 'js object' from req.body => works for all routes

const connectDB = require("./config/database")   //  => requiring the 'database.js' from the 'confifg' folder


const User = require("./models/user")
const user = require('./models/user')
const { validateSignUpData } = require("./utils/validation")
const bcrypt = require('bcrypt')     //   requiring the 'bcrypt' library function for password hashing




app.post('/signup',async (req,res)=>{

    console.log(req.body)
    

    try{

        // validation of data

        validateSignUpData(req)

        // hashing password  🚀 We NEVER decode the hash. We only compare new hash with old hash.

        const { firstName, lastName, emailId, password } = req.body    // only thse datas are allowes to store


        // encrypting password

        const passwordHash = await bcrypt.hash(password,10)    // 10 -> saltrounds
        console.log(passwordHash)    // $2b$10$JnErssTMsvTkmrqfDyAZDOYyOVBhsJm9WRBkLsnmHd5ElkhqI1Zg2


             // creating a new instance of User model  -> only these datas are allowed
    const user = new User ({

        firstName,
        lastName,
        emailId,
        password : passwordHash    // password = passwordHash    -> hashed password

    })   
    
        // save the user to DB
        
        await user.save()
        res.send("user added successfully..")  // saving the user
    }
    catch(err){
        console.log("PATCH ERROR:", err);
        res.status(400).send(err.message)

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



// update the existig data of the user -> patch

app.patch('/users/:id',async(req,res)=>{          //  =>   http://localhost:7777/users/69286351229afb2bc5e8ca56
    const userId = req.params.id
    const data = req.body

  

    try{
          console.log(userId)
    console.log(data)

    const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills","lastName"]   // validation for user to allow only specefic items 

    const isUpdateAllowed = Object.keys(data).every((key)=>{   // loop through object
        return ALLOWED_UPDATES.includes(key)
    })

    if(!isUpdateAllowed) {
        throw new Error("update not allowed..!")
    }


    if(data.skills && data?.skills.length > 5){
        throw new Error ("Skills cannot be added more than 5..!")   // validation for adding skills more than 5 is not allowed
    }



        const users = await User.findByIdAndUpdate(userId,data,{

            returnDocument : "after",    // Give me the updated user data after updating

            runValidators : true      // checking validator for patch updating   => ensures validation during updates

        })
        console.log(users)
        res.send("user updated successfully..") 

        }
        catch(err){
                console.log("PATCH ERROR:", err);
            res.status(400).send(err.message)
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


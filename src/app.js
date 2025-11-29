

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')     //   requiring the 'bcrypt' library function for password hashing
const cookieParser = require('cookie-parser')
const connectDB = require("./config/database")   //  => requiring the 'database.js' from the 'confifg' folder
const jwt = require("jsonwebtoken")


app.use((express.json()))   // middleware to convert the 'json data' to 'js object' from req.body => works for all routes
app.use((cookieParser()))



const User = require("./models/user")


const { validateSignUpData } = require("./utils/validation")



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

// login API & validating the emailId and Password

app.post('/login',async(req,res)=>{

    try{

        const { emailId, password } = req.body

        const user = await User.findOne({emailId : emailId})

        if(!user){
            throw new Error("Email id is not present in the DataBase")
        }

        const isPasswordValid = await bcrypt.compare(password,user.password) // comparing the normal passwprd with hashed password

        // creating JWT token

        if(isPasswordValid){ 
            
            const token = await jwt.sign({_id : user._id},"DevTinder123")
            console.log(token)

            // add the token to the cookie ans send back the response to the user

            res.cookie("token",token)
            res.send("Login Successfull..")

        }
        else{
            throw new Error("Password not corect..!!!")
        }
    }
    catch(err){
        res.status(400).send("ERROR..!!" + err.message)
    }
})


// /profile api

app.get('/profile',async(req,res)=>{

try{
    const cookies = req.cookies
const { token } = cookies

// validate the token
if(!token){
    throw new Error("Inavalid token")
}

const decodedMessage = await jwt.verify(token,"DevTinder123")
console.log("decodedMessage : ",decodedMessage)

const { _id } = decodedMessage

console.log("Logged in user is : " + _id)

const user = await User.findById(_id)
    res.send(user)

    if(!user){
        throw new Error("User does not exist..!")
    }

}
catch(err){
    res.status(400).send("ERROR..!!" + err.message)
}
})

// get users details  by emailId ({find})

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


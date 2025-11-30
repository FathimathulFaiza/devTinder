

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
const { userAuth } = require('./middlewares/auth')



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

app.get('/profile',userAuth,async(req,res)=>{      // userAuth is a middleware to find the user in the database 

try{

const user = req.user
res.send (user)

}
catch(err){
    res.status(400).send("ERROR..!!" + err.message)
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


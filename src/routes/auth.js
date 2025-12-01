
// creating a  router

const express = require('express')
const authRouter = express.Router() 

const { validateSignUpData } = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require('bcrypt')     //   requiring the 'bcrypt' library function for password hashing



// signup -> 
authRouter.post('/signup',async (req,res)=>{

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

authRouter.post('/login',async(req,res)=>{

    try{

        const { emailId, password } = req.body

        const user = await User.findOne({emailId : emailId})

        if(!user){
            throw new Error("Email id is not present in the DataBase")
        }

        const isPasswordValid = await user.validatePassword(password) // comparing the normal passwprd with hashed password

        // creating JWT token

        if(isPasswordValid){ 
            
            const token = await user.getJWT()

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





module.exports = authRouter;  // exporting the aythRouter file
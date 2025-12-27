
// creating a  router
console.log("✅ authRouter loaded");

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

       const savedUser =  await user.save()

          const token = await savedUser.getJWT()

            // add the token to the cookie and send back the response to the user

          res.cookie("token", token, {
  httpOnly: true,
  secure: false,       // true only in HTTPS
  sameSite: "lax",
  path: "/",
  expires: new Date(Date.now() + 8 * 3600000)
})

        res.json({message : "user added successfully..",data : savedUser })  // saving the user
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
        
           if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Request body is empty");
    }

        const user = await User.findOne({emailId : emailId})

        if(!user){
            throw new Error("Invalid Credentials!")
        }

        const isPasswordValid = await user.validatePassword(password) // comparing the normal password with hashed password

        // creating JWT token

        if(isPasswordValid){ 
            
            const token = await user.getJWT()

            // add the token to the cookie and send back the response to the user

            res.cookie("token",token, { expires : new Date(Date.now() + 8 * 3600000),
            httpOnly: true, 
            secure : false,
            sameSite : "lax",
           
        })                          // create cookie  & expires after 8 hours

   res.json({
        message: "Login Successful!",
        data: user
    })

        }
        else{
            throw new Error("Invalid Credentials!")
        }
    }
    catch(err){
        res.status(400).send("ERROR..!!" + err.message)
    }
})


//  logout API

authRouter.post('/logout',async (req,res)=>{   // no need of user authentication -> only removing the cookies

    res.cookie("token",null, { expires : new Date(Date.now())})  // set the cookie token to 'null' , remove the token from the cookie, expire the cookie 'now'

    res.send("Logout Successfull..")
})



authRouter.get("/test", (req, res) => {
  res.send("AUTH ROUTER WORKING");
});


module.exports = authRouter;  // exporting the aythRouter file
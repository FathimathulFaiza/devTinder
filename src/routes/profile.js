
const express = require('express')

const profileRouter = express.Router()    // creating a router
const { userAuth } = require('../middlewares/auth')     // middleware for checking the validation of emailid and password



// /profile api

profileRouter.get('/profile',userAuth,async(req,res)=>{      // userAuth is a middleware to find the user in the database 

try{

const user = req.user
res.send (user)

}
catch(err){
    res.status(400).send("ERROR..!!" + err.message)
}
})




module.exports = profileRouter    // exporting the profileRouter
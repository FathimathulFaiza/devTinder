

const jwt = require('jsonwebtoken')
const User = require('../models/user')




const userAuth = async (req,res,next) =>{

    // read the token from cookies
try{
    const { token } = req.cookies
   
    if(!token){          // if token not found in req
        throw new Error("Token is not valid..!!")
    }

    const decodedObj = await jwt.verify(token,"DevTinder123")

    const {_id } = decodedObj

    const user = await User.findById(_id)

    if(!user){
        throw new Error("user not found..!")
    }

    req.user = user   // attaching the user found in the database and call the next

    next()    // if token is found and user is valid, then call the next()
}
catch(err){
    res.status(400).send("ERROR..! " + err.message)
}
}








module.exports = { userAuth }
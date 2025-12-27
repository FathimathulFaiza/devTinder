
const express = require('express')

const profileRouter = express.Router()    // creating a router
const bcrypt = require('bcrypt')   // hash the password

const { userAuth } = require('../middlewares/auth')     // middleware for checking the validation of emailid and password
const { validateEditProfileData } = require('../utils/validation')




//  /profile/view  API

profileRouter.get('/profile/view',userAuth,async(req,res)=>{      // userAuth is a middleware to find the user in the database 

try{

const user = req.user
res.send (user)

}
catch(err){
    res.status(400).send("ERROR..!!" + err.message)
}
})


// /profile/edit  API

profileRouter.patch('/profile/edit', userAuth, async (req,res)=>{
    try{
        if (!validateEditProfileData(req)){          // if the profile data is not valid it will throw an Error
            throw new Error ("Invalid Edit Request")
        }
        const loggedInUser = req.user   // this user is attached by the 'userauth' middleware -> shows the data of 'logged in' user

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))  // to edit the new data -> loop through all the keys and what ever the data in each key of the logged user should be eqaul to the new data which is coming from the req.body (change)

         await loggedInUser.save()  // save the updated data in db

        console.log(loggedInUser) // edited new data

                res.send({
    message: `${loggedInUser.firstName}, Your Profile Updated Successfully..`,
    user: loggedInUser
})
    }
    catch(err){
        res.status(400).send("ERROR.! " + err.message )
    }
})


// /profile/password API  -> forgot/ change password

profileRouter.patch('/profile/password', userAuth , async(req,res)=>{
    try{
        const { oldPassword, newPassword } = req.body

        // check both fields are exist
        if(!oldPassword || !newPassword){
            throw new Error("Old and new password are required..!")
        }

        // validate new password length
        if(newPassword.length < 8){
            throw new Error ("New password must atleast 8 characters..!")
        }

        const loggedInUser = req.user

        // compare old password with stored hashed password
        const isPasswordValid = await loggedInUser.validatePassword(oldPassword)

        if(!isPasswordValid){
            throw new Error ("Od password is Incorrect..!")
        }

        // hash the new password
        const passwordHash = await bcrypt.hash(newPassword ,10)

        // update and save
        loggedInUser.password = passwordHash
        await loggedInUser.save()

        res.send("Password updated Successfully...")

    }
    catch(err){
        res.status(400).send("ERROR..!" + err.message)
    }
})


module.exports = profileRouter    // exporting the profileRouter
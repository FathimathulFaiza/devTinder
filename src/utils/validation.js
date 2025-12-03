 
 const validator = require('validator')

 // function to validate the sign up data
 const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req.body

if(! firstName || !lastName){
    throw new Error("Name is not valid..!")   // validating the names => should have firstName & lastName
}

else if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid...!")   // validating the email
}

else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password..!")
}


 }

// function to validate the edit profile data

validateEditProfileData = (req) => {

    const allowedEditfields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"]

// loop through the keys of req.body & check every field which is coming from the 'req.body' (field) is matching to 'allowedEditfield'

   const isEditAllowed =  Object.keys(req.body).every(field => allowedEditfields.includes(field))

   return isEditAllowed
}



 module.exports = { validateSignUpData, validateEditProfileData }   
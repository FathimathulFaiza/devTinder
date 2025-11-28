 
 const validator = require('validator')

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


 module.exports = { validateSignUpData }   

const mongoose = require("mongoose")
const validator = require("validator")   // install -> npm i vlidator  (for checking hte validation in email,photo url..etc)



const userSchema = new mongoose.Schema({       // these are all called 'schematype options'
    firstName : {
        type : String,
        required : true,
        minLength : 4,     // minimum length of characters -> atleast there should be 4 letters
        maxLength : 50     // maximum no. of characters for the name  -> maximun should be 50

    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        required : true,  // mandatory field -> should be filled
        unique : true,    // must be unique
        lowercase : true,  // automatically converts the uppercase into lowercase
        trim : true,        // trim the extra spaces between from front and back

        validate(value){
            if(!validator.isEmail(value)){         // validating the email address through 'validator' function (data-> email)
                throw new Error("Invalid email address..!")
            }
        }
    },
    password : {
        type : String,
        required : true,
        
        validate(value){       // validating the strong password  -> validator.isStrongPassword function  (value = password)
            if(!validator.isStrongPassword(value)){
                throw new Error ("Please enter a strong password..!")
            }
        }
    },
    age : {
        type : Number,
        min : 18 ,       // minimum age of the user is 18 to signup
        max : 60         // maximum age of user is 60 to signup
    },
    gender : {
        type : String,
        validate(value){
            if (!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid..!!")
            }
        }
    },
    
  
    photoUrl : {
        type : String,
        default : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" ,  // by default it will give this img


        validate(value){       // validating the address of photo Url using -> validator.isURL  function  , value = url of photo

            if(!validator.isURL(value)){
                throw new Error ("Inavalid photo URL address")
            }
        }
    },
    about : {
        type : String,
        default : "this is a default info about user"    // by default this info is shown in the db
    },
    skills : {
        type : [String]
    }
  

    
},{
    timestamps : true     // this methode is used for registering the => created and updated time 
})


  // User is a collection

module.exports = mongoose.model("User",userSchema)   // exporting the user collectiona
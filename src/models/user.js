
const mongoose = require("mongoose")

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
        trim : true        // trim the extra spaces between from front and back
    },
    password : {
        type : String,
        required : true
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
    age : {
        type : Number
    },
    photoUrl : {
        type : String,
        default : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"   // by default it will give this img
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
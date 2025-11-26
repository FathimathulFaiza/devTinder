
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String
    },
    password : {
        type : String
    },
    age : {
        type : Number
    },
    gender : {
        type : String
    }
})


  // User is a collection

module.exports = mongoose.model("User",userSchema)   // exporting the user collectiona
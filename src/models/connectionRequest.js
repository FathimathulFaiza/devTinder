
const mongoose = require('mongoose')

// creating new connectionRequest schema (information to store)
const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,     // type of the useerId is 'ObjectId'
        ref : "User",      // creating a link or -> reference to the 'user' collection (JOINING 2 COLLECTIONS)
        required : true     // mandatory field
    },
    toUserId :{ 
        type : mongoose.Schema.Types.ObjectId ,     // type -> objectId
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored","interested","accepted","rejected"],  //This field can only be one among these allowed options.other wise mongodb throws an error!
            message : `{VALUE} is incorrect status type`
        },
    },
},
{
timestamps : true
})


// creating 'compund index' to search faster about fromUserId and toUserId
    connectionRequestSchema.index({fromUserId : 1, toUserId : 1})



// checking and validating that the same user is again sending the connection request to himself (both are same) -> using 'mongoose pre'
// 'pre' -> it is like a middleware, it function will run before saving in the db, also call 'next()'

       connectionRequestSchema.pre("save", async function(next){
console.log("✔️ pre-save hook triggered:", this.fromUserId, this.toUserId); // id of toUser & from/user
        const connectionRequest = this;

        if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
            
            throw new Error("Cannot send connection request to yourself..!!")
        }
    

       })



// create a Collection named 'connectionRequest', connect the schema with that collection , 
const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequestModel

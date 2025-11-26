
const mongoose = require("mongoose")


const connectDB = async ()=>{

    await mongoose.connect(
       "mongodb+srv://fathimthulfaiza_db_user:pachi786@firstcluster.7xjv7ke.mongodb.net/devTinder?appName=FirstCluster"
    )
}
module.exports = connectDB




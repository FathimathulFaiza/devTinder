
const mongoose = require("mongoose")


const connectDB = async ()=>{
 console.log("👉 DB URI:", process.env.DB_CONNECTION_SECRET);
    await mongoose.connect(
      process.env.DB_CONNECTION_SECRET
    )
}
module.exports = connectDB




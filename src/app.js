

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const connectDB = require("./config/database")   //  => requiring the 'database.js' from the 'confifg' folder


app.use((express.json()))   // middleware to convert the 'json data' to 'js object' from req.body => works for all routes
app.use((cookieParser()))


// import the routes
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')


// use the router  ('/') -> means it will run for all the routes ,All requests starting with / will go through all these routers, and Express will try to match the route inside each router.
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)

















// connecting the database

connectDB()
.then(()=>{
    console.log("Database connected successfully...")

    app.listen(7777,()=> console.log("server running on port 7777")) // connected to the server only after successfully connected to the database

})
.catch((err)=>{
    console.log("Database connection went wrong.!!")

})


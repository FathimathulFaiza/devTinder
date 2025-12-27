

require("dotenv").config();

const express = require('express')
const cors = require("cors")   // requiring the cors middleware for api fetch
const cookieParser = require('cookie-parser')
const connectDB = require("./config/database")   //  => requiring the 'database.js' from the 'confifg' folder

require("./utils/cronJob.js")   // requiring cron-job file from folder

const app = express()



app.use(express.json())   // middleware to convert the 'json data' to 'js object' from req.body => works for all routes
app.use(cookieParser())


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));



console.log("🔥 App started, loading routers...");

// import the routes
console.log("📦 loading authRouter...");

const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')
const paymentRouter = require('./routes/payment.js')






// use the router  ('/') -> means it will run for all the routes ,All requests starting with / will go through all these routers, and Express will try to match the route inside each router.
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)
app.use('/',paymentRouter)



const PORT = process.env.PORT || 7777;


// connecting the database
connectDB()
.then(()=>{
    console.log("Database connected successfully...");
    // Only start the server AFTER the database is connected
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
})
.catch((err)=>{
    console.log("Database connection went wrong.!!");
    console.error(err);
});

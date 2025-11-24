
const express = require('express')

const app = express()


// error handling middleware

app.use('/',(err,req,res,next)=>{

    console.log("handling errors...!!")

    if(err){

    res.status(500).send("Something went wrong...!!!")
    }
})


// handling an errocured user route

app.get('/user',(req,res)=>{
    // try{
    //  writing logic of DB call and user data

    throw new Error("vcvdbcvsgbckjh")

    res.send("User data sent")
   //}

   // catch(err){

   // res.status(500).send("something went wrong..please contact the support team..!!")
   
   //}
})





app.listen(7777,()=> console.log("server running on port 7777")) 
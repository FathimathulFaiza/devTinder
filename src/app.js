
const express = require('express')

const app = express()



// app.use("/",(req,res,next)=>{
     
//       res.send("WELCOME FROM HOME PAGE")

//          next()

// })



// admin Authoriztion middleware

app.use('/admin',(req,res,next)=>{

    console.log("Authorizing the Admin")

    const tocken = 1233

    const authorization = true

    if(tocken === 123 && authorization === true){

       next()
    }

    else{
        console.log("this is not an Admin")

        res.status(401).send("Access Denied...!!")
    }
})


// Admin routes

app.get('/admin/data',(req,res)=>{
    res.send("data sent to the Admin")
})

app.get('/admin/delete',(req,res)=>{
    res.send("data deleted by admin")
})



// user Authentication middleware

app.use('/user',(req,res,next)=>{

    let token = 1288
    let isUser = true

    if(token === 123 && isUser === true){
        console.log("User is Authenticating..!")
        next()
    }
    else{
        console.log(" Not a User")
        res.status(401).send("This is not a User")
    }
})



// User routes

app.get('/user/login',(req,res)=>{
    res.send("User Logged in successfully..")
})

app.get('/user/profile',(req,res)=>{
    res.send("user Profile Checked")
})




app.listen(7777,()=> console.log("server running on port 7777")) 
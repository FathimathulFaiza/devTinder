
const express = require('express')

const app = express()

app.use("/",(req,res)=>{
    res.send("WELCOME FROM HOME PAGE")
})


app.use('/user',(req,res)=>{
    res.send("Helllo from the server...")
})


app.listen(3000,()=> console.log("server running on port 3000")) 
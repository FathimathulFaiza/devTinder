
const express = require('express')

const app = express()


app.get('/user',(req,res)=>{
    res.send({firstName : "Fathimathul", secondName : "Faiza"})
})

app.post('/user',(req,res)=>{
    res.send("data posted in the database successfully")
})

app.delete('/user',(req,res)=>{
    res.send("user deleted successfully")
})

app.use("/",(req,res)=>{
    res.send("WELCOME FROM HOME PAGE")
})



app.listen(3000,()=> console.log("server running on port 3000")) 

const express = require('express')

const app = express()



app.use("/",(req,res,next)=>{
     
      res.send("WELCOME FROM HOME PAGE")
      
         next()

})

app.use('/',(req,res)=>{
    res.send("this is the 2nd '/' route by calling the next() ")
})




app.listen(7777,()=> console.log("server running on port 7777")) 
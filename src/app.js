
const express = require('express')

const app = express()


// req.query

app.get('/user',(req,res)=>{         // http://localhost:3000/user?userId=2000    =>  { 'userId ': ' 2000' }

console.log(req.query)

    res.send({firstName : "Fathimathul", secondName : "Faiza"})
})


// req.params

app.get('/users/:userName',(req,res)=>{
    console.log(req.params)

    res.send({newUser : "Asif",password : "aachi786"})
})


// ex : req.query

app.get('/product',(req,res)=>{      //http://localhost:3000/product?productName=mango  =>  the name of the product is mango

    console.log(req.query)
    
    const productName = req.query.product

    res.send(`the name of the product is ${req.query.productName}`)
})



// ex : req.params

app.get('/product/:price',(req,res)=>{     // http://localhost:3000/product/800   => 
   
    console.log(req.params)

    const productPrice = req.params.price

    res.send(`price of the product is here ${productPrice}`)
})



app.post('/user',(req,res)=>{
    res.send("data posted in the database successfully")
})

app.delete('/user',(req,res)=>{
    res.send("user deleted successfully")
})

// app.use("/",(req,res)=>{
//     res.send("WELCOME FROM HOME PAGE")
// })



app.listen(3000,()=> console.log("server running on port 3000")) 
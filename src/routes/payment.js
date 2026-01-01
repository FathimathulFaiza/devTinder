console.log("✅ paymentRouter loaded");


const express = require('express')
const paymentRouter = express.Router()
const {userAuth} = require('../middlewares/auth') 
const razorpayInstance = require('../utils/razorpay')
const Payment = require('../models/payment')
const { membershipAmount } = require('../utils/constants')
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

const User = require('../models/user') 


// testing
paymentRouter.get('/payment/test', (req, res) => {
  res.send("PAYMENT ROUTER WORKING");
});

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
  try {
// made the order dynamic 

    const {membershipType} = req.body

    const {firstName, lastName, emailId} = req.user

    const order = await new Promise((resolve, reject) => {
      razorpayInstance.orders.create(
        {
          amount: membershipAmount [membershipType] * 100,
          currency: "INR",
          receipt: "receipt#1",
          notes: {
            firstName ,
            lastName ,
            emailId ,
            membershipType: membershipType
          }
        },
        (err, order) => {
          if (err) return reject(err)
          resolve(order)     
        }
      )
    })

    console.log("Razorpay Order:", order)

    // save the order in database
    const payment = new Payment({
        userId : req.user._id,
        orderId : order.id,
        status : order.status,
        amount : order.amount,
        currency : order.currency,
        receipt : order.receipt,
        notes : order.notes
    })

    const savedPayment = await payment.save()    // save in db 


    res.json({...savedPayment.toJSON(), keyId : process.env.RAZORPAY_KEY_ID})

  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: err.message })
  }
})


// automatic message sent from a azorpay to your server when an payment happens - webhook

paymentRouter.post('/payment/webhook', async(req,res)=>{
    try{
        const webhookSignature = req.get("X-Razorpay-Signature")   // this how we get our webhook signature header

       const isWebhookValid =  validateWebhookSignature(
        JSON.stringify(req.body),
         webhookSignature,
          process.env.RAZORPAY_WEBHOOK_SECRET) // validate the webhook signature -> return 'true or false'

          // if isWebhookSignature is not valid -> false
          if(!isWebhookValid){
            return res.status(400).json({msg : "webhook signature is  invalid..!!"})
          }

          // if the webhookmis valid , update the payment status in DB (captured or failed )

          const paymentDetils = req.body.payload.payment.entity

          const payment = await Payment.findOne({orderId : paymentDetils.order_Id })

          payment.status = paymentDetils.status

          await payment.save()


          const user = await User.findOne({_id : payment.userId})  // get the user
          user.isPremium = true
          user.membershipType = payment.notes.membershipType

          await user.save()   // save the user



       // update the user as premium

    //    if(req.body.event === "payment.captured"){      // success

    //    }
    //    if(req.body.event === "payment.failed") {       // failed 

    //    }


    // return success response to razorpay
    return res.status(200).json({msg : "Webhook recieved Successfully.."})
    }
    catch(err){
        return res.status(500).json({msg : err.message})

    }
})


paymentRouter.get("/premium/verify",userAuth, async(req,res)=>{
    const user = req.user
    if(user.isPremium){
        return res.json({isPremium : true})
    }
    else{
        return res.json ({isPremium : false})
    }
})



module.exports = paymentRouter

const express = require('express')
const paymentRouter = express.Router()
const {userAuth} = require('../middlewares/auth') 
const razorpayInstance = require('../utils/razorpay')
const Payment = require('../models/payment')
const { membershipAmount } = require('../utils/constants')
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')
const payment = require('../models/payment')
const User = require('../models/user') 


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
        const webhookSignature = req.get["X-Razorpay-Signature"]   // this how we get our webhook signature header

       const isWebhookValid =  validateWebhookSignature(
        JSON.stringify(req.body),
         webhookSignature,
          process.env.RAZORPAY_WEBHOOK_SECRET) // validate the webhook signature -> return 'true or false'

          // if isWebhookSignature is not valid -> false
          if(!webhookSignature){
            return res.status(400).json({msg : "webhook signature is not valid..!!"})
          }

          // update the payment status in DB (captured or failed )

          const paymentdetils = req.body.payload.payment.entity

          const payment = await Payment.findOne({orderId : paymentdetils.orderId })

          payment.status = paymentdetils.status

          await payment.save()


          const user = await User.findOne({_id : payment.userId})  // get the user
          user.isPremium = true
          user.membershiptype = payment.notes.membershipType

          await user.save()   // save the user



          



       // update the user as premium

    //    if(req.body.event === "payment.captured"){      // success

    //    }
    //    if(req.body.event === "payment.failed") {       // failed 

    //    }
    }
    catch(err){
        return res.status(500).json({msg : err.message})

    }
})



module.exports = paymentRouter
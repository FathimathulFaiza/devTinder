const cron = require("node-cron")
const {subDays, startOfDay, endOfDay} = require('date-fns')     // requiring the 'subtracting Days function' from date-dns
const ConnectionRequestModel = require("../models/connectionRequest")
const sendEmail = require("./sendEmail")




// send email to all people who got requests in the previous day

// scheduled cron job to send an email at morning everyday for connection requests

cron.schedule("0 8 * * *", async ()=>{       // 8 : 00 am everyday

    const yesterday = subDays(new Date(), 1) // today - 0  , yesterday - 1 

    const yesterdayStart = startOfDay(yesterday)
    const yesterdayEnd = endOfDay(yesterday)

    const pendingRequests = await ConnectionRequestModel.find({
        status : "interested",
        createdAt : {
            $gte : yesterdayStart,
            $lt : yesterdayEnd
        }
    }).populate("fromUserId toUserId")

    const listOfEmails = [
        ...new Set(pendingRequests.map((req)=>{
            return req.toUserId.emailId
        }))
    ]

    console.log(listOfEmails)

    for(const email of listOfEmails){
        // send emails
        try{
              const res = await sendEmail.run(
                "New Friend Request is Pending for " + email,
                "There ate somany friend Requests Pending , Please login to devTinder"
            )
            console.log(res)

        }
        catch(err){
          console.log("Cronjob Fail ",err.message)
        }
    }

})
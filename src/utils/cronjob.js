
import nodeCron from "node-cron";
import  ConnectionRequest  from "../models/connectionRequest.js";
import { startOfDay, subDays, endOfDay } from "date-fns";
import { run } from "./sendEmail.js";


nodeCron.schedule('0 7 * * *', async () => {


    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday)
        const pendingRequest = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }

        }).populate("fromUserId toUserId")

        const listOfEmails = [...new Set(pendingRequest.map(req => req.toUserId.emailId))]

        for (const email of listOfEmails) {
            try {
                console.log(email)
                const sendEmail = await run(`New friend requests pending for ${email}. Please log into yc-Tinder and check your new friends... `);
                
            } catch (error) {
                console.log(error);
            }

        }
    } catch (error) {

    }

});
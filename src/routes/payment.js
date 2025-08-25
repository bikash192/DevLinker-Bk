const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment=require('../model/payments');
const {membershipAmount}=require('../utils/constants')
paymentRouter.post("/payment/create", authMiddleware, async (req, res) => {
  try {
    const{membershipType}=req.body;
    const{firstName,lastName,email}=req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType]*100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: membershipType,
      },
    });

    //   save it in my database
    console.log(order);

    const payment=new Payment({
        userId:req.user._id,
        orderId:order.id,
        status:order.status,
        amount:order.amount,
        currency:order.currency,
        receipt:order.receipt,
        notes:order.notes
    })
    const savePayment=await payment.save();

    res.json({ ...savePayment.toJSON() ,keyId:process.env.RAZORPAY_KEY_ID});

    // return back my order details to frontend
  } catch (err) {
    res.status(500).send("Internal Server Error " + err.message);
  }
});
module.exports = paymentRouter;

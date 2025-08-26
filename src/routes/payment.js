const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../model/payments");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../model/user");
paymentRouter.post("/payment/create", authMiddleware, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
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

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savePayment = await payment.save();

    res.json({ ...savePayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });

    // return back my order details to frontend
  } catch (err) {
    res.status(500).send("Internal Server Error " + err.message);
  }
});
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature",webhookSignature);
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isWebhookValid) {
      return res.status(404).json({ msg: "webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature")
    const paymentDetails=req.body.payload.pament.entity;

    const payment=await Payment.findOne({orderId:paymentDetails.order_id});
    payment.status=paymentDetails.status;
    await payment.save();
    console.log("Payment Save");

    const user=await User.findOne({_id:payment.userId})

    user.isPremium=true;
    user.membershipType=payment.notes.membershipType;
    await user.save();
    console.log("User Save");

    // Update my payment status in DB

    // Update the user as premium

    // return success response to razorpay
    if (req.body.event === "payment.captured") {
    }

    if (req.body.event === "payment.failed") {
    }

    return res.status(200).json({ msg: "Webhook received Successfully" });
  } catch (err) {
    res
      .status(500)
      .send("Internal Server Error " + process.env.RAORPAY_WEBHOOk_SECRET);
  }
});
module.exports = paymentRouter;

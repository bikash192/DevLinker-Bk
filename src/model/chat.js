const mongoose = require("mongoose");

// ✅ Message Schema
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Sent", "Delivered"], 
      default: "Sent",
    },
  },
  { timestamps: true }
);


const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [messageSchema], 
  
},{ timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);

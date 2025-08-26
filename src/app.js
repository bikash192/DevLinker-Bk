require("dotenv").config();
require("./utils/cronJob");
// require("cronJobs").config();
const mongoose = require("mongoose");
const validator = require("validator");
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./model/user");
const bcrypt = require("bcrypt");
const { validateSignUp } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const { authMiddleware } = require("./middleware/authMiddleware");
const cors = require("cors");

app.use(
  cors({
    origin: "https://dev-linker-web.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookie());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.get("/",(req,res)=>{
  res.send("Server Running SuccessFully");
})
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use('/',paymentRouter);

connectDB()
  .then(() => {
    console.log("Database Connected");
    const PORT = process.env.PORT || 7777;

    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database not connected", err);
  });

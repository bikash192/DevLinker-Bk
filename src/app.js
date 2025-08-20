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
const {authMiddleware}=require('./middleware/authMiddleware')
const cors=require('cors');

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
})
);
app.use(express.json()); 
app.use(cookie());


const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile')
const requestRouter=require('./routes/request')
const userRouter=require('./routes/user');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);
// app.post("/sign", async (req, res) => {
//   try {
//     validateSignUp(req);

//     const { firstName, lastName, email, password } = req.body;
//     const hashPassword = await bcrypt.hash(password, 10);
//     console.log(hashPassword);
//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashPassword,
//     });
//     await user.save();
//     res.send("User added Successfully");
//     // console.log(req.body);
//   } catch (err) {
//     res.status(500).send("User not added: " + err.message);
//   }
// });

// app.get("/user", async (req, res) => {
//   try {
//     const user = await User.find({
//       email: req.body.email,
//     });
//     res.send(user);
//     if (user.length === 0) {
//       res.send("User not present");
//     }
//   } catch (err) {
//     res.status(404).send("Something went wrong", err.message);
//   }
// });

// app.get("/", async (req, res) => {
//   try {
//     const user = await User.find({});
//     res.send(user);
//   } catch (err) {
//     res.status(500).send("Something went wrong: " + err.message);
//   }
// });

// app.delete("/user", async (req, res) => {
//   const userID = req.body.userID;
//   try {
//     const user = await User.findByIdAndDelete(userID);
//     res.send("User deleted Successfully");
//   } catch (err) {
//     res.status(500).send("Somthing went wrong", err.message);
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const AllowedUpdates = ["gender", "about", "age"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       AllowedUpdates.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//     const user = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "after",*-
//       runValidators: true,
//     });
//     console.log(user);
//     res.send("User Updated Successfully");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server error" + err);
//   }
// });

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send("Invaid Credentilas");
//     }
//     const validPassword = await user.validatePassword(password)
//     if (validPassword) {
//       // create Jwt token
//       const token = await user.getJWT();
//       res.cookie("token", token,{
//         expires:new Date(Date.now()+ 8*36000000)
//       });
//       console.log(token);
//       res.send("Login Successfully");
//     } else {
//       return res.send("Invaid credentials");
//     }
//   } catch (err) {
//     res.status(500).send("Internal Server err" + err.message);
//   }
// });

// app.get("/profile", authMiddleware,async (req, res) => {
//   const user=req.user;
//     res.send(user)
//     // console.log(decodedMessage);
// });

// app.post('/sendRequest',authMiddleware,async(req,res)=>{
//   const user=req.user;
//   res.send(user.firstName +" Connection request sent....")
// })
connectDB()
  .then(() => {
    console.log("Database Connected");
    app.listen(7777, () => {
      console.log("Server is listening on Port 7777");
    });
  })
  .catch((err) => {
    console.log("Database not connected", err);
  });

const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const {validateSignUp} = require("../utils/validation");
const User = require("../model/user");

// Signin
authRouter.post("/sign", async (req, res) => {
  try {
    validateSignUp(req);
    const { firstName, lastName, password, email,skills,photoUrl,age,gender,about } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      skills:skills,
      photoUrl:photoUrl,
      age:age,
      gender:gender,
      about:about

    });
    const saveUser=await user.save();
    const token=await saveUser.getJWT();
    res.cookie("token",token,{
      expires:new Date(Date.now()+8*3600000)
    })
    res.json({message:"User added Successfully!!!",data:saveUser});
  } catch (err) {
    res.status(500).send("Internal Server error" + err.message);
  }
});
// login
authRouter.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Invalid Credentials");
    }
    const validPassword = await user.validatePassword(password);
    if (validPassword) {
        const token=await user.getJWT();
        res.cookie("token", token,{
          expires:new Date(Date.now()+ 8*36000000)
        })
        res.send(user);
    } 
    else {
      return res.status(404).send("Invalid Credentials");
    }
   
  } catch (err) {
    res.status(500).send("Internal Server Error" + err.message);
  }
});

// logout

authRouter.post('/logout',async(req,res)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now())
  })
  res.send("Uses logout Sucessfully!!!")
})

module.exports = authRouter;

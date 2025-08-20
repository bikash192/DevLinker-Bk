const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { validateEditProfile } = require("../utils/validation");
const profileRouter = express.Router();
const validator=require('validator')
const bcrypt=require('bcrypt')

profileRouter.get("/profile/view", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
profileRouter.patch("/profile/edit", authMiddleware, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      return res.status(404).send("User cant be updated");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    // console.log(loggedInUser);
    res.send(loggedInUser.firstName+" your profile updated Successfull!!!");
  } catch (err) {
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

profileRouter.patch("/profile/password",authMiddleware,async (req,res)=>{
    const {password,newPassword}=req.body;
    try{
        if(!validator.isStrongPassword(newPassword)){
            return res.status(404).send("New Pasword is not strong")
        }
        const user=req.user;
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.send("Password Updated Successfully!!!");
    }catch(err){
        res.status(500).send('Internal Server Error'+ err.message);
    }
   
})
module.exports = profileRouter;

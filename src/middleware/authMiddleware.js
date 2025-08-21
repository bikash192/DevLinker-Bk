const jwt=require('jsonwebtoken');
const User = require('../model/user');

const authMiddleware=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            return res.status(404).send("Token is not Valid!!!");
        }
        const decodObj=await jwt.verify(token,process.env.JWT_SECRET_KEY);
        const {_id}=decodObj;

        const user=await User.findById(_id);
        if(!user) return res.status(404).send("User not found");

        req.user=user;
        next();

    }
    catch(err){
        res.status(500).send('Internal Server error'+err.message);
    }
}
module.exports={
    authMiddleware
}
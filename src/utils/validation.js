const validator=require('validator');
const validateSignUp=(req)=>{
    const{firstName,lastName,email,password,gender,age,photoUrl,about}=req.body;
    if(!firstName){
        throw new Error("first Name is required");
    }
    else if(firstName.length<4||firstName.length>50){
        throw new Error("first Name should be between 4 and 50");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not Strong");
    }
    else if(age>18){
        throw new Error('Age should be greator than or equal to 18')
    }
}
const validateEditProfile=(req)=>{
    const allowedUpdates=[
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl"
    ]
    const isAllowed=Object.keys(req.body).every((k)=>allowedUpdates.includes(k));
    return isAllowed;
}
module.exports={
    validateSignUp,
    validateEditProfile
}

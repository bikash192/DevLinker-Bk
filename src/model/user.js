const { default: mongoose } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email id is not valid");
        }
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not defined");
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
    photoUrl:{
      type:String,
    validate(value){
      if(!validator.isURL(value)){
        throw new Error('Url is not correct');
      }
    }
    }
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Secret@123", {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const validPassword = await bcrypt.compare(userInputPassword, user.password);
  return validPassword;
};
const User = mongoose.model("User", userSchema);
module.exports = User;

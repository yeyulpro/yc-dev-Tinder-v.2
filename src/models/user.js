import validator from "validator";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';




const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, minLength: 2 },
    last_name: { type: String, required: true, minLength: 2 },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("not valid email format : " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("not strong password format : " + value);
        }
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      
            enum: {
                values: ["female", "male", "others"],// only those values are accepted
                message:`{VALUE} is valid gender type`
            }
    },
    photoUrl: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/profile-anonymous-face-icon-gray-silhouette-person-male-default-avatar-photo-placeholder-isolated-white-background-profile-107327860.jpg"
    },
    about: {
      type: String,
      default: "This is default about section for the user...",
    },
    skills: { type: [String], default: ["javascript", "C#"], minLength: 3 },
  },
  {
    timestamps: true,
  }
);
//helper method ; never use arrow function
userSchema.methods.getJWT =  function () {
  const user = this;
  const token =  jwt.sign({userId:user._id}, process.env.JWT_SECRET, {
    expiresIn: "1h"
  }) 
  return token;
}

userSchema.methods.validatePassword =async function (password) {
   const user = this;
   const isPasswordValid=await bcrypt.compare(password, user.password);
   
  return isPasswordValid;
}
const User = mongoose.model("User", userSchema);
export default User;

import {User} from "../models/user.model.js"
import { loginSchema, signupSchema } from "../validations/auth.validation.js";

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const userSignup = async(req, res)=>{
    const body = req.body;
    const payload = signupSchema.parse(body);
    
    const user = await User.findOne({email:payload.email})
    if(user)
        {
            return res.status(409).json({ message:"User already exist, you can login",success:false})
        }

    const hashedPassword = await bcrypt.hash(payload.password,10)

    const userModel = new User({name: payload.name, email:payload.email, password:hashedPassword})
    await userModel.save();

    return res.status(201).json({success:true, message:"Signed-up successfully"})
    
}

export const userSignin = async(req, res)=>{
    const body = req.body;
    const payload = loginSchema.parse(body);

    const user = await User.findOne({email:payload.email})
    if(!user){
        return res.status(404).json({success:false, message:"No user found with this email"})
    }

    const isPassEqual = await bcrypt.compare(payload.password, user.password)
    if(!isPassEqual){
        return res.status(403).json({success:false, message:"Invalid credentials"})
    }

    const jwtToken = jwt.sign({email:user.email, _id:user._id}, process.env.JWT_SECRET,{
        expiresIn:"10d",
    })

    return res.status(200).json({
        success:true,
        message:"Logged-in successfully",
        jwtToken,
        _id:user._id,
        email:user.email,
        name:user.name
    })

}
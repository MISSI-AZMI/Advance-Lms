import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

export const sendToken = (res,user,message,statusCode)=>
{

    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"15d"})

    const options ={
        expires:new Date(Date.now()+15*24*60*60*1000),
        httpOnly:true,
        secure:true,
        sameSite:"none"
    }

    res.status(201).cookie("token", token , options).json({success:true,message :message,user})
}

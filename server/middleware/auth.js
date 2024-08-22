import jwt from  "jsonwebtoken"
import { CAE } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js";



export const isAuthenticated = CAE(async(req,res,next)=>
{
    const { token } = req.cookies;

    if(!token)
        return next(new ErrorHandler("not logged in",400))

    const decode = jwt.verify(token ,process.env.JWT_SECRET);

    req.user = await User.findById(decode._id);

    next();
})


export const authorizedAdmin = CAE((req,res,next)=>
    {
        
        
        if(req.user.role !== "admin")
           {
            
            return next(new ErrorHandler(`${req.user.role} is not allow to access this resouse`,403))
           }
           
       next();
    })
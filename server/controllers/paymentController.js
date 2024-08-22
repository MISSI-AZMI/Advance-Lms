import { CAE } from "../middleware/catchAsyncError.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import {instance} from "../server.js"

export const buySubscription = CAE(async (req,res,next)=>
{

        const user = User.findById(req.user._id)

    if(user.role==="admin")
    {
        return next (new ErrorHandler("admin caannot buy subscription ",404))
    }

    const subscription =await instance.subscriptions.create({
        plan_id: "plan_7wAosPWtrkhqZw",
        customer_notify: 1,
        total_count: 12,
      });


      user.subscription.id = subscription.id;
      user.subscription.status = subscription.status;


      await user.save();


      res.status(200).json({success:true,subscription});
        
    
})
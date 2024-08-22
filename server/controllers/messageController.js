import { CAE } from "../middleware/catchAsyncError.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

import ErrorHandler from "../utils/errorHandler.js";

export const sendMessage =CAE (async (req,res,next) =>
{

    const {message} = req.body;
    const{ id:receiverId }=req.params;
    const senderId = req.user._id;
    
    let conversation = await Conversation.findOne({participants:{$all:[senderId,receiverId]}})
    
    if(!conversation)
    {
        conversation = await Conversation.create({
            participants :[ senderId , receiverId]
        })
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        message
    })

    if(newMessage){
        conversation.messages.push(newMessage._id);
    }
    await conversation.save();
    await newMessage.save();

    res.status(201).json({success:true,message:newMessage});
})

export const getMessage =CAE (async (req,res,next) =>
    {
    
        const{ id:receiverId }=req.params;
        const senderId = req.user._id;
        
        let conversation = await Conversation.findOne({participants:{$all:[senderId,receiverId]}}).populate("messages")
    
        res.status(201).json({success:true,message:conversation.messages});
    })
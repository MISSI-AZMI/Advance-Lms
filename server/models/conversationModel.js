import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

    participants:{
        type:Array,
        ref:"User",

    },
    messages:{
        type:Array,
        ref:"Message",
        default:[]
    }
},{timestamps:true})


const Conversation = mongoose.model("Conversation",conversationSchema);

export default Conversation;


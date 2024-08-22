import mongoose, { Schema } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto"



const userSchema =  new mongoose.Schema({

    name:      { type: String, required: true ,min: 2,max:50},

    // userName:  { type: String, required: true ,min: 2,max:50, unique: true },

    email:     { type: String, required: true, unique: true ,validate: validator.isEmail, max :50},

    password:  { type: String, required: true,  min:6,Select:false},

    avatar:    { public_id:{type: String, required: true} , url:{type: String, required: true}},

    role:      { type: String,enum :["admin","user"] ,default:"user"},

    subscription:{id:String , status:String},

    playlist:   [{course:{type: mongoose.Schema.Types.ObjectId , ref: "courseModel"},poster : String}],

    createdAt : {type:Date,default:Date.now},

    resetPasswordToken:String,

    resetPasswordExpire:String

})

userSchema.methods.getResetToken = function ()
{
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;

}


const User = mongoose.model("User",userSchema)

export default User;

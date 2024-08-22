import { CAE } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js"
import Course from "../models/courseModel.js"
import bcrypt from "bcrypt"
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary"
import getDataUri from "../utils/dataUri.js";

export const register = CAE(async (req, res, next) => {

    const { name, email, password } = req.body;

    const file = req.file;
    
    if (!name || !email || !password )
        return next(new ErrorHandler("please enter all fields", 400))

    const isUser = await User.findOne({ email })
    if (isUser)
        return next(new ErrorHandler("user is already present", 401))

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password: hashPassword,
        avatar:
        {
            public_id: "temp",
            url: "temp"
        }

    })

    const user = await newUser.save()

    delete user.password;

    sendToken(res, user, "registered successfully", 201);

})

export const login = CAE(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new ErrorHandler("please enter all fields", 400))

    const user = await User.findOne({ email })

    if (!user)
        return next(new ErrorHandler("user is does not present", 401))
    
    const isMatched = await bcrypt.compare(password, user.password)

    if (!isMatched)
        return next(new ErrorHandler("incorrect creadentials", 401))

    delete user.password;

    sendToken(res, user, `welcome ${user.name}`, 201)
})


export const logout = CAE(async (req, res) => {
    res.status(200).cookie("token", null, { expires: new Date(Date.now()) })
        .json({
            success: true,
            message: "loged out success fully"
        })
})


export const getMyProfile = CAE(async (req, res) => {


    const user = await User.findById(req.user._id);

    delete user.password;

    res.status(200).json({ success: true, user })

})

//To change the password

export const changePassword = CAE(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword)
        return next(new ErrorHandler("please enter all fields", 400))

    const user = await User.findById(req.user._id);

    const isMatched = await bcrypt.compare(oldPassword, user.password)

    if (!isMatched)
        return next(new ErrorHandler("old password is incorrexct", 401))

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;

    await user.save()

    res.status(200).json({ success: true, message: "password is updated" })

})

export const updateProfile = CAE(async (req, res, next) => {

    const { name, email } = req.body

    const user = await User.findById(req.user._id);


    if (name)
        user.name = name

    if (email)
        user.email = email


    await user.save()

    res.status(200).json({ success: true, message: "profile is updated" })

})

//todo
export const updateProfilePicture = CAE(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    console.log(user);

    const file = req.file;
    
    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content)

    await cloudinary.v2.uploader.destroy(user.avatar.public_id)

    user.avatar ={
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    }

    await user.save()

    res.status(200).json({ success: true, message: "profile picture is updated" });

})



export const forgetPassword = CAE(async (req, res, next) => {

    const { email } = req.body

    const user = await User.findOne({ email });

    if (!email)
        return next(new ErrorHandler("no user with this email", 404))

    const resetToken = user.getResetToken()

    await user.save();

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    const text = `click on the link to reset your password.\n ${url} \n if not requested dont open`


    sendEmail(user.email, "reset password", text)



    res.status(200).json({ success: true, message: "reset token is send to email" })

})


export const resetPassword = CAE(async (req, res, next) => {

    const { token } = req.params


    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user)
        return next(new ErrorHandler("token is invalid or expired"))

    user.password = req.body.password
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    user.save()

    res.status(200).json({ success: true, message: "password change success fully" })

})

export const addToPlaylist = CAE(async (req, res, next) => {


    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.body.id)

    if (!course)
        return next(new ErrorHandler("course id not found", 404))

    const itemExists = await user.playlist.find((item) => {
        if (item.course.toString() === course._id.toString())
            return true
    })

    if (itemExists)
        return next(new ErrorHandler("course already exists", 409))

    user.playlist.push({
        course: course._id,
        poster: course.poster.url
    })

    await user.save();

    res.status(200).json({ success: true, message: "added to playlist" })

})


export const removeFromPlaylist = CAE(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.body.id)

    if (!course)
        return next(new ErrorHandler("course id not found", 404))

    const itemExists = await user.playlist.find((item) => {
        if (item.course.toString() === course._id.toString())
            return true
    })

    if (!itemExists)
        return next(new ErrorHandler("course does not exists", 409))

    const newPlaylist = user.playlist.filter((item) => {
        if (item.course.toString() !== course._id.toString())
            return item;
    })

    user.playlist = newPlaylist

    await user.save();

    res.status(200).json({ success: true, message: "course deleted from playlist" })

})



// admin controller
export const getAllUser = CAE(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({ success: true, message: "all users data" ,users })

})


export const updateUserRole = CAE(async (req, res, next) => {

    const user = await User.findById(req.params.id);


    if(!user)
    {
        return next( new ErrorHandler("user not found", 404))
    }

    if(user.role === "user")
    {
        user.role = "admin"
    }
    else
    {
        user.role = "user"
    }

    user.save()

    res.status(200).json({ success: true, message: "role is updated" })

})


export const deleteUser = CAE(async (req, res, next) => {


    const user = await User.findById(req.params.id);

    if(!user)
    {
        return next( new ErrorHandler("user not found", 404))
    }

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    //cancle subscription;

    await user.remove;

    res.status(200).json({ success: true, message: "user is deleted successfully" });

})

export const deleteMyProfile = CAE(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    //cancle subscription;

    await user.remove;

    res.status(200).cookie("token",null,{expires:new Date(Date.now())}).json({ success: true, message: "profile is deleted successfully" });

})






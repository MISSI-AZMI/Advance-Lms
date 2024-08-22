import { CAE } from "../middleware/catchAsyncError.js"
import Course from "../models/courseModel.js"
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary"

export const getAllCourses = CAE(async (req, res) => {
    const course = await Course.find().select("-lectures");
    res.status(200).json({ success: true, course })

})

export const createCourse = CAE(async (req, res,next) => {

    const { title, description, catagory, createdBy } = req.body;
   
    if (!title || !description || !catagory || !createdBy)
        return next(new ErrorHandler("please add all field", 400))
    
    
    const file = req.file;
    
    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content)


    // await Course.create({
    //     title,
    //     description,
    //     catagory,
    //     createdBy,
    //     poster:{
    //         public_id:"temp",
    //         url:"temp"
    //     }
    // });

    const newcourse = new Course({
        title,
        description,
        catagory,
        createdBy,
        poster: {
            public_id: myCloud.public_id,
            url: myCloud.url
        }})

    await newcourse.save();
    res.status(200).json({ message: "course created sucessfully ,you can add lecture now ", success: true })

})


export const getCourseLecture = CAE(async (req, res ,next) => {

    const {id} =req.params

    const course = await Course.findById(id);
    if (!course)
        return next(new ErrorHandler("course not found", 400))


    course.views+=1;

    await course.save();
     

    res.status(200).json({ success: true, lectures:course.lectures })

})


export const addLecture = CAE(async (req, res ,next) => {

    const {id} =req.params
    
    const course = await Course.findById(id);
    if (!course)
        return next(new ErrorHandler("course not found", 400))
    
    const { title, description } = req.body;
    if (!title || !description )
        return next(new ErrorHandler("please add all field", 400))
    
    const file = req.file;

    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content,{resource_type:"video"})



    // updload file here
    course.lectures.push({
        title,
        description,
        video:{
            public_id:myCloud.public_id,
            url:myCloud.url
        }
    })

    course.numOfVideos = course.lectures.length;
    await course.save();
     

    res.status(200).json({ success: true, message:"lecture added in course" })

})



export const deleteCourse = CAE(async (req, res,next) => {


    const {id} =req.params
    
    const course = await Course.findById(id);

    if (!course)
        return next(new ErrorHandler("course not found", 400))


    await cloudinary.v2.uploader.destroy(course.poster.public_id);

    for (let  i= 0 ; i < course.lectures.length; i++)
    {
        await cloudinary.v2.uploader.destroy(course.lectures[i].video.public_id);
    }

    await course.remove;

    res.status(200).json({ message: "course deleted successfully ", success: true })

})


export const deleteLecture = CAE(async (req, res,next) => {


    const {courseId,lectureId} = req.body
    
    
    if (!courseId||!lectureId)
        return next(new ErrorHandler("please enter all fields", 400))
    
    const course = await Course.findById(courseId);
    
    if (!course)
        return next(new ErrorHandler("course not present", 400))


    const lecture = course.lectures.find((item)=>
        {
            if(item._id.toString()=== lectureId.toString())
                return item;
        })



    await cloudinary.v2.uploader.destroy(lecture.video.public_id,{resource_type:"video"})


    course.lectures = course.lectures.filter((item)=>
    {
        if(item._id.toString()!== lectureId.toString())
            return item;
    })

    course.numOfVideos = course.lectures.length;
    await course.save();
     

    res.status(200).json({ message: "lecture deleted successfully ", success: true })

})

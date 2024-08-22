import express from "express"
const router = express.Router();
import { getAllCourses,createCourse, getCourseLecture, addLecture, deleteCourse, deleteLecture } from "../controllers/courseController.js";
import singleUpload from "../middleware/multer.js";
import { authorizedAdmin, isAuthenticated } from "../middleware/auth.js";


router.get("/courses",getAllCourses);

router.post("/createcourse",isAuthenticated,authorizedAdmin,singleUpload,createCourse);

router.get("/course/:id",isAuthenticated,getCourseLecture)

router.post("/course/:id",isAuthenticated,authorizedAdmin,singleUpload,addLecture)

router.delete("/course/:id",isAuthenticated,authorizedAdmin,deleteCourse)

router.delete("/lecture",isAuthenticated,authorizedAdmin,deleteLecture)





export default router
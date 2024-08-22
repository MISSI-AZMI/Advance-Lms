import express from "express"
import { register ,login ,logout, getMyProfile,changePassword, updateProfile, updateProfilePicture,forgetPassword, resetPassword, addToPlaylist, removeFromPlaylist, getAllUser, updateUserRole, deleteUser, deleteMyProfile } from "../controllers/userController.js";
import { authorizedAdmin, isAuthenticated } from "../middleware/auth.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

//register a new user
router.post("/register" , singleUpload, register)
 
//login
router.post("/login" , login)

//logout
router.get("/logout" , logout)

// get my profile
router.get("/me" , isAuthenticated ,getMyProfile)

//delete my profile
router.delete("/me" , isAuthenticated ,deleteMyProfile);

// change password
router.put("/password" , isAuthenticated ,changePassword)

// update profile name and email
router.put("/updateprofile" , isAuthenticated ,updateProfile)

// updatea user avatar
router.put("/updateprofilepicture" , isAuthenticated , singleUpload , updateProfilePicture)

// forget password link
router.post("/forgetpassword" ,forgetPassword)

// reset password link
router.put("/resetpassword/:token" ,resetPassword)

// add course
router.post("/addtoplaylist",isAuthenticated,addToPlaylist);

// delete course
router.delete("/deletefromplaylist",isAuthenticated,removeFromPlaylist);

// admin routes

router.get ("/admin/users",isAuthenticated,authorizedAdmin,getAllUser);

router.put("/admin/user/:id",isAuthenticated,authorizedAdmin,updateUserRole)

router.delete("/admin/user/:id",isAuthenticated,authorizedAdmin,deleteUser);


export default router
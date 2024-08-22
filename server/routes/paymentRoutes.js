import express from "express"
import { register ,login ,logout, getMyProfile,changePassword, updateProfile, updateProfilePicture,forgetPassword, resetPassword, addToPlaylist, removeFromPlaylist, getAllUser, updateUserRole, deleteUser, deleteMyProfile } from "../controllers/userController.js";
import { authorizedAdmin, isAuthenticated } from "../middleware/auth.js";
import singleUpload from "../middleware/multer.js";
import { buySubscription } from "../controllers/paymentController.js";

const router = express.Router();

// buy substcription


router.get("/subscribe",isAuthenticated, buySubscription )

export default router
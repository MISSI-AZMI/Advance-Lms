import express from "express"
import { isAuthenticated } from "../middleware/auth.js";
import { sendMessage,getMessage } from "../controllers/messageController.js";


const router = express.Router();


router.get("/:id", isAuthenticated, getMessage)

router.post("/send/:id",isAuthenticated,sendMessage)


export default router
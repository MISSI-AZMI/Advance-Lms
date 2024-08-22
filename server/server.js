import app from "./app.js";
import DBconnect from "./conifg/db.js"
import dotenv from "dotenv";
import razorpay from "razorpay";


dotenv.config();

import cloudinary from "cloudinary"

cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY
})

export const instance = new 
razorpay(
    {
        key_id:process.env.RAZORPAY_KEY,
        key_secret:process.env.RAZORPAY_SECRET  
    }
)


const PORT = process.env.PORT;
const URL = process.env.MONGO_URL;




app.listen(PORT ,()=>
{
    console.log(`server is up at ${PORT}`);
    DBconnect(URL)
})
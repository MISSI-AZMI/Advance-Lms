import mongoose from "mongoose";



const DBConnect = async (url)=>
{
   await mongoose.connect(url)
   .then(()=>{console.log("database is connected")})
   .catch((err)=>{console.log(err)})
}


export default DBConnect
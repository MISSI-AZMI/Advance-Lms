import mongoose from "mongoose";

const courceSchema = new mongoose.Schema({

    title: { type: String, required: true, min: 2, max: 50 },

    description: { type: String, required: true, min: 20 },

    lectures: [
        {
            title: { type: String, required: true, min: 2, max: 50 },
            description: { type: String, required: true, min: 20 },
            video: { public_id: { type: String, required: true }, url: { type: String, required: true } }
        }],

    poster: { public_id: { type: String, required: true }, url: { type: String, required: true } },


    views: { type: Number, default: 0 },

    numOfVideos: { type: Number, default: 0 },

    catagory: {type: String, require:true },

    createdBy: { type: String, require:true},

    createdAt: { type: Date, default: Date.now }

})

const Course = mongoose.model("Course", courceSchema)

export default Course;

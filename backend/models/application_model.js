import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema ({
    duty: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Duty',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending','accepted','rejected'],
        default: 'pending'
    }
},{timestamps:true})

export const Application = mongoose.model("Application",applicationSchema);
import mongoose from "mongoose";

const industrySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: { 
        type: String 
    }
}, { timestamps: true });

const Industry = mongoose.model("Industry", industrySchema);
export default Industry;
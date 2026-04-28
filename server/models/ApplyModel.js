import mongoose from "mongoose";

const ApplySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
    status: { 
        type: String, 
        default: "Đã ứng tuyển",
        enum: ["Đã ứng tuyển", "Phù hợp", "Từ chối"] 
    },
    date: { type: Date, default: Date.now },
    userCvUrl: { type: String, required: true } // Lưu đường dẫn file CV
}, { timestamps: true });

const Apply = mongoose.model("Apply", ApplySchema);
export default Apply;
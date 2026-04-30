import mongoose from "mongoose";

const ApplySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Job", 
        required: true 
    },
    // Tham chiếu đến model "Company" để khớp với logic trong authMiddleware.js
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Company", 
        required: true 
    },
    userCvUrl: { 
        type: String, 
        required: true 
    }, // Đường dẫn file CV ứng viên đã tải lên
    
    // Sử dụng một trường status duy nhất cho các trạng thái: 
    // "Đang chờ duyệt", "Đã xem", "Chờ phỏng vấn", "Từ chối"
    status: {
        type: String,
        default: "Đang chờ duyệt"
    }
}, { 
    timestamps: true // Tự động tạo và cập nhật createdAt, updatedAt
});

const Apply = mongoose.models.Apply || mongoose.model("Apply", ApplySchema);

export default Apply;
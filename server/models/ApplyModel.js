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
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Recruiter", 
        required: true 
    },
    userCvUrl: { 
        type: String, 
        required: true 
    }, // Lưu đường dẫn file CV
    date: { 
        type: Date, 
        default: Date.now 
    },
    
    // Cập nhật các trường trạng thái theo cấu trúc dữ liệu mới
    statusCussess: { 
        type: String, 
        default: "Đã ứng tuyển" 
    },
    statusDenied: { 
        type: String, 
        default: "Không được duyệt" 
    },
    statusWaiting: { 
        type: String, 
        default: "Đang chờ duyệt" 
    },
    
    // Thêm một trường status chung để dễ dàng quản lý logic hiển thị nếu cần
    status: {
        type: String,
        default: "Đang chờ duyệt"
    }
}, { timestamps: true });

const Apply = mongoose.models.Apply || mongoose.model("Apply", ApplySchema);
export default Apply;
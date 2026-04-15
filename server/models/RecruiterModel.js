import mongoose from "mongoose";

const RecruiterSchema = new mongoose.Schema(
  {
    // Liên kết với tài khoản đăng nhập ở bảng Company
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Company", 
        required: true, 
        unique: true 
    },
    companyName: { type: String, required: true },
    namemanage: { type: String, required: true }, // Tên người quản lý
    logo: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    address: { type: String, default: "" },
    image: { type: String, default: "" }, // Ảnh bìa công ty
    website: { type: String, default: "" },
    employees: { type: String, default: "" },
    followers: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: "User", 
        default: [] 
    },
  },
  { timestamps: true }
);

const Recruiter = mongoose.model("Recruiter", RecruiterSchema);
export default Recruiter;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Thông tin tài khoản cơ bản
    name: { type: String, required: [true, 'Vui lòng nhập tên'] },
    email: { type: String, required: [true, 'Vui lòng nhập email'], unique: true, lowercase: true },
    password: { type: String, required: [true, 'Vui lòng nhập mật khẩu'] },
    phone: { type: String, required: [true, 'Vui lòng nhập số điện thoại'] },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    role: { type: String, default: "user" }, 

    // --- CÁC TRƯỜNG DÀNH CHO HỒ SƠ CÁ NHÂN (PROFILE) ---
    degree: { 
        type: String, 
        enum: ["Trung học", "Phổ thông", "Cử nhân", "Kỹ sư", "Thạc sĩ", "Tiến sĩ"], 
        default: null 
    },
    field: { type: String, default: null }, 
    level: { type: String, default: null }, 
    cvUrl: { type: String, default: null }, 
    address: { type: String, default: null },

    // [MỚI THÊM] TRƯỜNG HÌNH ẢNH ĐẠI DIỆN
    image: { type: String, default: "" }
  }, 
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
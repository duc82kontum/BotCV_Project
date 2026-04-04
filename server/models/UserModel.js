import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Vui lòng nhập tên'] },
    email: { type: String, required: [true, 'Vui lòng nhập email'], unique: true, lowercase: true },
    phone: { type: String, required: [true, 'Vui lòng nhập số điện thoại'] },
    password: { type: String, required: [true, 'Vui lòng nhập mật khẩu'] },
    
    // Các trường hồ sơ (mặc định là null khi mới đăng ký)
    degree: { type: String, default: null },
    field: { type: String, default: null },
    level: { type: String, default: null },
    cvUrl: { type: String, default: null },
    address: { type: String, default: null }
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

const User = mongoose.model("User", userSchema);
export default User;
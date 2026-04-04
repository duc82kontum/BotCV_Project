import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    // Các thông tin bổ sung sẽ cập nhật sau khi đăng ký
    address: { type: String, default: "" },
    degree: { type: String, default: "" },
    cvUrl: { type: String, default: "" },
}, { timestamps: true }); // Tự động tạo thời gian tạo/cập nhật

const User = mongoose.model("User", userSchema);
export default User;
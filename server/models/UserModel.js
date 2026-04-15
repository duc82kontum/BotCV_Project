// server/models/UserModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    
    // THÊM DÒNG NÀY ĐỂ NODE.JS NHẬN DIỆN ĐƯỢC QUYỀN TRUY CẬP
    role: { type: String, default: "user" }, 

    address: { type: String, default: "" },
    degree: { type: String, default: "" },
    cvUrl: { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
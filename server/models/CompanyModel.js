import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true }, // Tên người đại diện
    companyName: { type: String, required: true }, // Tên công ty
    email: { type: String, required: true, unique: true }, // Email dùng để đăng nhập
    password: { type: String, required: true }, // Mật khẩu đã mã hóa
    role: { type: String, default: "recruiter" }, // Mặc định là nhà tuyển dụng
    verified: { type: Boolean, default: false }, // Trạng thái xác minh
    // Bạn có thể thêm các field khác như số điện thoại, mã số thuế nếu cần
  },
  { timestamps: true } // Tự động tạo createdAt và updatedAt
);

const Company = mongoose.model("Company", companySchema);
export default Company;
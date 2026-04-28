import jwt from "jsonwebtoken";
import Company from '../models/CompanyModel.js';

// 1. Middleware dành cho Ứng viên (User) - Dùng cho Ứng tuyển
const authUser = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.json({ success: false, message: "Không tìm thấy mã xác thực, vui lòng đăng nhập lại!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; 
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Mã xác thực không hợp lệ!" });
    }
}

// 2. Middleware dành cho Doanh nghiệp (Company) - Sửa lỗi SyntaxError
export const protectCompany = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.json({ success: false, message: "Không có quyền truy cập, vui lòng đăng nhập lại!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Tìm công ty dựa trên ID trong token
        const company = await Company.findById(decoded.id).select('-password');

        if (!company) {
            return res.json({ success: false, message: "Tài khoản doanh nghiệp không tồn tại!" });
        }

        req.company = company;
        next();
    } catch (error) {
        res.json({ success: false, message: "Phiên đăng nhập hết hạn!" });
    }
};

export default authUser;
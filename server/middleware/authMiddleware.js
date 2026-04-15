import jwt from "jsonwebtoken";
import Company from '../models/CompanyModel.js';
const authUser = async (req, res, next) => {
    try {
        // 1. Lấy token từ header 'token' HOẶC từ 'authorization' (Bearer token)
        const token = req.headers.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.json({ 
                success: false, 
                message: "Không tìm thấy mã xác thực, vui lòng đăng nhập lại!" 
            });
        }

        console.log("Token nhận được từ Header:", token);

        // 2. Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Gán thông tin vào req.user (Controller sẽ dùng req.user.id)
        // Lưu ý: Object decoded phải chứa trường 'id' giống như lúc bạn jwt.sign khi Login
        req.user = { id: decoded.id }; 

        // 4. Cho phép đi tiếp vào Controller
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        
        // Trả về lỗi cụ thể để AppContext biết đường mà xử lý logout
        res.status(401).json({ 
            success: false, 
            message: "Phiên làm việc hết hạn hoặc token không hợp lệ!" 
        });
    }
}

export const protectCompany = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: "Không có quyền truy cập, vui lòng đăng nhập lại!" });
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Tìm công ty dựa trên ID trong token
        const company = await Company.findById(decoded.id).select('-password');

        if (!company) {
            return res.json({ success: false, message: "Tài khoản doanh nghiệp không tồn tại!" });
        }

        // Gán thông tin công ty vào request để các hàm sau sử dụng
        req.company = company;
        
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!" });
    }
};
export default authUser;
import jwt from "jsonwebtoken";

/**
 * Middleware bảo vệ các tuyến đường của Admin
 * Kiểm tra Token hợp lệ và Role phải là 'admin'
 */
export const protectAdmin = async (req, res, next) => {
    try {
        // 1. Lấy token từ Headers (Hỗ trợ cả 'token' hoặc 'Authorization')
        const token = req.headers.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Không tìm thấy mã xác thực, vui lòng đăng nhập lại!" 
            });
        }

        // 2. Giải mã Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Kiểm tra quyền hạn (Role)
        // Token giải mã phải chứa role: 'admin'
        if (decoded.role !== "admin") {
            return res.status(403).json({ 
                success: false, 
                message: "Truy cập bị từ chối! Bạn không có quyền quản trị." 
            });
        }

        // 4. Lưu thông tin admin vào request để các hàm sau sử dụng (nếu cần)
        req.admin = decoded;
        
        // Cho phép đi tiếp vào Controller
        next();

    } catch (error) {
        console.error("Lỗi xác thực Admin Middleware:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: "Phiên làm việc đã hết hạn hoặc mã xác thực không hợp lệ!" 
        });
    }
};
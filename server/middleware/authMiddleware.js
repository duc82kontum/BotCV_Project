import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        // 1. Lấy token từ headers
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: "Không có quyền truy cập, hãy đăng nhập lại!" });
        }

        // 2. Giải mã token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // 3. THAY ĐỔI DÒNG NÀY: Gán trực tiếp vào req thay vì req.body
        req.userId = token_decode.id; 
        
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;
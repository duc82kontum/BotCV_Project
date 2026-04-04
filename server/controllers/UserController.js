import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ĐĂNG KÝ NGƯỜI DÙNG
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "Email này đã được đăng ký!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPasswordFinal = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPasswordFinal,
            phone
        });

        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({ success: true, token, user: { name: user.name, email: user.email } });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// ĐĂNG NHẬP NGƯỜI DÙNG
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            
            res.json({ 
                success: true, 
                token, 
                user: { name: user.name, email: user.email } 
            });
        } else {
            res.json({ success: false, message: "Mật khẩu không chính xác!" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// LẤY THÔNG TIN CÁ NHÂN (HÀM MỚI THÊM)
export const getProfileUser = async (req, res) => {
    try {
        // userId này được lấy từ authMiddleware sau khi giải mã token
        const userId = req.userId;

        // Tìm user theo ID và không trả về password (bảo mật)
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy người dùng!" });
        }

        res.json({ success: true, user });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
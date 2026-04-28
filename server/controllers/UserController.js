import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. ĐĂNG KÝ NGƯỜI DÙNG
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
        }

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
            phone,
            role: "user" // Mặc định là user
        });

        const user = await newUser.save();


        const token = jwt.sign(
            { id: String(user._id), role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );

        res.json({ 
            success: true, 
            token, 
            role: user.role,
            user: { id: user._id, name: user.name, email: user.email } 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 2. ĐĂNG NHẬP NGƯỜI DÙNG (Tự động nhận diện Admin/User)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Tìm user và log để kiểm tra role ngay tại đây
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            // Lấy role thật từ DB, nếu trống thì mới để 'user'
            const userRole = user.role || 'user'; 

            const token = jwt.sign(
                { id: String(user._id), role: userRole }, 
                process.env.JWT_SECRET, 
                { expiresIn: '30d' }
            );
            
            res.json({ 
                success: true, 
                token, 
                role: userRole,
                user: { id: user._id, name: user.name, email: user.email, role: userRole } 
            });
        } else {
            res.json({ success: false, message: "Mật khẩu không chính xác!" });
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 3. LẤY THÔNG TIN CÁ NHÂN (GET PROFILE)
export const getProfileUser = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy người dùng!" });
        }

        res.json({ 
            success: true, 
            user: { ...user._doc, role: user.role || 'user' }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 4. CẬP NHẬT HỒ SƠ NGƯỜI DÙNG
export const updateProfileUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, address, degree, field } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phone, address, degree, field },
            { new: true }
        ).select('-password');

        res.json({ success: true, message: "Cập nhật hồ sơ thành công", user: updatedUser });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 5. [DÀNH CHO ADMIN] LẤY DANH SÁCH TẤT CẢ NGƯỜI DÙNG
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const toggleSaveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id;

        // Đảm bảo dùng đúng Model là User (viết hoa)
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }

        // PHÒNG NGỪA LỖI: Nếu savedJobs chưa tồn tại, khởi tạo nó là mảng rỗng
        if (!user.savedJobs) {
            user.savedJobs = [];
        }

        const isSaved = user.savedJobs.includes(jobId);

        if (isSaved) {
            // SỬA TẠI ĐÂY: Dùng optional chaining hoặc kiểm tra trước khi filter
            user.savedJobs = user.savedJobs.filter(id => id && id.toString() !== jobId);
            await user.save();
            return res.json({ success: true, message: "Đã bỏ lưu công việc" });
        } else {
            user.savedJobs.push(jobId);
            await user.save();
            return res.json({ success: true, message: "Đã lưu công việc" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// Kiểm tra xem công việc cụ thể đã được người dùng lưu chưa
export const checkSavedStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const isSaved = user.savedJobs.includes(jobId);

        res.json({ success: true, saved: isSaved });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// server/controllers/UserController.js
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.id;
        // Tìm user và nạp chi tiết các công việc trong mảng savedJobs
        const user = await User.findById(userId).populate({
            path: 'savedJobs',
            populate: { path: 'recruiter', select: 'companyName image' } // Lấy thêm thông tin công ty
        });

        res.json({ success: true, savedJobs: user.savedJobs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
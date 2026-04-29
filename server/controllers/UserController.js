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
            role: "user" 
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
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 2. ĐĂNG NHẬP NGƯỜI DÙNG
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
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
        } else {
            res.json({ success: false, message: "Mật khẩu không chính xác" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 3. LẤY THÔNG TIN CÁ NHÂN
export const getProfileUser = async (req, res) => {
    try {
        const userId = req.user.id || req.user; 
        const userData = await User.findById(userId).select('-password');
        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 4. CẬP NHẬT HỒ SƠ (Đã hỗ trợ upload cả Avatar và CV)
export const updateProfileUser = async (req, res) => {
    try {
        const userId = req.user.id || req.user; 
        const { name, phone, degree, field, level, address } = req.body;
        
        const updatedData = {
            ...(name && { name }),
            ...(phone && { phone }),
            ...(degree && { degree }),
            ...(field && { field }),
            ...(level && { level }),
            ...(address && { address }),
        };

        // Xử lý upload nhiều file
        if (req.files) {
            // Nếu có upload ảnh đại diện mới
            if (req.files.image) {
                updatedData.image = `/uploads/avatar/${req.files.image[0].filename}`;
            }
            // Nếu có upload CV mới
            if (req.files.cvFile) {
                updatedData.cvUrl = `/uploads/cv/${req.files.cvFile[0].filename}`;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updatedData, 
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        res.json({ 
            success: true, 
            message: "Cập nhật hồ sơ thành công", 
            user: updatedUser 
        });
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        res.json({ success: false, message: error.message });
    }
};

// 5. LƯU / BỎ LƯU CÔNG VIỆC
export const toggleSaveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id || req.user;

        const user = await User.findById(userId);
        const isSaved = user.savedJobs.includes(jobId);

        if (isSaved) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
            await user.save();
            return res.json({ success: true, message: "Đã bỏ lưu công việc" });
        } else {
            user.savedJobs.push(jobId);
            await user.save();
            return res.json({ success: true, message: "Đã lưu công việc" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 6. KIỂM TRA TRẠNG THÁI LƯU
export const checkSavedStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id || req.user;

        const user = await User.findById(userId);
        const isSaved = user.savedJobs.includes(jobId);

        res.json({ success: true, saved: isSaved });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 7. LẤY DANH SÁCH VIỆC ĐÃ LƯU
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.id || req.user;
        const user = await User.findById(userId).populate({
            path: 'savedJobs',
            populate: { path: 'recruiter', select: 'name email' }
        });

        res.json({ success: true, savedJobs: user.savedJobs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 8. [DÀNH CHO ADMIN] LẤY DANH SÁCH TẤT CẢ NGƯỜI DÙNG
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
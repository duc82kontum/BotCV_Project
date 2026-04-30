import User from "../models/UserModel.js";
import Company from "../models/CompanyModel.js"; // Đã đổi tên từ Recruiter[cite: 31]
import Job from "../models/JobModel.js";
import Apply from "../models/ApplyModel.js";

// 1. LẤY THỐNG KÊ TỔNG QUAN (Dùng cho Dashboard)
export const getAdminStats = async (req, res) => {
    try {
        const [userCount, companyCount, jobCount, applyCount] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Company.countDocuments({}),
            Job.countDocuments({}),
            Apply.countDocuments({})
        ]);

        res.json({
            success: true,
            stats: {
                users: userCount,
                companies: companyCount,
                jobs: jobCount,
                applications: applyCount
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 2. LẤY DANH SÁCH TÀI KHOẢN (Phân loại User/Company)
export const getAllAccounts = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        const companies = await Company.find({}).select('-password').sort({ createdAt: -1 });

        res.json({ success: true, users, companies });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 3. XÓA TÀI KHOẢN (ADMIN QUYỀN LỰC NHẤT)
export const deleteAccount = async (req, res) => {
    try {
        const { id, type } = req.body; // type: 'user' hoặc 'company'
        if (type === 'user') {
            await User.findByIdAndDelete(id);
        } else {
            await Company.findByIdAndDelete(id);
        }
        res.json({ success: true, message: "Đã xóa tài khoản thành công" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
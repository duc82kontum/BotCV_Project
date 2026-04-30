import User from "../models/UserModel.js";
import Company from "../models/CompanyModel.js"; 
import Job from "../models/JobModel.js";
import Apply from "../models/ApplyModel.js";
import Industry from "../models/IndustryModel.js"; // Đã thêm import IndustryModel

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
        const { id, type } = req.body; 
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

// LẤY TOÀN BỘ ĐƠN ỨNG TUYỂN CỦA HỆ THỐNG
export const getAllApplicationsAdmin = async (req, res) => {
    try {
        const applications = await Apply.find({})
            .populate('userId', 'name email phone image') 
            .populate('jobId', 'title') 
            .populate('companyId', 'companyName email') 
            .sort({ createdAt: -1 });

        res.json({ success: true, applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// XÓA ĐƠN ỨNG TUYỂN BẤT KỲ (QUYỀN ADMIN)
export const deleteApplicationAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedApply = await Apply.findByIdAndDelete(id);
        
        if (!deletedApply) {
            return res.json({ success: false, message: "Không tìm thấy hồ sơ!" });
        }
        res.json({ success: true, message: "Admin đã xóa hồ sơ thành công!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================= CÁC HÀM QUẢN LÝ NGÀNH NGHỀ =================

// LẤY DANH SÁCH NGÀNH NGHỀ
export const getIndustry = async (req, res) => {
  try {
    const industries = await Industry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: industries });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

// THÊM NGÀNH NGHỀ MỚI
export const addIndustry = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exist = await Industry.findOne({ name });
    if (exist) {
      return res.json({ success: false, message: "Ngành nghề này đã tồn tại!" });
    }

    const newIndustry = new Industry({ name, description });
    await newIndustry.save();
    res.json({ success: true, message: "Thêm ngành nghề thành công!", data: newIndustry });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi thêm ngành nghề." });
  }
};

// XÓA NGÀNH NGHỀ
export const deleteIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Industry.findByIdAndDelete(id);
    if (!deleted) return res.json({ success: false, message: "Không tìm thấy ngành nghề." });

    res.json({ success: true, message: "Đã xóa ngành nghề." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa ngành nghề." });
  }
};
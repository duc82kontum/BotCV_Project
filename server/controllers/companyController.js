import Company from "../models/CompanyModel.js";
import Recruiter from "../models/RecruiterModel.js"; // Import thêm Recruiter để lấy Profile
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. Đăng ký tài khoản doanh nghiệp (Company)
export const resgisterCompany = async (req, res) => {
    const { fullName, companyName, email, password } = req.body;

    try {
        // Kiểm tra email tồn tại
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ success: false, message: "Email này đã được đăng ký doanh nghiệp" });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo Company mới
        const newCompany = new Company({
            fullName,
            companyName,
            email,
            password: hashedPassword
        });

        await newCompany.save();

        res.status(201).json({ success: true, message: "Đăng ký tài khoản doanh nghiệp thành công!" });

    } catch (error) {
        console.log("Error Register Company:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Đăng nhập doanh nghiệp (Company Login)
export const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm Company theo email
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ success: false, message: "Tài khoản doanh nghiệp không tồn tại" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mật khẩu không đúng" });
        }

        // --- PHẦN QUAN TRỌNG: TỰ ĐỘNG LẤY PROFILE RECRUITER ---
        // Tìm thông tin profile trong bảng Recruiter dựa trên companyId
        const recruiterProfile = await Recruiter.findOne({ companyId: company._id });

        // Tạo JWT Token - Gán cứng role 'recruiter' vào token
        const token = jwt.sign(
            { id: company._id, role: 'recruiter' }, 
            process.env.JWT_SECRET || "your_jwt_secret", 
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            token,
            role: 'recruiter', // Trả về role để Frontend lưu tự động
            userData: {
                _id: company._id,
                email: company.email,
                companyName: company.companyName,
                fullName: company.fullName,
                // Gộp thông tin profile (logo, website...) nếu đã có
                profile: recruiterProfile || null 
            }
        });

    } catch (error) {
        console.log("Error Login Company:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Lấy thông tin Profile (Dùng cho AppContext gọi lại khi F5)
export const getCompanyProfile = async (req, res) => {
    try {
        // req.companyId lấy từ middleware auth
        const companyId = req.company._id; 

        const company = await Company.findById(companyId).select("-password");
        const recruiterProfile = await Recruiter.findOne({ companyId });

        res.json({
            success: true,
            userData: {
                ...company._doc,
                profile: recruiterProfile || null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
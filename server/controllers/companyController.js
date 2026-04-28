import Company from "../models/CompanyModel.js";
import Recruiter from "../models/RecruiterModel.js"; 
import Job from "../models/JobModel.js"; // Import thêm JobModel để đăng tin
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

        // BƯỚC 1: Tạo Company mới (Tài khoản đăng nhập)
        const newCompany = new Company({
            fullName,
            companyName,
            email,
            password: hashedPassword
        });
        await newCompany.save();

        // BƯỚC 2: Tự động tạo Profile Recruiter rỗng liên kết với Company
        // Điều này cực kỳ quan trọng để lát nữa postJob có cái mà lưu vào MongoDB
        const newRecruiterProfile = new Recruiter({
            companyId: newCompany._id,
            companyName: companyName,
            namemanage: fullName,
            email: email,
        });
        await newRecruiterProfile.save();

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

        // Tìm thông tin profile trong bảng Recruiter dựa trên companyId
        const recruiterProfile = await Recruiter.findOne({ companyId: company._id });

        // Tạo JWT Token
        const token = jwt.sign(
            { id: company._id, role: 'recruiter' }, 
            process.env.JWT_SECRET || "your_jwt_secret", 
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            token,
            role: 'recruiter',
            userData: {
                _id: company._id,
                email: company.email,
                companyName: company.companyName,
                fullName: company.fullName,
                profile: recruiterProfile || null 
            }
        });

    } catch (error) {
        console.log("Error Login Company:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Lấy thông tin Profile 
export const getCompanyProfile = async (req, res) => {
    try {
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

// 4. CHỨC NĂNG MỚI: Đăng tin tuyển dụng (Post Job)
export const postJob = async (req, res) => {
    try {
        // Hứng dữ liệu từ Frontend gửi lên
        const { 
            title, description, minSalary, maxSalary, negotiable, 
            category, level, type, experiences, time, 
            provinceCode, district, slot, degree, deadline 
        } = req.body;
        
        const companyId = req.company._id; 

        // Tìm Profile Recruiter của công ty này để gắn vào Job
        const recruiterProfile = await Recruiter.findOne({ companyId });
        
        if (!recruiterProfile) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ công ty. Vui lòng cập nhật hồ sơ trước khi đăng tin." });
        }

        // Khởi tạo tin mới
        const newJob = new Job({
            title,
            description,
            salary: {
                min: minSalary || 0,
                max: maxSalary || 0,
                negotiable: negotiable || false
            },
            category,
            level,
            type,
            experiences,
            time,
            provinceCode,
            district,
            slot,
            degree,
            deadline: deadline ? new Date(deadline) : null,
            recruiter: recruiterProfile._id, // Gắn ID từ bảng Recruiter
            company: companyId // Gắn ID từ bảng Company
        });

        // Lưu vào DB
        await newJob.save();
        
        res.status(201).json({ success: true, message: "Đăng tin tuyển dụng thành công!" });

    } catch (error) {
        console.error("Lỗi đăng tin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
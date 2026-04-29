import Company from "../models/CompanyModel.js";
import Recruiter from "../models/RecruiterModel.js"; 
import Job from "../models/JobModel.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. Đăng ký tài khoản doanh nghiệp (Company)
export const resgisterCompany = async (req, res) => {
    const { fullName, companyName, email, password } = req.body;

    try {
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ success: false, message: "Email này đã được đăng ký doanh nghiệp" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCompany = new Company({
            fullName,
            companyName,
            email,
            password: hashedPassword
        });
        await newCompany.save();

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
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ success: false, message: "Tài khoản doanh nghiệp không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mật khẩu không đúng" });
        }

        const recruiterProfile = await Recruiter.findOne({ companyId: company._id });

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

// 4. Đăng tin tuyển dụng (Post Job)
export const postJob = async (req, res) => {
    try {
        const { 
            title, description, minSalary, maxSalary, negotiable, 
            category, level, type, experiences, time, 
            provinceCode, district, slot, degree, deadline 
        } = req.body;
        
        const companyId = req.company._id; 

        const recruiterProfile = await Recruiter.findOne({ companyId });
        
        if (!recruiterProfile) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ công ty. Vui lòng cập nhật hồ sơ trước khi đăng tin." });
        }

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
            recruiter: recruiterProfile._id, 
            company: companyId 
        });

        await newJob.save();
        res.status(201).json({ success: true, message: "Đăng tin tuyển dụng thành công!" });

    } catch (error) {
        console.error("Lỗi đăng tin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Lấy danh sách tin tuyển dụng đã đăng của công ty
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id; 
        
        const jobs = await Job.find({ company: companyId }).sort({ createdAt: -1 });
        
        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Thay đổi trạng thái Ẩn/Hiện của tin tuyển dụng
export const changeJobStatus = async (req, res) => {
    try {
        const { id, visible } = req.body;
        
        await Job.findByIdAndUpdate(id, { visible });
        
        res.json({ success: true, message: visible ? "Đã hiện tin tuyển dụng" : "Đã ẩn tin tuyển dụng" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Xóa tin tuyển dụng
export const deleteJobs = async (req, res) => {
    try {
        const { id } = req.params; 
        
        await Job.findByIdAndDelete(id);

        res.json({ success: true, message: "Đã xóa tin tuyển dụng" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 8. Cập nhật profile công ty
export const updateCompanyProfile = async (req, res) => {
    try {
        const companyId = req.company._id;
        
        // Nhận đúng các trường dữ liệu từ Frontend
        const { companyName, namemanage, phone, website, address, employees, description } = req.body;
        
        // Lấy file ảnh từ middleware multer
        const imageFile = req.file; 

        // 1. Cập nhật tên công ty ở bảng Company chính
        const updatedCompany = await Company.findByIdAndUpdate(companyId, {
            companyName
        }, { new: true });

        // 2. Gom dữ liệu để cập nhật vào bảng Recruiter
        const updateData = {
            companyName,
            namemanage,
            phone,
            website,
            address,
            employees,
            description,
        };

        // Nếu người dùng có tải ảnh mới lên
        if (imageFile) {
            // LƯU Ý BƯỚC 4: Chỉ lưu đường dẫn web tương đối thay vì imageFile.path (ổ C:/)
            updateData.logo = `/uploads/${imageFile.filename}`; 
            updateData.image = `/uploads/${imageFile.filename}`; 
        }

        // 3. Thực hiện lưu vào Database
        const profile = await Recruiter.findOneAndUpdate(
            { companyId },
            updateData,
            { upsert: true, new: true }
        );

        res.json({ 
            success: true, 
            message: "Cập nhật hồ sơ thành công!", 
            userData: { ...updatedCompany._doc, profile } 
        });
    } catch (error) {
        console.error("Lỗi cập nhật hồ sơ:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
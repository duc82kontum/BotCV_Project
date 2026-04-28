import Apply from "../models/ApplyModel.js";
import Job from "../models/JobModel.js";

// 1. Xử lý ứng tuyển mới
export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id; // Lấy từ middleware xác thực

        // Kiểm tra xem job có tồn tại không để tránh lỗi khi lấy recruiter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Không tìm thấy công việc này!" });
        }

        // Kiểm tra xem đã ứng tuyển chưa
        const existingApply = await Apply.findOne({ userId, jobId });
        if (existingApply) {
            return res.status(400).json({ success: false, message: "Bạn đã ứng tuyển công việc này rồi!" });
        }

        const newApply = new Apply({
            userId,
            jobId,
            companyId: job.recruiter, // Lấy ID nhà tuyển dụng từ Job
            // SỬA: Đảm bảo có giá trị mặc định nếu chưa có tính năng upload CV thực tế
            userCvUrl: req.body.cvUrl || "default_cv_path.pdf", 
            status: "Đã ứng tuyển"
        });

        await newApply.save();
        res.status(200).json({ success: true, message: "Ứng tuyển thành công!" });
    } catch (error) {
        console.error("Lỗi Apply:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Kiểm tra trạng thái ứng tuyển (Xử lý lỗi 404 từ ảnh trước của bạn)
//
export const checkAppliedStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;

        const application = await Apply.findOne({ userId, jobId });
        
        res.status(200).json({ 
            success: true, 
            applied: !!application,
            application: application // THÊM DÒNG NÀY: Để Frontend lấy được _id đơn ứng tuyển
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Lấy danh sách việc làm mà người dùng đã ứng tuyển
//
export const getUserApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        const applications = await Apply.find({ userId })
            .populate('jobId')
            // SỬA Ở ĐÂY: Đổi 'logo' thành 'image' để khớp với MongoDB
            .populate('companyId', 'companyName location image'); 

        res.status(200).json({ 
            success: true, 
            applications 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Hủy ứng tuyển
export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params; // ID của đơn ứng tuyển (Apply ID)
        const userId = req.user.id;

        // Tìm và xóa đơn ứng tuyển nếu nó thuộc về người dùng này
        const deletedApply = await Apply.findOneAndDelete({ _id: id, userId });

        if (!deletedApply) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn ứng tuyển để hủy!" });
        }

        res.status(200).json({ success: true, message: "Đã hủy ứng tuyển thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
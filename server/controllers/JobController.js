import Job from "../models/JobModel.js";

// @desc    Lấy tất cả danh sách công việc cho Trang chủ
// @route   GET /api/jobs/all
export const getJobs = async (req, res) => {
    try {
        // Lấy danh sách job và "populate" thông tin Recruiter để lấy logo/tên
        const jobs = await Job.find({ visible: true })
            .populate("recruiter", "companyName logo")
            .sort({ createdAt: -1 }); // Mới nhất hiện lên đầu

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Lỗi lấy danh sách job:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// @desc    Lấy thông tin chi tiết 1 công việc theo ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("recruiter", "companyName logo email") // Lấy thêm email để liên hệ
            .populate("company");
            
        if (!job) {
            return res.status(404).json({ success: false, message: "Không tìm thấy công việc" });
        }
        res.status(200).json({ success: true, job });
    } catch (error) {
        console.error("Lỗi lấy chi tiết job:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};
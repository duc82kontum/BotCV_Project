import Apply from "../models/ApplyModel.js";
import Job from "../models/JobModel.js";

// ==========================================
// --- CHỨC NĂNG DÀNH CHO ỨNG VIÊN (USER) ---
// ==========================================

export const applyForJob = async (req, res) => {
    try {
        const { jobId, userCvUrl, companyId } = req.body;
        const userId = req.user.id; 

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ success: false, message: "Không tìm thấy công việc này!" });

        const existingApply = await Apply.findOne({ userId, jobId });
        if (existingApply) return res.status(400).json({ success: false, message: "Bạn đã ứng tuyển rồi!" });

        // Ưu tiên lấy ID công ty gốc từ bảng Job để chuẩn xác tuyệt đối
        const finalCompanyId = job.recruiter || job.companyId || job.company || companyId;

        const newApply = new Apply({
            userId,
            jobId,
            companyId: finalCompanyId,
            userCvUrl: userCvUrl || "default_cv_path.pdf",
            status: "Đang chờ duyệt"
        });

        await newApply.save();
        
        res.status(200).json({ success: true, message: "Ứng tuyển thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const checkAppliedStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;
        const application = await Apply.findOne({ userId, jobId });
        res.status(200).json({ success: true, applied: !!application, application: application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        const applications = await Apply.find({ userId })
            .populate('jobId')
            .populate('companyId', 'companyName location image'); 
        res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deletedApply = await Apply.findOneAndDelete({ _id: id, userId });
        if (!deletedApply) return res.status(404).json({ success: false, message: "Không tìm thấy đơn!" });
        res.status(200).json({ success: true, message: "Đã hủy ứng tuyển!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// --- CHỨC NĂNG DÀNH CHO NHÀ TUYỂN DỤNG ---
// ==========================================

export const getRecruiterApplications = async (req, res) => {
    try {
        const hrId = req.company._id; 

        // BƯỚC 1: Lấy danh sách ID của tất cả các công việc do HR này đăng
        const myJobs = await Job.find({
            $or: [
                { recruiter: hrId },
                { companyId: hrId },
                { company: hrId }
            ]
        }).select('_id');

        const myJobIds = myJobs.map(job => job._id);

        if (myJobIds.length === 0) {
            return res.status(200).json({ success: true, applications: [] });
        }

        // BƯỚC 2: Tìm tất cả đơn nộp vào danh sách Job ở trên
        const applications = await Apply.find({ jobId: { $in: myJobIds } })
            .populate('userId', 'name email phone image')
            .populate('jobId', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, applications });
    } catch (error) {
        console.error("Lỗi getRecruiterApplications:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body; 

        const application = await Apply.findByIdAndUpdate(
            id, 
            { status },
            { new: true }
        );

        if (!application) return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ!" });

        res.status(200).json({ success: true, message: "Cập nhật thành công!", application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
import express from "express";
import Job from "../models/JobModel.js";

const jobRouter = express.Router();

// API lấy tất cả danh sách công việc cho Trang chủ
jobRouter.get("/all", async (req, res) => {
    try {
        // Lấy danh sách job và "populate" thông tin Recruiter/Company để lấy logo/tên
        const jobs = await Job.find({ visible: true })
            .populate("recruiter", "companyName logo")
            .sort({ createdAt: -1 }); // Mới nhất hiện lên đầu

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Lỗi lấy danh sách job:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});

export default jobRouter;
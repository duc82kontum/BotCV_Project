import express from "express";
import { registerUser, loginUser, getProfileUser, toggleSaveJob, checkSavedStatus, getSavedJobs } from "../controllers/UserController.js";
import authUser from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Lấy dữ liệu cá nhân
userRouter.get("/get-profile", authUser, getProfileUser);

// --- FIX LỖI 404 TẠI ĐÂY ---
// Định nghĩa cả 2 tên miền để hỗ trợ đồng thời AppContext.jsx và SavedJobs.jsx
userRouter.get('/get-saved-jobs', authUser, getSavedJobs); // Dành cho AppContext.jsx gọi đếm số lượng
userRouter.get('/saved-jobs', authUser, getSavedJobs);     // Dành cho SavedJobs.jsx gọi danh sách chi tiết

// Lưu việc làm
userRouter.post('/save-job', authUser, toggleSaveJob);
userRouter.get('/check-saved/:jobId', authUser, checkSavedStatus);

export default userRouter;
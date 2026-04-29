import express from "express";
import { 
    registerUser, 
    loginUser, 
    getProfileUser, 
    updateProfileUser, 
    toggleSaveJob, 
    checkSavedStatus, 
    getSavedJobs,
    getAllUsers 
} from "../controllers/UserController.js";
import authUser from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const userRouter = express.Router();

// 1. AUTHENTICATION (Đăng ký & Đăng nhập)
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// 2. PROFILE (Thông tin cá nhân & Cập nhật hồ sơ kèm CV và Avatar)
userRouter.get("/get-profile", authUser, getProfileUser);

// ĐÃ CẬP NHẬT: Sử dụng upload.fields để nhận nhiều file cùng lúc (image và cvFile)
userRouter.put("/update-profile", authUser, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'cvFile', maxCount: 1 }
]), updateProfileUser);

// 3. SAVED JOBS (Lưu và quản lý việc làm)
// Hỗ trợ cả 2 endpoint để tránh lỗi 404 từ AppContext và SavedJobs.jsx
const savedJobsRoutes = ['/get-saved-jobs', '/saved-jobs'];
savedJobsRoutes.forEach(path => {
    userRouter.get(path, authUser, getSavedJobs);
});

userRouter.post('/save-job', authUser, toggleSaveJob);
userRouter.get('/check-saved/:jobId', authUser, checkSavedStatus);

// 4. ADMIN ONLY (Lấy danh sách người dùng)
userRouter.get("/all-users", authUser, getAllUsers);

export default userRouter;
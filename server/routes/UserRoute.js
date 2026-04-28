// server/routes/UserRoute.js
import express from "express";
import { registerUser, loginUser, getProfileUser, toggleSaveJob, checkSavedStatus, getSavedJobs } from "../controllers/UserController.js";
import authUser from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Route ví dụ: Lấy dữ liệu cá nhân (Cần có Middleware bảo vệ)
// userRouter.get("/get-profile", authUser, getProfileUser); 
userRouter.get("/get-profile", authUser, getProfileUser);

// Khớp với API Frontend đang gọi
// server/routes/UserRoute.js
// Chỉ cần authUser để lấy ID người dùng và getSavedJobs để lấy danh sách
userRouter.get('/saved-jobs', authUser, getSavedJobs); 
userRouter.post('/save-job', authUser, toggleSaveJob);
userRouter.get('/check-saved/:jobId', authUser, checkSavedStatus);

export default userRouter;
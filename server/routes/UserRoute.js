// server/routes/UserRoute.js
import express from "express";
import { registerUser, loginUser, getProfileUser } from "../controllers/UserController.js";
import authUser from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Route ví dụ: Lấy dữ liệu cá nhân (Cần có Middleware bảo vệ)
// userRouter.get("/get-profile", authUser, getProfileUser); 
userRouter.get("/get-profile", authUser, getProfileUser);

export default userRouter;
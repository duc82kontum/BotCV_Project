import express from "express";
import { getProfileUser, getAllUsers } from "../controllers/UserController.js";
import { protectAdmin } from "../middleware/authAdmin.js";

const adminRouter = express.Router();

// 1. Lấy thông tin cá nhân của Admin (Khớp với AppContext.jsx)
adminRouter.get("/profile", protectAdmin, getProfileUser); 

// 2. Lấy danh sách tất cả người dùng (Dành cho trang AdminListAccount)
adminRouter.get("/all-users", protectAdmin, getAllUsers);

// Bạn có thể thêm các Route quản lý khác tại đây sau này
// adminRouter.delete("/delete-user/:id", protectAdmin, deleteUser);

export default adminRouter;
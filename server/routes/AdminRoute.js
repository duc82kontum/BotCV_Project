import express from "express";
import { 
    getAdminStats, 
    getAllAccounts, 
    deleteAccount, 
    getAllApplicationsAdmin, 
    deleteApplicationAdmin,
    getIndustry,       // Đã thêm
    addIndustry,       // Đã thêm
    deleteIndustry     // Đã thêm
} from "../controllers/AdminController.js";
import { protectAdmin } from "../middleware/authAdmin.js";

const adminRouter = express.Router();

// Route cho Dashboard
adminRouter.get("/stats", protectAdmin, getAdminStats);

// Route cho Quản lý tài khoản
adminRouter.get("/accounts", protectAdmin, getAllAccounts);
adminRouter.post("/delete-account", protectAdmin, deleteAccount);

// Route quản lý đơn ứng tuyển
adminRouter.get("/applications", protectAdmin, getAllApplicationsAdmin);
adminRouter.delete("/delete-application/:id", protectAdmin, deleteApplicationAdmin);

// ================= ROUTE CHO QUẢN LÝ NGÀNH NGHỀ =================
adminRouter.get("/list-industry", getIndustry);
adminRouter.post("/add-industry", protectAdmin, addIndustry);
adminRouter.delete("/delete-industry/:id", protectAdmin, deleteIndustry);

export default adminRouter;
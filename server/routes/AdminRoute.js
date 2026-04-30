import express from "express";
import { getAdminStats, getAllAccounts, deleteAccount } from "../controllers/AdminController.js";
import { protectAdmin } from "../middleware/authAdmin.js";

const adminRouter = express.Router();

// Route cho Dashboard[cite: 42]
adminRouter.get("/stats", protectAdmin, getAdminStats);

// Route cho Quản lý tài khoản[cite: 42]
adminRouter.get("/accounts", protectAdmin, getAllAccounts);
adminRouter.post("/delete-account", protectAdmin, deleteAccount);

export default adminRouter;
import express from "express";
import { getProfileUser } from "../controllers/UserController.js";
import authUser from "../middleware/authMiddleware.js";

const adminRouter = express.Router();
adminRouter.get("/profile", authUser, getProfileUser); // Khớp với AppContext.jsx

export default adminRouter;
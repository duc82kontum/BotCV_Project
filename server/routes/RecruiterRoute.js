import express from "express";
import { getProfileUser } from "../controllers/UserController.js";
import authUser from "../middleware/authMiddleware.js";

const recruiterRouter = express.Router();

recruiterRouter.get("/get-profile", authUser, getProfileUser);
recruiterRouter.get("/get_profile", authUser, getProfileUser);

export default recruiterRouter;
import express from "express";
import { getJobs, getJobById } from "../controllers/JobController.js";

const jobRouter = express.Router();

// Route lấy tất cả danh sách công việc
jobRouter.get("/all", getJobs);

// Route lấy chi tiết 1 công việc theo ID
jobRouter.get("/:id", getJobById);

export default jobRouter;
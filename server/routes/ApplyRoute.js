import express from 'express';
// Đã thêm các hàm của Recruiter vào phần import
import { 
    applyForJob, 
    checkAppliedStatus, 
    getUserApplications, 
    deleteApplication,
    getRecruiterApplications, 
    updateApplicationStatus 
} from '../controllers/ApplyController.js';

// Đã thêm protectCompany để bảo vệ các route của nhà tuyển dụng
import authUser, { protectCompany } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// ==========================================
// --- ROUTE CHO ỨNG VIÊN (USER) ---
// ==========================================
router.post('/add', authUser, applyForJob);
router.get('/check-applied/:jobId', authUser, checkAppliedStatus);
router.get('/user-applications', authUser, getUserApplications);
router.delete('/delete/:id', authUser, deleteApplication);

// ==========================================
// --- ROUTE CHO NHÀ TUYỂN DỤNG (RECRUITER) ---
// ==========================================
router.get('/recruiter/applications', protectCompany, getRecruiterApplications);
router.put('/recruiter/update-status/:id', protectCompany, updateApplicationStatus);

export default router;
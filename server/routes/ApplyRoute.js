import express from 'express';
// QUAN TRỌNG: Phải thêm getUserApplications vào đây
import { applyForJob, checkAppliedStatus, getUserApplications } from '../controllers/ApplyController.js';
import authUser from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/add', authUser, applyForJob);
router.get('/check-applied/:jobId', authUser, checkAppliedStatus);

// Route này bây giờ sẽ hoạt động vì hàm đã được import ở trên
router.get('/user-applications', authUser, getUserApplications);

export default router;
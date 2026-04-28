import express from 'express';
import { 
    resgisterCompany, 
    loginCompany, 
    getCompanyProfile,
    postJob,
    getCompanyPostedJobs, // THÊM 3 HÀM NÀY VÀO IMPORT
    changeJobStatus,
    deleteJobs
} from '../controllers/companyController.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tuyến đường Đăng ký doanh nghiệp mới
// Khớp với: POST /api/company/register
router.post('/register', resgisterCompany);

// Tuyến đường Đăng nhập doanh nghiệp
// Khớp với: POST /api/company/login
router.post('/login', loginCompany);

// Lấy thông tin hồ sơ công ty (Cần token xác thực)
router.get('/profile', protectCompany, getCompanyProfile);

// Tuyến đường Đăng tin tuyển dụng mới
// Khớp với: POST /api/company/post-job
router.post('/post-job', protectCompany, postJob);

// --- 3 ROUTE MỚI CHO QUẢN LÝ TIN ĐĂNG ---
router.get('/list-jobs', protectCompany, getCompanyPostedJobs); // Lấy danh sách
router.post('/change-job', protectCompany, changeJobStatus);    // Ẩn/hiện tin
router.delete('/delete/:id', protectCompany, deleteJobs);       // Xóa tin

export default router;
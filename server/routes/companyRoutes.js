import express from 'express';
import { 
    resgisterCompany, 
    loginCompany, 
    getCompanyProfile 
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

export default router;
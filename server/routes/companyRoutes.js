import upload from '../middleware/multer.js'; // Nhớ phải có đuôi .js nhé
import express from 'express';
import { 
    resgisterCompany, 
    loginCompany, 
    getCompanyProfile,
    postJob,
    getCompanyPostedJobs,
    changeJobStatus,
    deleteJobs, 
    updateCompanyProfile
} from '../controllers/companyController.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tuyến đường Đăng ký doanh nghiệp mới
router.post('/register', resgisterCompany);

// Tuyến đường Đăng nhập doanh nghiệp
router.post('/login', loginCompany);

// Lấy thông tin hồ sơ công ty (Cần token xác thực)
router.get('/profile', protectCompany, getCompanyProfile);

// Tuyến đường Đăng tin tuyển dụng mới
router.post('/post-job', protectCompany, postJob);

// --- QUẢN LÝ TIN ĐĂNG ---
router.get('/list-jobs', protectCompany, getCompanyPostedJobs); // Lấy danh sách tin đã đăng
router.post('/change-job', protectCompany, changeJobStatus);    // Ẩn/hiện tin tuyển dụng
router.delete('/delete/:id', protectCompany, deleteJobs);       // Xóa tin tuyển dụng

// --- CẬP NHẬT HỒ SƠ DOANH NGHIỆP ---
// Sử dụng upload.single('image') để có thể nhận file ảnh từ Frontend gửi lên qua FormData
router.put('/update-profile', protectCompany, upload.single('image'), updateCompanyProfile);

export default router;
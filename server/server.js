import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path"; // Thêm để xử lý đường dẫn file
import connectDB from "./config/db.js";
import userRouter from "./routes/UserRoute.js";
import jobRouter from "./routes/JobRoute.js";
import recruiterRouter from './routes/RecruiterRoute.js';
import adminRouter from './routes/AdminRoute.js';
import companyRouter from './routes/companyRoutes.js';

// 1. Khởi tạo App
const app = express();

// 2. Kết nối Database
connectDB().then(() => {
    console.log("✅ Database Connected");
}).catch(err => {
    console.error("❌ Database Connection Error:", err);
});

// 3. Middlewares
const allowedOrigins = [
    'http://localhost:5173', 
    'https://bot-cv-project.vercel.app' 
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json()); 

// CẤU HÌNH PHỤC VỤ FILE TĨNH (Để hiển thị Logo/Banner đã upload)
// Giúp truy cập ảnh qua: http://localhost:5000/uploads/...
app.use('/uploads', express.static('uploads')); 

// 4. Các Routes API
app.use("/api/user", userRouter);
app.use("/api/jobs", jobRouter);

// AUTH & PROFILE DOANH NGHIỆP
// Dùng cho Đăng ký/Đăng nhập (Auth) - Khớp với RecruiterLogin.jsx
app.use("/api/company", companyRouter); 

// Dùng cho các thao tác Profile (Logo, địa chỉ...), đăng tin của nhà tuyển dụng
app.use('/api/recruiter', recruiterRouter);

// QUẢN TRỊ HỆ THỐNG
app.use("/api/admin", adminRouter);

// Route kiểm tra mặc định
app.get("/", (req, res) => {
    res.send("🚀 Server BotCV đang hoạt động mượt mà trên localhost!");
});

// 5. Lắng nghe cổng
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại cổng: ${PORT}`);
});
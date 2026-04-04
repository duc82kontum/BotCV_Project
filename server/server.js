import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/UserRoute.js";

// 1. Khởi tạo App
const app = express();

// 2. Kết nối Database
// Sử dụng .then() hoặc gọi trong một hàm async để tránh lỗi top-level await trên một số môi trường cũ
connectDB().then(() => {
    console.log("✅ Database Connected");
}).catch(err => {
    console.error("❌ Database Connection Error:", err);
});

// 3. Middlewares
// Cấu hình CORS linh hoạt: Cho phép cả localhost (khi dev) và Vercel (khi deploy)
const allowedOrigins = [
    'http://localhost:5173', 
    'https://bot-cv-project.vercel.app' // <-- Thay bằng link Vercel thật của bạn
];

app.use(cors({
    origin: function (origin, callback) {
        // Cho phép các request không có origin (như Postman) hoặc nằm trong danh sách cho phép
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json()); 

// 4. Các Routes API
app.use("/api/user", userRouter);

// Route kiểm tra mặc định
app.get("/", (req, res) => {
    res.send("🚀 Server BotCV đang hoạt động mượt mà trên Cloud!");
});

// 5. Lắng nghe cổng (Quan trọng: process.env.PORT để Render tự cấp cổng)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại cổng: ${PORT}`);
});
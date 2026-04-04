import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/UserRoute.js";

// 1. Khởi tạo App
const app = express();

// 2. Kết nối Database
await connectDB();

// 3. Middlewares cơ bản
app.use(cors());
app.use(express.json()); // Để server đọc được dữ liệu JSON gửi lên
app.use("/api/user", userRouter);
app.use(cors({ origin: "http://localhost:5173" }));

// 4. Route kiểm tra
app.get("/", (req, res) => {
    res.send("Chúc mừng! Server BotCV đã khởi động thành công.");
});

// 5. Lắng nghe cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
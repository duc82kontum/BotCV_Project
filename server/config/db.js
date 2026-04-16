import mongoose from "mongoose";

const connectDB = async () => {
    // 1. Lắng nghe sự kiện kết nối thành công
    mongoose.connection.on('connected', () => {
        console.log('✅ Chúc mừng! Đã kết nối thành công đến MongoDB Atlas');
    });

    // 2. Lắng nghe lỗi duy trì kết nối
    mongoose.connection.on('error', (err) => {
        console.log('❌ Lỗi duy trì kết nối MongoDB:', err);
    });

    try {
        /**
         * 3. Kết nối MongoDB
         * SỬA: Không nối thêm "/job-portal" vào chuỗi URI.
         * Bạn nên cấu hình tên Database trực tiếp trong biến môi trường MONGODB_URI trên Render.
         */
        const conn = await mongoose.connect(process.env.MONGODB_URI); 
        
        console.log(`📡 Host Database: ${conn.connection.host}`);
        // Log tên database để bạn dễ dàng kiểm tra
        console.log(`📂 Database Name: ${conn.connection.name}`); 
        
    } catch (error) {
        console.error("❌ Không thể kết nối đến MongoDB:");
        console.error(error.message);
        // Thoát tiến trình nếu kết nối thất bại để tránh lỗi hệ thống
        process.exit(1); 
    }
}

export default connectDB;
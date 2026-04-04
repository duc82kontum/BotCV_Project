import mongoose from "mongoose";

const connectDB = async () => {
    // Sự kiện này sẽ chạy khi kết nối thành công
    mongoose.connection.on('connected', () => {
        console.log('✅ Chúc mừng! Đã kết nối thành công đến MongoDB Atlas');
    });

    // Sự kiện này chạy nếu có lỗi xảy ra sau khi đã kết nối
    mongoose.connection.on('error', (err) => {
        console.log('❌ Lỗi duy trì kết nối MongoDB:', err);
    });

    try {
        // Nối chuỗi URI từ .env với tên database mong muốn
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`);
        console.log(`📡 Host Database: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ Không thể kết nối đến MongoDB:");
        console.error(error.message);
        process.exit(1); 
    }
}

export default connectDB;
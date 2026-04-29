import multer from 'multer';

// Cấu hình nơi lưu trữ file upload vào thư mục 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // Chỉ định thư mục lưu file là 'uploads' (nằm cùng cấp với server.js)
        callback(null, 'uploads/'); 
    },
    filename: function (req, file, callback) {
        // Tạo tên file duy nhất bằng cách kết hợp thời gian hiện tại và tên gốc
        callback(null, Date.now() + "-" + file.originalname);
    }
});

// Khởi tạo middleware multer
const upload = multer({ storage });

export default upload;
import multer from 'multer';
import path from 'path';

// Thư mục lưu file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tự động phân loại thư mục dựa trên tên trường (fieldname)
    if (file.fieldname === "image") {
      cb(null, 'uploads/avatar');
    } else {
      cb(null, 'uploads/cv');
    }
  },
  filename: function (req, file, cb) {
    // Đổi tên file để tránh trùng lặp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Phân loại: Chỉ cho phép upload PDF hoặc hình ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Lỗi: Chỉ chấp nhận upload file định dạng PDF, JPG hoặc PNG'));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
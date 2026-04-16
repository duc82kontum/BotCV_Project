import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
  // 1. Lấy dữ liệu trực tiếp từ localStorage để đảm bảo có giá trị ngay khi F5
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  // 2. Kiểm tra sự tồn tại của Token
  if (!token) {
    console.warn("ProtectedRoute: Không tìm thấy token, điều hướng về trang chủ.");
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // 3. Kiểm tra quyền hạn (Role)
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.error(`ProtectedRoute: Quyền '${role}' không hợp lệ. Yêu cầu:`, allowedRoles);
    
    // Nếu là admin nhưng vào nhầm trang recruiter hoặc ngược lại, đẩy về đúng chỗ hoặc trang chủ
    return <Navigate to="/" replace />
  }

  // 4. Nếu mọi điều kiện thỏa mãn, cho phép truy cập nội dung
  return children;
}

export default ProtectedRoute;
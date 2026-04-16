import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

/**
 * Component bảo vệ các Route của Admin ở Frontend
 * Ngăn chặn User thường truy cập vào trang Dashboard Admin
 */
const AdminRoute = ({ children }) => {
    // Ưu tiên đọc từ LocalStorage để không bị văng ra khi nhấn F5
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Nếu có token và role đúng là 'admin' thì mới cho xem nội dung
    if (token && role === 'admin') {
        return children;
    }

    // Nếu không phải admin, đẩy ngay về trang chủ và thông báo nhẹ (tùy chọn)
    console.warn("Truy cập trái phép: Bạn không phải Admin!");
    return <Navigate to="/" replace />;
};

export default AdminRoute;
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { token, role } = useContext(AppContext);
    const location = useLocation();

    // 1. Nếu chưa đăng nhập -> Đẩy về trang chủ (hoặc trang Login)
    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 2. Nếu đã đăng nhập nhưng không đúng quyền -> Đẩy về trang chủ
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    // 3. Hợp lệ thì cho vào
    return children;
};

export default ProtectedRoute;
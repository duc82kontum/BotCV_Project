import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // 1. Khởi tạo state: Ưu tiên lấy từ localStorage để giữ trạng thái khi F5
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || ''); 
    const [userData, setUserData] = useState(null);

    // 2. Hàm lấy thông tin hồ sơ tập trung
    const loadUserProfileData = async () => {
        // Chỉ chạy nếu có đủ thông tin định danh
        if (!token || !role) return;

        try {
            // Xác định Endpoint dựa trên Role
            let endpoint = '/api/user/get-profile';
            if (role === 'admin') endpoint = '/api/admin/profile';
            if (role === 'recruiter') endpoint = '/api/recruiter/get-profile';

            const { data } = await axios.get(backendUrl + endpoint, { 
                headers: { 
                    // Gửi token linh hoạt cho cả protectAdmin và authMiddleware
                    token: token, 
                    Authorization: `Bearer ${token}` 
                }
            });

            if (data.success) {
                // Nhận diện dữ liệu linh hoạt từ Backend
                setUserData(data.user || data.admin || data.recruiter || data.data);
            } else {
                // Chỉ logout nếu thông báo lỗi liên quan đến xác thực
                if (data.message && data.message.toLowerCase().includes("mã xác thực")) {
                    logout();
                }
            }
        } catch (error) {
            const status = error.response?.status;
            console.error("Lỗi xác thực Profile:", status || error.message);
            
            // CHỈ logout khi chắc chắn Token hết hạn (401) hoặc sai quyền nghiêm trọng (403)
            if (status === 401 || status === 403) {
                logout();
            }
            // Các lỗi khác (404, 500) sẽ giữ nguyên trạng thái để tránh văng người dùng
        }
    }

    // 3. Hàm Logout: Dọn dẹp sạch sẽ bộ nhớ
    const logout = () => {
        setToken('');
        setRole('');
        setUserData(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        toast.info("Phiên làm việc đã kết thúc");
    }

    // 4. Đồng bộ hóa LocalStorage khi State thay đổi
    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    useEffect(() => {
        if (role) localStorage.setItem('role', role);
        else localStorage.removeItem('role');
    }, [role]);

    // 5. Tự động nạp dữ liệu Profile
    useEffect(() => {
        if (token && role && !userData) {
            loadUserProfileData();
        }
    }, [token, role, userData]);

    const value = {
        backendUrl,
        token, setToken,
        role, setRole,
        userData, setUserData,
        loadUserProfileData,
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
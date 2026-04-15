import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // Khởi tạo state từ localStorage
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || ''); 
    const [userData, setUserData] = useState(null);

    // 1. Hàm lấy thông tin người dùng (Đã sửa lỗi Endpoint để tránh 404)
    const loadUserProfileData = async () => {
        if (!token || !role) return;

        try {
            // Đảm bảo endpoint khớp hoàn toàn với Backend (sử dụng dấu gạch nối -)
            let endpoint = '/api/user/get-profile';
            if (role === 'admin') endpoint = '/api/admin/profile';
            if (role === 'recruiter') endpoint = '/api/recruiter/get-profile';

            const { data } = await axios.get(backendUrl + endpoint, { 
                headers: { 
                    token: token, 
                    Authorization: `Bearer ${token}` 
                }
            });

            if (data.success) {
                // Nhận diện dữ liệu: data.user, data.recruiter, data.admin hoặc data.data
                setUserData(data.user || data.recruiter || data.admin || data.data);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Lỗi xác thực Profile:", error.response?.data || error.message);
            // Nếu lỗi 404 là do sai endpoint, nếu lỗi 401/403 là do token
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            }
        }
    }

    // 2. Hàm Logout tập trung
    const logout = () => {
        setToken('');
        setRole('');
        setUserData(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        if (token) toast.info("Phiên làm việc đã kết hạn");
    }

    // 3. Tự động đồng bộ hóa LocalStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    }, [role]);

    // 4. Tự động tải dữ liệu khi có Token và Role
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
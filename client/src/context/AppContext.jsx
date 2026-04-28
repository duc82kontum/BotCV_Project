import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // 1. Khởi tạo state
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || ''); 
    const [userData, setUserData] = useState(null);
    
    // Quản lý số lượng đơn ứng tuyển và việc làm đã lưu
    const [applyCount, setApplyCount] = useState(0);
    const [savedCount, setSavedCount] = useState(0); // THÊM MỚI

    // 2. Hàm lấy số lượng đơn ứng tuyển
    const fetchApplyCount = async () => {
        if (!token || role !== 'user') {
            setApplyCount(0);
            return;
        }
        try {
            const { data } = await axios.get(backendUrl + '/api/apply/user-applications', {
                headers: { token }
            });
            if (data.success) {
                setApplyCount(data.applications.length);
            }
        } catch (error) {
            console.error("Lỗi lấy số lượng ứng tuyển:", error.message);
        }
    };

    // 3. Hàm lấy số lượng việc làm đã lưu (Cập nhật Real-time cho Navbar)
    const fetchSavedCount = async () => {
        if (!token || role !== 'user') {
            setSavedCount(0);
            return;
        }
        try {
            const { data } = await axios.get(backendUrl + '/api/user/saved-jobs', {
                headers: { token }
            });
            if (data.success) {
                setSavedCount(data.savedJobs.length);
            }
        } catch (error) {
            console.error("Lỗi lấy số lượng việc đã lưu:", error.message);
        }
    };

    // 4. Hàm lấy thông tin hồ sơ tập trung
    const loadUserProfileData = async () => {
        if (!token || !role) return;

        try {
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
                setUserData(data.user || data.admin || data.recruiter || data.data);
            } else {
                if (data.message && data.message.toLowerCase().includes("mã xác thực")) {
                    logout();
                }
            }
        } catch (error) {
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                logout();
            }
        }
    }

    // 5. Hàm Logout
    const logout = () => {
        setToken('');
        setRole('');
        setUserData(null);
        setApplyCount(0);
        setSavedCount(0); // Reset số lượng đã lưu khi logout
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        toast.info("Phiên làm việc đã kết thúc");
    }

    // 6. Đồng bộ LocalStorage
    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    useEffect(() => {
        if (role) localStorage.setItem('role', role);
        else localStorage.removeItem('role');
    }, [role]);

    // 7. Tự động nạp dữ liệu khi khởi chạy hoặc đăng nhập
    useEffect(() => {
        if (token && role) {
            if (!userData) loadUserProfileData();
            if (role === 'user') {
                fetchApplyCount();
                fetchSavedCount(); // Tự nạp số lượng đã lưu
            }
        }
    }, [token, role]);

    const value = {
        backendUrl,
        token, setToken,
        role, setRole,
        userData, setUserData,
        applyCount, setApplyCount,
        savedCount, setSavedCount, // Export state số lượng đã lưu
        fetchApplyCount,
        fetchSavedCount,           // Export hàm để gọi lại sau khi nhấn Lưu/Bỏ lưu
        loadUserProfileData,
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
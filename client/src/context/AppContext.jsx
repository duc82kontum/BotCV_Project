import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // 1. Khởi tạo state từ localStorage để giữ phiên khi F5
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || ''); 
    const [userData, setUserData] = useState(null);
    
    const [applyCount, setApplyCount] = useState(0);
    const [savedCount, setSavedCount] = useState(0);

    // 2. Hàm lấy số lượng đơn ứng tuyển (chỉ cho User)
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

    // 3. Hàm lấy số lượng việc làm đã lưu (chỉ cho User)
    const fetchSavedCount = async () => {
        if (!token || role !== 'user') {
            setSavedCount(0);
            return;
        }
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-saved-jobs', {
                headers: { token }
            });
            if (data.success) {
                setSavedCount(data.savedJobs.length);
            }
        } catch (error) {
            console.error("Lỗi lấy số lượng đã lưu:", error.message);
        }
    };

    // 4. QUAN TRỌNG: Hàm nạp lại Profile khi Reload trang
    const loadUserProfileData = async () => {
        if (!token || !role) return;

        try {
            // Xác định đúng đường dẫn API dựa trên Role (Hỗ trợ Admin, User và Recruiter)
            const endpoint = (role === 'admin' || role === 'user') 
                ? '/api/user/get-profile' // API lấy thông tin ứng viên (hoặc admin)
                : '/api/company/profile'; // API lấy thông tin nhà tuyển dụng

            const { data } = await axios.get(backendUrl + endpoint, { 
                headers: { token } 
            });

            if (data.success) {
                // ĐÃ FIX: Nhận diện cả 'user' (từ UserController) và 'userData' (từ companyController)
                setUserData(data.user || data.userData);
            } else {
                logout(); // Nếu token không hợp lệ thì đá ra
            }
        } catch (error) {
            console.error("Lỗi nạp profile:", error.message);
            if (error.response?.status === 401) logout();
        }
    };

    // 5. Hàm Đăng xuất
    const logout = () => {
        setToken('');
        setRole('');
        setUserData(null);
        setApplyCount(0);
        setSavedCount(0);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        toast.info("Phiên làm việc đã kết thúc");
    };

    // 6. Đồng bộ LocalStorage khi State thay đổi
    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    useEffect(() => {
        if (role) localStorage.setItem('role', role);
        else localStorage.removeItem('role');
    }, [role]);

    // 7. Tự động nạp dữ liệu khi khởi chạy hoặc khi có Token/Role mới
    useEffect(() => {
        if (token && role) {
            loadUserProfileData(); // Luôn nạp lại profile để có userData
            
            if (role === 'user') {
                fetchApplyCount();
                fetchSavedCount();
            }
        }
    }, [token, role]);

    const value = {
        backendUrl,
        token, setToken,
        role, setRole,
        userData, setUserData,
        applyCount, setApplyCount,
        savedCount, setSavedCount,
        fetchApplyCount,
        fetchSavedCount,
        loadUserProfileData,
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
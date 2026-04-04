import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    // 1. Hàm lấy thông tin người dùng từ Backend
    const loadUserProfileData = async () => {
        try {
            // Gửi token lên header để server biết bạn là ai
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { 
                headers: { token } 
            });

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // 2. Quản lý Token và tự động lấy dữ liệu khi có Token
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            loadUserProfileData(); // Có token là tự động đi lấy tên ngay
        } else {
            localStorage.removeItem('token');
            setUserData(null); // Đăng xuất thì xóa sạch dữ liệu cũ
        }
    }, [token]);

    const value = {
        backendUrl,
        token, setToken,
        userData, setUserData,
        loadUserProfileData // Cho phép các file khác gọi lại hàm này nếu cần
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};